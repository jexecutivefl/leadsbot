import React, { useState, useEffect } from 'react';
import styles from './AIChatPage.module.css';
import ChatInterface, { ChatMessage } from '../../components/ai/ChatInterface';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { aiService } from '../../services/aiService';
import { conversationService } from '../../services/conversationService';
import { leadService } from '../../services/leadService';

const AIChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [aiConfigStatus, setAiConfigStatus] = useState<{ configured: boolean; message: string } | null>(null);

  useEffect(() => {
    loadLeads();
    initializeChat();
    checkAIConfiguration();
  }, []);

  const checkAIConfiguration = () => {
    const status = aiService.getConfigurationStatus();
    setAiConfigStatus(status);
  };

  const loadLeads = async () => {
    try {
      const leadsData = await leadService.listLeads();
      setLeads(leadsData || []);
    } catch (error) {
      console.error('Error loading leads:', error);
      setLeads([]); // Set empty array instead of showing error
    }
  };

  const initializeChat = async () => {
    try {
      // Create a new conversation
      const conversation = await conversationService.createConversation({
        channel: 'aiChat',
        aiHandling: true,
      });
      
      if (!conversation.data) {
        throw new Error('Failed to create conversation');
      }
      
      setConversationId(conversation.data.id);

      // Add welcome message based on AI configuration
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: aiService.isAIConfigured() 
          ? 'Hello! I\'m your AI assistant. I can help you with lead management, follow-ups, and insights. What would you like to know?'
          : 'Hello! I\'m your AI assistant, but I need to be configured first. Please add your OpenAI API key to the .env file to enable AI features.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing chat:', error);
      setError('Failed to initialize chat');
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!conversationId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Add user message to conversation
      await conversationService.addMessage(conversationId, {
        content: message,
        sender: 'user',
        timestamp: new Date(),
        metadata: { leadId: selectedLeadId }
      });

      // Check if AI is configured
      if (!aiService.isAIConfigured()) {
        const configMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: 'I\'m not configured yet. Please add your OpenAI API key to the .env file to enable AI features. For now, I can help you with basic lead management tasks.',
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, configMessage]);
        return;
      }

      // Get AI response
      const startTime = Date.now();
      const aiResponse = await aiService.sendMessage(message, conversationId, selectedLeadId || undefined);
      const responseTime = Date.now() - startTime;

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        sender: 'ai',
        timestamp: new Date()
      };

      // Add AI message to conversation
      await conversationService.addMessage(conversationId, {
        content: aiResponse.content,
        sender: 'ai',
        timestamp: new Date(),
        metadata: {
          leadId: selectedLeadId,
          sentiment: aiResponse.sentiment,
          intent: aiResponse.intent,
          responseTime
        }
      });

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API configuration and try again.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      if (conversationId) {
        await conversationService.completeConversation(conversationId);
      }
      await initializeChat();
    } catch (error) {
      console.error('Error clearing chat:', error);
      setError('Failed to clear chat');
    }
  };

  const handleLeadSelect = (leadId: string) => {
    setSelectedLeadId(leadId);
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      const contextMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `Now working with lead: ${lead.firstName} ${lead.lastName} (${lead.email || lead.phone})`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, contextMessage]);
    }
  };

  const generateFollowUpEmail = async () => {
    if (!selectedLeadId) {
      setError('Please select a lead first');
      return;
    }

    if (!aiService.isAIConfigured()) {
      setError('AI is not configured. Please add your OpenAI API key to enable this feature.');
      return;
    }

    setIsLoading(true);
    try {
      const email = await aiService.generateFollowUpEmail(selectedLeadId);
      const emailMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `Here's a follow-up email for your lead:\n\n${email}`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, emailMessage]);
    } catch (error) {
      console.error('Error generating email:', error);
      setError('Failed to generate follow-up email');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeLeadSentiment = async () => {
    if (!selectedLeadId) {
      setError('Please select a lead first');
      return;
    }

    if (!aiService.isAIConfigured()) {
      setError('AI is not configured. Please add your OpenAI API key to enable this feature.');
      return;
    }

    setIsLoading(true);
    try {
      const analysis = await aiService.analyzeLeadSentiment(selectedLeadId);
      const analysisMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `Lead Sentiment Analysis:\n\nSentiment: ${analysis.sentiment}\nConfidence: ${(analysis.confidence * 100).toFixed(1)}%\nKey Topics: ${analysis.keyTopics.join(', ') || 'None identified'}`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, analysisMessage]);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      setError('Failed to analyze lead sentiment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.aiChatPage}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>AI Assistant</h1>
          <p>Get help with lead management, follow-ups, and insights</p>
        </div>
        <div className={styles.actions}>
          <Button 
            variant="outline" 
            onClick={clearChat}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          >
            Clear Chat
          </Button>
        </div>
      </div>

      {aiConfigStatus && !aiConfigStatus.configured && (
        <div className={styles.configBanner}>
          <div className={styles.configContent}>
            <div className={styles.configIcon}>⚠️</div>
            <div className={styles.configText}>
              <strong>AI Configuration Required</strong>
              <p>{aiConfigStatus.message}</p>
              <p>Create a <code>.env</code> file in the root directory and add: <code>VITE_OPENAI_API_KEY=your_api_key_here</code></p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.errorBanner}>
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className={styles.chatContainer}>
        <Card className={styles.chatCard}>
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder={aiService.isAIConfigured() ? "Ask me about leads, follow-ups, or anything else..." : "AI not configured. Add API key to enable features."}
            disabled={!aiService.isAIConfigured()}
          />
        </Card>
      </div>

      <div className={styles.sidebar}>
        <Card className={styles.leadsCard}>
          <h3>Select Lead</h3>
          <div className={styles.leadsList}>
            {leads.map(lead => (
              <button
                key={lead.id}
                onClick={() => handleLeadSelect(lead.id)}
                className={`${styles.leadItem} ${selectedLeadId === lead.id ? styles.selected : ''}`}
              >
                <div className={styles.leadInfo}>
                  <strong>{lead.firstName} {lead.lastName}</strong>
                  <span>{lead.email || lead.phone}</span>
                  <span className={styles.leadStatus}>{lead.status}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className={styles.suggestionsCard}>
          <h3>Quick Actions</h3>
          <div className={styles.suggestions}>
            <Button 
              variant="ghost" 
              size="small"
              onClick={() => handleSendMessage("Show me my recent leads")}
              className={styles.suggestionButton}
            >
              Show recent leads
            </Button>
            <Button 
              variant="ghost" 
              size="small"
              onClick={() => handleSendMessage("Help me follow up with leads")}
              className={styles.suggestionButton}
            >
              Follow-up assistance
            </Button>
            <Button 
              variant="ghost" 
              size="small"
              onClick={() => handleSendMessage("Generate lead insights")}
              className={styles.suggestionButton}
            >
              Generate insights
            </Button>
            {selectedLeadId && aiService.isAIConfigured() && (
              <>
                <Button 
                  variant="ghost" 
                  size="small"
                  onClick={generateFollowUpEmail}
                  className={styles.suggestionButton}
                >
                  Create email template
                </Button>
                <Button 
                  variant="ghost" 
                  size="small"
                  onClick={analyzeLeadSentiment}
                  className={styles.suggestionButton}
                >
                  Analyze sentiment
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIChatPage; 
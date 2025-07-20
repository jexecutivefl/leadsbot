import React, { useState } from 'react';
import styles from './AIChatPage.module.css';
import ChatInterface, { ChatMessage } from '../../components/ai/ChatInterface';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AIChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. I can help you with lead management, follow-ups, and insights. What would you like to know?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${message}". Let me help you with that. This is a simulated response - in the real app, this would connect to your AI service.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: 'Hello! I\'m your AI assistant. I can help you with lead management, follow-ups, and insights. What would you like to know?',
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
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

      <div className={styles.chatContainer}>
        <Card className={styles.chatCard}>
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder="Ask me about leads, follow-ups, or anything else..."
          />
        </Card>
      </div>

      <div className={styles.sidebar}>
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
            <Button 
              variant="ghost" 
              size="small"
              onClick={() => handleSendMessage("Help me create a follow-up email")}
              className={styles.suggestionButton}
            >
              Create email template
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIChatPage; 
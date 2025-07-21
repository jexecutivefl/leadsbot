import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIConversation {
  id: string;
  leadId?: string;
  messages: AIMessage[];
  context?: string;
}

export interface AIResponse {
  content: string;
  intent?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  suggestedActions?: string[];
}

export class AIService {
  private apiKey: string;
  private baseUrl: string;
  private isConfigured: boolean;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
    this.isConfigured = !!this.apiKey;
  }

  private async makeOpenAIRequest(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.isConfigured) {
      throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';

      return {
        content,
        intent: this.detectIntent(content),
        sentiment: this.analyzeSentiment(content),
        suggestedActions: this.generateSuggestedActions(content),
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  private detectIntent(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('lead') || lowerContent.includes('contact')) {
      return 'lead_management';
    }
    if (lowerContent.includes('follow') || lowerContent.includes('email')) {
      return 'follow_up';
    }
    if (lowerContent.includes('insight') || lowerContent.includes('analytics')) {
      return 'analytics';
    }
    if (lowerContent.includes('appointment') || lowerContent.includes('schedule')) {
      return 'scheduling';
    }
    
    return 'general';
  }

  private analyzeSentiment(content: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['great', 'excellent', 'good', 'helpful', 'thanks', 'thank you', 'awesome'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'frustrated'];
    
    const lowerContent = content.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private generateSuggestedActions(content: string): string[] {
    const actions = [];
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('lead')) {
      actions.push('View recent leads', 'Create new lead', 'Update lead status');
    }
    if (lowerContent.includes('follow')) {
      actions.push('Send follow-up email', 'Schedule follow-up call', 'Set reminder');
    }
    if (lowerContent.includes('insight')) {
      actions.push('View analytics dashboard', 'Generate report', 'Export data');
    }
    
    return actions.slice(0, 3);
  }

  async sendMessage(message: string, conversationId?: string, leadId?: string): Promise<AIResponse> {
    try {
      // Get conversation history if conversationId exists and we have a leadId
      let conversationHistory: AIMessage[] = [];
      if (conversationId && leadId) {
        const conversation = await this.getConversation(conversationId);
        // Note: Conversation history is stored in Communication records, not in the Conversation model
        if (conversation?.data?.leadId) {
          const communications = await client.models.Communication.list({
            filter: { leadId: { eq: conversation.data.leadId } }
          });
          conversationHistory = communications.data
            .filter(comm => comm.type === 'aiChat')
            .map(comm => ({
              role: comm.aiGenerated ? 'assistant' : 'user',
              content: comm.content
            }));
        }
      }

      // Create system prompt based on context
      const systemPrompt = this.createSystemPrompt(leadId);
      
      // Build messages array
      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      // Get AI response
      const response = await this.makeOpenAIRequest(messages);

      // Save conversation to database only if we have a leadId
      if (conversationId && leadId) {
        await this.updateConversation(conversationId, [
          ...conversationHistory,
          { role: 'user', content: message },
          { role: 'assistant', content: response.content }
        ]);
      } else if (conversationId) {
        // Just update the conversation summary for general conversations
        await this.updateConversation(conversationId, [
          { role: 'user', content: message },
          { role: 'assistant', content: response.content }
        ]);
      } else {
        await this.createConversation(leadId, [
          { role: 'user', content: message },
          { role: 'assistant', content: response.content }
        ]);
      }

      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  private createSystemPrompt(leadId?: string): string {
    let prompt = `You are an AI assistant for a real estate lead management system. You help agents manage leads, follow-ups, and provide insights. 

Key capabilities:
- Lead management and tracking
- Follow-up scheduling and reminders
- Email template generation
- Analytics and reporting
- Appointment scheduling

Be helpful, professional, and concise. If you need more information about a specific lead, ask for the lead ID.`;

    if (leadId) {
      prompt += `\n\nCurrent context: Working with lead ID ${leadId}. You can access lead details and history.`;
    }

    return prompt;
  }

  async createConversation(leadId?: string, messages: AIMessage[] = []): Promise<string> {
    try {
      const conversation = await client.models.Conversation.create({
        leadId: leadId || undefined,
        status: 'active',
        channel: 'aiChat',
        lastMessageAt: new Date().toISOString(),
        messageCount: messages.length,
        aiHandling: true,
        conversationSummary: messages.length > 0 ? messages[messages.length - 1].content.substring(0, 200) : '',
      });

      if (!conversation.data) {
        throw new Error('Failed to create conversation');
      }

      return conversation.data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  async getConversation(conversationId: string) {
    try {
      const conversation = await client.models.Conversation.get({ id: conversationId });
      return conversation;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  async updateConversation(conversationId: string, messages: AIMessage[]) {
    try {
      await client.models.Conversation.update({
        id: conversationId,
        lastMessageAt: new Date().toISOString(),
        messageCount: messages.length,
        conversationSummary: messages[messages.length - 1].content.substring(0, 200),
      });
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  }

  async getLeadContext(leadId: string) {
    try {
      const lead = await client.models.Lead.get({ id: leadId });
      if (!lead) return null;

      const communications = await client.models.Communication.list({
        filter: { leadId: { eq: leadId } }
      });

      return {
        lead: lead.data,
        communications: communications.data,
      };
    } catch (error) {
      console.error('Error fetching lead context:', error);
      throw error;
    }
  }

  async generateFollowUpEmail(leadId: string, context?: string): Promise<string> {
    try {
      const leadContext = await this.getLeadContext(leadId);
      if (!leadContext || !leadContext.lead) {
        throw new Error('Lead not found');
      }

      const { lead, communications } = leadContext;
      
      const systemPrompt = `You are an expert real estate agent writing a follow-up email. 
      
Lead Information:
- Name: ${lead.firstName} ${lead.lastName}
- Status: ${lead.status}
- Source: ${lead.source}
- Last Contact: ${lead.lastContacted || 'Not contacted yet'}
- Notes: ${lead.notes || 'No notes'}

Previous Communications: ${communications.length} messages

Write a professional, personalized follow-up email that:
1. References their specific situation
2. Provides value
3. Has a clear call-to-action
4. Is warm but not pushy

Keep it under 150 words.`;

      const response = await this.makeOpenAIRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: context || 'Generate a follow-up email for this lead' }
      ]);

      return response.content;
    } catch (error) {
      console.error('Error generating follow-up email:', error);
      throw error;
    }
  }

  async analyzeLeadSentiment(leadId: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    keyTopics: string[];
  }> {
    try {
      const leadContext = await this.getLeadContext(leadId);
      if (!leadContext) {
        throw new Error('Lead not found');
      }

      const { communications } = leadContext;
      
      if (communications.length === 0) {
        return {
          sentiment: 'neutral',
          confidence: 0,
          keyTopics: []
        };
      }

      const messages = communications
        .filter(comm => comm.content)
        .map(comm => comm.content)
        .join('\n');

      const systemPrompt = `Analyze the sentiment and key topics from these real estate lead communications. 
      
Return a JSON response with:
- sentiment: "positive", "neutral", or "negative"
- confidence: number between 0 and 1
- keyTopics: array of key topics mentioned

Communications:
${messages}`;

      const response = await this.makeOpenAIRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Analyze the sentiment and extract key topics.' }
      ]);

      try {
        const analysis = JSON.parse(response.content);
        return {
          sentiment: analysis.sentiment || 'neutral',
          confidence: analysis.confidence || 0,
          keyTopics: analysis.keyTopics || []
        };
      } catch {
        return {
          sentiment: 'neutral',
          confidence: 0,
          keyTopics: []
        };
      }
    } catch (error) {
      console.error('Error analyzing lead sentiment:', error);
      throw error;
    }
  }

  // Method to check if AI service is properly configured
  isAIConfigured(): boolean {
    return this.isConfigured;
  }

  // Method to get configuration status
  getConfigurationStatus(): { configured: boolean; message: string } {
    if (this.isConfigured) {
      return {
        configured: true,
        message: 'OpenAI API is configured and ready to use.'
      };
    } else {
      return {
        configured: false,
        message: 'OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.'
      };
    }
  }
}

export const aiService = new AIService(); 
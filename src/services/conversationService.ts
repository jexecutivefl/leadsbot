import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export interface ConversationMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  metadata?: any;
}

export interface CreateConversationInput {
  leadId?: string;
  status?: 'active' | 'paused' | 'completed' | 'handedOff';
  channel?: 'sms' | 'email' | 'whatsapp' | 'voice' | 'aiChat';
  aiHandling?: boolean;
}

export class ConversationService {
  async createConversation(input: CreateConversationInput) {
    try {
      const conversation = await client.models.Conversation.create({
        leadId: input.leadId || undefined,
        status: input.status || 'active',
        channel: input.channel || 'aiChat',
        lastMessageAt: new Date().toISOString(),
        messageCount: 0,
        aiHandling: input.aiHandling !== false,
      });
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  async getConversation(id: string) {
    try {
      const conversation = await client.models.Conversation.get({ id });
      return conversation;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  async listConversations(leadId?: string) {
    try {
      const filter = leadId ? { leadId: { eq: leadId } } : undefined;
      const conversations = await client.models.Conversation.list({ filter });
      return conversations.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  async updateConversation(id: string, updates: Partial<{
    status: 'active' | 'paused' | 'completed' | 'handedOff';
    lastMessageAt: Date;
    messageCount: number;
    aiHandling: boolean;
    handoffReason: string;
    handoffTime: Date;
    conversationSummary: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    intent: string;
    nextAction: string;
  }>) {
    try {
      const conversation = await client.models.Conversation.update({
        id,
        ...updates,
        lastMessageAt: updates.lastMessageAt?.toISOString(),
        handoffTime: updates.handoffTime?.toISOString(),
      });
      return conversation;
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  }

  async deleteConversation(id: string) {
    try {
      await client.models.Conversation.delete({ id });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  async addMessage(conversationId: string, message: Omit<ConversationMessage, 'id' | 'conversationId'>) {
    try {
      // Only create communication record if we have a leadId
      if (message.metadata?.leadId) {
        await client.models.Communication.create({
          leadId: message.metadata.leadId,
          type: 'aiChat',
          direction: message.sender === 'user' ? 'inbound' : 'outbound',
          content: message.content,
          status: 'delivered',
          aiGenerated: message.sender === 'ai',
          sentiment: message.metadata?.sentiment || 'neutral',
          intent: message.metadata?.intent,
          responseTime: message.metadata?.responseTime,
        });
      }

      // Update conversation
      const conversation = await this.getConversation(conversationId);
      const currentMessageCount = conversation?.data?.messageCount || 0;
      
      await this.updateConversation(conversationId, {
        lastMessageAt: message.timestamp,
        messageCount: currentMessageCount + 1,
        conversationSummary: message.content.substring(0, 200),
        sentiment: message.metadata?.sentiment,
        intent: message.metadata?.intent,
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  async getConversationMessages(conversationId: string) {
    try {
      const conversation = await this.getConversation(conversationId);
      if (!conversation?.data?.leadId) {
        // For general AI conversations without a specific lead, we can't fetch messages
        // since they're stored in Communication records linked to leads
        return [];
      }

      const communications = await client.models.Communication.list({
        filter: { leadId: { eq: conversation.data.leadId } }
      });

      return communications.data
        .filter(comm => comm.type === 'aiChat')
        .map(comm => ({
          id: comm.id,
          conversationId,
          content: comm.content,
          sender: comm.aiGenerated ? 'ai' : 'user',
          timestamp: new Date(comm.createdAt),
          metadata: {
            sentiment: comm.sentiment,
            intent: comm.intent,
            responseTime: comm.responseTime,
          }
        }))
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      throw error;
    }
  }

  async getActiveConversations() {
    try {
      const conversations = await client.models.Conversation.list({
        filter: { status: { eq: 'active' } }
      });
      return conversations.data;
    } catch (error) {
      console.error('Error fetching active conversations:', error);
      throw error;
    }
  }

  async handoffConversation(conversationId: string, reason: string, userId?: string) {
    try {
      await this.updateConversation(conversationId, {
        status: 'handedOff',
        handoffReason: reason,
        handoffTime: new Date(),
        aiHandling: false,
      });

      // Create notification for human agent
      if (userId) {
        await client.models.Notification.create({
          userId,
          type: 'aiHandoff',
          title: 'AI Conversation Handoff',
          message: `AI conversation requires human intervention. Reason: ${reason}`,
          priority: 'high',
          actionUrl: `/conversations/${conversationId}`,
        });
      }
    } catch (error) {
      console.error('Error handing off conversation:', error);
      throw error;
    }
  }

  async pauseConversation(conversationId: string) {
    try {
      await this.updateConversation(conversationId, {
        status: 'paused',
      });
    } catch (error) {
      console.error('Error pausing conversation:', error);
      throw error;
    }
  }

  async resumeConversation(conversationId: string) {
    try {
      await this.updateConversation(conversationId, {
        status: 'active',
      });
    } catch (error) {
      console.error('Error resuming conversation:', error);
      throw error;
    }
  }

  async completeConversation(conversationId: string) {
    try {
      await this.updateConversation(conversationId, {
        status: 'completed',
      });
    } catch (error) {
      console.error('Error completing conversation:', error);
      throw error;
    }
  }

  async getConversationAnalytics(conversationId: string) {
    try {
      const conversation = await this.getConversation(conversationId);
      if (!conversation) return null;

      const messages = await this.getConversationMessages(conversationId);
      
      const analytics = {
        totalMessages: messages.length,
        userMessages: messages.filter(m => m.sender === 'user').length,
        aiMessages: messages.filter(m => m.sender === 'ai').length,
        averageResponseTime: 0,
        sentiment: 'neutral' as 'positive' | 'neutral' | 'negative',
        keyTopics: [] as string[],
        duration: 0,
      };

      if (messages.length > 1) {
        const firstMessage = messages[0];
        const lastMessage = messages[messages.length - 1];
        analytics.duration = lastMessage.timestamp.getTime() - firstMessage.timestamp.getTime();

        // Calculate average response time
        const responseTimes = [];
        for (let i = 0; i < messages.length - 1; i++) {
          if (messages[i].sender === 'user' && messages[i + 1].sender === 'ai') {
            const responseTime = messages[i + 1].timestamp.getTime() - messages[i].timestamp.getTime();
            responseTimes.push(responseTime);
          }
        }
        
        if (responseTimes.length > 0) {
          analytics.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        }
      }

      return analytics;
    } catch (error) {
      console.error('Error getting conversation analytics:', error);
      throw error;
    }
  }
}

export const conversationService = new ConversationService(); 
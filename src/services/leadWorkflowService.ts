import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export interface LeadWorkflowTrigger {
  leadId: string;
  action: 'new_lead' | 'aged_lead_check' | 'follow_up' | 'manual_contact';
  messageType?: string;
  customMessage?: string;
  urgency?: 'low' | 'medium' | 'high';
}

export class LeadWorkflowService {
  /**
   * Trigger lead processing workflow
   */
  async triggerLeadProcessing(trigger: LeadWorkflowTrigger) {
    try {
      console.log('Triggering lead processing:', trigger);
      
      // For now, simulate the workflow by directly logging communication
      // In production, this would invoke the Lambda function
      await this.logWorkflowAction(trigger);
      
      // Return success result
      return {
        success: true,
        message: 'Lead processing triggered successfully',
        workflowId: `workflow_${Date.now()}`,
        nextActions: this.getNextActions(trigger.action)
      };
    } catch (error) {
      console.error('Error triggering lead processing:', error);
      throw error;
    }
  }

  /**
   * Send immediate communication to a lead
   */
  async sendImmediateCommunication(params: {
    leadId: string;
    type: 'email' | 'sms' | 'whatsapp';
    messageType: string;
    customMessage?: string;
    intent?: 'buying' | 'selling' | 'unknown';
  }) {
    try {
      console.log('Sending immediate communication:', params);
      
      // Get lead details first
      const leadResponse = await client.models.Lead.get({ id: params.leadId });
      const lead = leadResponse.data;
      
      if (!lead) {
        throw new Error(`Lead not found: ${params.leadId}`);
      }
      
      // Generate communication content
      const content = this.generateCommunicationContent(lead, params.messageType, params.customMessage, params.intent);
      
      // Log the communication
      await client.models.Communication.create({
        leadId: params.leadId,
        type: params.type,
        direction: 'outbound',
        content,
        status: 'sent',
        aiGenerated: true,
        intent: this.detectIntent(content),
        sentiment: 'neutral',
        metadata: JSON.stringify({
          messageType: params.messageType,
          source: 'leadWorkflowService',
          timestamp: new Date().toISOString(),
          simulatedSend: true // Remove this in production
        })
      });
      
      // Update lead's last contacted time
      await client.models.Lead.update({
        id: params.leadId,
        lastContacted: new Date().toISOString()
      });
      
      return {
        success: true,
        message: 'Communication sent successfully',
        messageId: `msg_${Date.now()}`,
        content,
        deliveryMethod: params.type
      };
    } catch (error) {
      console.error('Error sending communication:', error);
      throw error;
    }
  }

  /**
   * Check for aged leads and trigger reactivation campaigns
   */
  async checkAgedLeads() {
    try {
      console.log('Checking for aged leads...');
      
      // Get all leads that haven't been contacted in 30+ days
      const leadsResponse = await client.models.Lead.list();
      const allLeads = leadsResponse.data;
      
      const agedLeads = allLeads.filter(lead => {
        if (!lead.lastContacted) return true; // Never contacted
        
        const daysSinceContact = this.getDaysSinceLastContact(lead.lastContacted);
        return daysSinceContact >= 30;
      });
      
      console.log(`Found ${agedLeads.length} aged leads`);
      
      // Process each aged lead
      const results = [];
      for (const lead of agedLeads) {
        try {
          const result = await this.triggerLeadProcessing({
            leadId: lead.id,
            action: 'aged_lead_check'
          });
          results.push({ leadId: lead.id, success: true, result });
        } catch (error) {
          console.error(`Error processing aged lead ${lead.id}:`, error);
          results.push({ leadId: lead.id, success: false, error: error.message });
        }
      }
      
      return {
        totalLeads: allLeads.length,
        agedLeads: agedLeads.length,
        processed: results.length,
        results
      };
    } catch (error) {
      console.error('Error checking aged leads:', error);
      throw error;
    }
  }

  /**
   * Schedule follow-up sequence for a lead
   */
  async scheduleFollowUpSequence(leadId: string, intent: 'buying' | 'selling' | 'unknown') {
    try {
      console.log(`Scheduling follow-up sequence for lead ${leadId} with intent: ${intent}`);
      
      const sequence = this.getFollowUpSequence(intent);
      
      // Log each scheduled communication
      for (const step of sequence) {
        await this.logScheduledCommunication(leadId, step);
      }
      
      return {
        success: true,
        leadId,
        sequence,
        totalSteps: sequence.length
      };
    } catch (error) {
      console.error('Error scheduling follow-up sequence:', error);
      throw error;
    }
  }

  /**
   * Get lead analytics and recommend next actions
   */
  async getLeadRecommendations(leadId: string) {
    try {
      // Get lead details
      const leadResponse = await client.models.Lead.get({ id: leadId });
      const lead = leadResponse.data;
      
      if (!lead) {
        throw new Error(`Lead not found: ${leadId}`);
      }
      
      // Get recent communications
      const communicationsResponse = await client.models.Communication.list({
        filter: { leadId: { eq: leadId } }
      });
      
      const communications = communicationsResponse.data
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Analyze lead and generate recommendations
      const recommendations = this.generateRecommendations(lead, communications);
      
      return {
        lead,
        totalCommunications: communications.length,
        lastCommunication: communications[0] || null,
        daysSinceLastContact: this.getDaysSinceLastContact(lead.lastContacted),
        recommendations
      };
    } catch (error) {
      console.error('Error getting lead recommendations:', error);
      throw error;
    }
  }

  private async logWorkflowAction(trigger: LeadWorkflowTrigger) {
    const actionMessages = {
      new_lead: 'New lead processing workflow initiated',
      aged_lead_check: 'Aged lead reactivation workflow triggered',
      follow_up: 'Follow-up sequence initiated',
      manual_contact: 'Manual communication workflow started'
    };
    
    await client.models.Communication.create({
      leadId: trigger.leadId,
      type: 'aiChat',
      direction: 'outbound',
      content: actionMessages[trigger.action] || 'Workflow triggered',
      status: 'sent',
      aiGenerated: true,
      metadata: JSON.stringify({
        workflowAction: trigger.action,
        source: 'leadWorkflowService',
        timestamp: new Date().toISOString()
      })
    });
  }

  private getNextActions(action: string): string[] {
    const nextActionsMap = {
      new_lead: ['immediate_contact', 'follow_up_scheduled', 'qualification_started'],
      aged_lead_check: ['reactivation_sent', 'follow_up_scheduled'],
      follow_up: ['communication_sent', 'next_follow_up_scheduled'],
      manual_contact: ['communication_sent', 'lead_updated']
    };
    
    return nextActionsMap[action] || ['workflow_completed'];
  }

  private generateCommunicationContent(lead: any, messageType: string, customMessage?: string, intent?: string): string {
    if (customMessage) return customMessage;
    
    const firstName = lead.firstName || 'there';
    
    const templates = {
      welcome: `Hi ${firstName}! Welcome to our real estate family. I'm excited to help you ${intent === 'selling' ? 'sell your home' : 'find your perfect home'}. Let's schedule a quick call to discuss your goals!`,
      
      follow_up: `Hi ${firstName}! I wanted to follow up on your ${intent === 'selling' ? 'selling' : 'home buying'} journey. Do you have any questions I can help answer?`,
      
      property_update: `Hi ${firstName}! I found some properties that might interest you. Would you like me to send you the details?`,
      
      market_update: `Hi ${firstName}! The ${intent === 'selling' ? 'selling' : 'buying'} market has some exciting developments. Let's chat about how this affects your timeline.`,
      
      reactivation: `Hi ${firstName}! I hope you're doing well. Are you still interested in ${intent === 'selling' ? 'selling your home' : 'buying a home'}? I have some great updates to share.`,
      
      check_in: `Hi ${firstName}! Just checking in to see how you're doing with your ${intent === 'selling' ? 'selling' : 'home buying'} plans. I'm here if you need anything!`
    };
    
    return templates[messageType] || `Hi ${firstName}! Just wanted to reach out and see how I can help with your real estate needs.`;
  }

  private detectIntent(content: string): string {
    const buyingKeywords = ['buy', 'purchase', 'looking for', 'search', 'find a home'];
    const sellingKeywords = ['sell', 'list', 'market', 'selling', 'home value'];
    
    const lowerContent = content.toLowerCase();
    
    if (buyingKeywords.some(keyword => lowerContent.includes(keyword))) {
      return 'buying';
    } else if (sellingKeywords.some(keyword => lowerContent.includes(keyword))) {
      return 'selling';
    }
    
    return 'general_inquiry';
  }

  private getDaysSinceLastContact(lastContacted: string | null): number {
    if (!lastContacted) return 999; // Never contacted
    
    const lastContactDate = new Date(lastContacted);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastContactDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  private getFollowUpSequence(intent: string) {
    const baseSequence = [
      { day: 0, type: 'email', messageType: 'welcome', description: 'Welcome email with initial information' },
      { day: 1, type: 'sms', messageType: 'follow_up', description: 'Initial follow-up SMS' },
      { day: 3, type: 'email', messageType: 'property_update', description: 'Property recommendations email' },
      { day: 7, type: 'sms', messageType: 'check_in', description: 'Weekly check-in SMS' },
      { day: 14, type: 'email', messageType: 'market_update', description: 'Market update email' },
      { day: 30, type: 'sms', messageType: 'reactivation', description: 'Monthly reactivation message' }
    ];
    
    // Customize sequence based on intent
    if (intent === 'selling') {
      baseSequence[2].description = 'Market analysis and listing preparation';
      baseSequence[4].description = 'Local market trends and pricing updates';
    }
    
    return baseSequence;
  }

  private async logScheduledCommunication(leadId: string, step: any) {
    await client.models.Communication.create({
      leadId,
      type: 'aiChat',
      direction: 'outbound',
      content: `Scheduled: ${step.description} (Day ${step.day})`,
      status: 'pending',
      aiGenerated: true,
      metadata: JSON.stringify({
        scheduledFor: step.day,
        communicationType: step.type,
        messageType: step.messageType,
        source: 'followUpSequence',
        timestamp: new Date().toISOString()
      })
    });
  }

  private generateRecommendations(lead: any, communications: any[]) {
    const recommendations = [];
    const daysSinceLastContact = this.getDaysSinceLastContact(lead.lastContacted);
    
    // Time-based recommendations
    if (daysSinceLastContact > 7) {
      recommendations.push({
        type: 'contact',
        priority: 'high',
        action: 'Send follow-up message',
        reason: `No contact for ${daysSinceLastContact} days`
      });
    }
    
    if (daysSinceLastContact > 30) {
      recommendations.push({
        type: 'reactivation',
        priority: 'high',
        action: 'Send reactivation campaign',
        reason: 'Lead may be going cold'
      });
    }
    
    // Status-based recommendations
    if (lead.status === 'new') {
      recommendations.push({
        type: 'qualification',
        priority: 'high',
        action: 'Start qualification process',
        reason: 'New lead needs immediate attention'
      });
    }
    
    if (lead.priority === 'hot' && daysSinceLastContact > 2) {
      recommendations.push({
        type: 'urgent_contact',
        priority: 'urgent',
        action: 'Call immediately',
        reason: 'Hot lead going too long without contact'
      });
    }
    
    // Communication pattern recommendations
    if (communications.length === 0) {
      recommendations.push({
        type: 'first_contact',
        priority: 'high',
        action: 'Send welcome message',
        reason: 'No previous communications'
      });
    }
    
    return recommendations;
  }
}

export const leadWorkflowService = new LeadWorkflowService();
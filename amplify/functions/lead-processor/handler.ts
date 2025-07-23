import type { Schema } from "../../data/resource";
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';

// Initialize Amplify client
const client = generateClient<Schema>();

interface LeadProcessorEvent {
  leadId: string;
  action: 'new_lead' | 'aged_lead_check' | 'follow_up';
  leadData?: any;
}

export const handler = async (event: LeadProcessorEvent) => {
  console.log('Lead processor event:', JSON.stringify(event, null, 2));
  
  try {
    const { leadId, action, leadData } = event;
    
    switch (action) {
      case 'new_lead':
        return await processNewLead(leadId, leadData);
      
      case 'aged_lead_check':
        return await processAgedLead(leadId);
      
      case 'follow_up':
        return await processFollowUp(leadId);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error processing lead:', error);
    throw error;
  }
};

async function processNewLead(leadId: string, leadData: any) {
  console.log('Processing new lead:', leadId);
  
  try {
    // Get lead details from database
    const leadResponse = await client.models.Lead.get({ id: leadId });
    const lead = leadResponse.data;
    
    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`);
    }
    
    // Determine lead intent (buying vs selling)
    const intent = determineLeadIntent(lead);
    
    // Create immediate contact workflow
    await createImmediateContactWorkflow(lead, intent);
    
    // Schedule follow-up communications
    await scheduleFollowUpSequence(lead, intent);
    
    // Log the processing
    await logCommunication(leadId, 'New lead processing initiated', 'system');
    
    return {
      statusCode: 200,
      body: {
        message: 'New lead processed successfully',
        leadId,
        intent,
        nextActions: ['immediate_contact', 'follow_up_scheduled']
      }
    };
  } catch (error) {
    console.error('Error processing new lead:', error);
    throw error;
  }
}

async function processAgedLead(leadId: string) {
  console.log('Processing aged lead:', leadId);
  
  try {
    // Get lead details
    const leadResponse = await client.models.Lead.get({ id: leadId });
    const lead = leadResponse.data;
    
    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`);
    }
    
    // Check if lead hasn't been contacted recently
    const daysSinceLastContact = getDaysSinceLastContact(lead.lastContacted);
    
    if (daysSinceLastContact >= 30) {
      // Create reactivation campaign
      await createReactivationCampaign(lead);
      
      // Update last contacted date
      await client.models.Lead.update({
        id: leadId,
        lastContacted: new Date().toISOString()
      });
      
      await logCommunication(leadId, 'Aged lead reactivation initiated', 'system');
    }
    
    return {
      statusCode: 200,
      body: {
        message: 'Aged lead processed successfully',
        leadId,
        daysSinceLastContact,
        actionTaken: daysSinceLastContact >= 30 ? 'reactivation_sent' : 'no_action_needed'
      }
    };
  } catch (error) {
    console.error('Error processing aged lead:', error);
    throw error;
  }
}

async function processFollowUp(leadId: string) {
  console.log('Processing follow-up for lead:', leadId);
  
  try {
    // Get lead details and conversation history
    const leadResponse = await client.models.Lead.get({ id: leadId });
    const lead = leadResponse.data;
    
    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`);
    }
    
    // Get recent communications
    const communicationsResponse = await client.models.Communication.list({
      filter: { leadId: { eq: leadId } }
    });
    
    const recentCommunications = communicationsResponse.data
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    // Determine next follow-up action based on lead status and recent communications
    const nextAction = determineNextFollowUpAction(lead, recentCommunications);
    
    if (nextAction) {
      await executeFollowUpAction(lead, nextAction);
      await logCommunication(leadId, `Follow-up action executed: ${nextAction.type}`, 'system');
    }
    
    return {
      statusCode: 200,
      body: {
        message: 'Follow-up processed successfully',
        leadId,
        nextAction: nextAction?.type || 'no_action_needed'
      }
    };
  } catch (error) {
    console.error('Error processing follow-up:', error);
    throw error;
  }
}

function determineLeadIntent(lead: any): 'buying' | 'selling' | 'unknown' {
  // Simple logic to determine intent - can be enhanced with AI
  const notes = lead.notes?.toLowerCase() || '';
  
  if (notes.includes('sell') || notes.includes('listing') || notes.includes('market value')) {
    return 'selling';
  } else if (notes.includes('buy') || notes.includes('purchase') || notes.includes('looking for')) {
    return 'buying';
  }
  
  return 'unknown';
}

async function createImmediateContactWorkflow(lead: any, intent: string) {
  // This would integrate with communication service
  console.log(`Creating immediate contact workflow for lead ${lead.id} with intent: ${intent}`);
  
  // Schedule welcome email (immediate)
  await scheduleEmailCommunication(lead, 'welcome', intent, 0);
  
  // Schedule follow-up SMS (next business day)
  await scheduleSMSCommunication(lead, 'initial_follow_up', intent, 24);
}

async function scheduleFollowUpSequence(lead: any, intent: string) {
  console.log(`Scheduling follow-up sequence for lead ${lead.id}`);
  
  // Day 3: Follow-up email with property recommendations
  await scheduleEmailCommunication(lead, 'property_recommendations', intent, 72);
  
  // Day 7: Check-in SMS
  await scheduleSMSCommunication(lead, 'weekly_check_in', intent, 168);
  
  // Day 14: Market update email
  await scheduleEmailCommunication(lead, 'market_update', intent, 336);
}

async function createReactivationCampaign(lead: any) {
  console.log(`Creating reactivation campaign for lead ${lead.id}`);
  
  const intent = determineLeadIntent(lead);
  const message = intent === 'buying' 
    ? `Hi ${lead.firstName}, are you still looking to buy a home? The market has some great opportunities right now!`
    : `Hi ${lead.firstName}, are you still considering selling your home? I have some exciting market updates to share.`;
  
  // Send reactivation message
  await scheduleEmailCommunication(lead, 'reactivation', intent, 0, message);
}

function getDaysSinceLastContact(lastContacted: string | null): number {
  if (!lastContacted) return 999; // No contact ever
  
  const lastContactDate = new Date(lastContacted);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastContactDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

function determineNextFollowUpAction(lead: any, recentCommunications: any[]) {
  // Simple logic - can be enhanced with AI
  if (recentCommunications.length === 0) {
    return { type: 'initial_contact', channel: 'email' };
  }
  
  const lastCommunication = recentCommunications[0];
  const daysSinceLastComm = getDaysSinceLastContact(lastCommunication.createdAt);
  
  if (daysSinceLastComm >= 7) {
    return { type: 'weekly_follow_up', channel: 'sms' };
  }
  
  return null;
}

async function executeFollowUpAction(lead: any, action: any) {
  console.log(`Executing follow-up action for lead ${lead.id}:`, action);
  
  if (action.channel === 'email') {
    await scheduleEmailCommunication(lead, action.type, 'unknown', 0);
  } else if (action.channel === 'sms') {
    await scheduleSMSCommunication(lead, action.type, 'unknown', 0);
  }
}

async function scheduleEmailCommunication(lead: any, type: string, intent: string, delayHours: number, customMessage?: string) {
  // This would integrate with the communication service function
  console.log(`Scheduling email communication for lead ${lead.id}: ${type} in ${delayHours} hours`);
  
  // For now, log the communication intent
  await logCommunication(lead.id, `Email scheduled: ${type}`, 'system');
}

async function scheduleSMSCommunication(lead: any, type: string, intent: string, delayHours: number, customMessage?: string) {
  // This would integrate with the communication service function
  console.log(`Scheduling SMS communication for lead ${lead.id}: ${type} in ${delayHours} hours`);
  
  // For now, log the communication intent
  await logCommunication(lead.id, `SMS scheduled: ${type}`, 'system');
}

async function logCommunication(leadId: string, content: string, type: string) {
  try {
    await client.models.Communication.create({
      leadId,
      type: 'aiChat',
      direction: 'outbound',
      content,
      status: 'sent',
      aiGenerated: true,
      metadata: JSON.stringify({ source: 'lead-processor', timestamp: new Date().toISOString() })
    });
  } catch (error) {
    console.error('Error logging communication:', error);
  }
}
import type { Schema } from "../../data/resource";
import { generateClient } from 'aws-amplify/data';
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

// Initialize clients
const client = generateClient<Schema>();
const lambdaClient = new LambdaClient({});

interface FUBWebhookEvent {
  body: string;
  headers: { [key: string]: string };
  requestContext: any;
}

interface FUBLead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  notes: string;
  property_interest?: any;
  budget?: any;
  timeline?: string;
}

export const handler = async (event: FUBWebhookEvent) => {
  console.log('FUB Webhook received:', JSON.stringify(event, null, 2));
  
  try {
    // Verify webhook signature (if using webhook secret)
    const signature = event.headers['X-FUB-Signature'] || event.headers['x-fub-signature'];
    if (process.env.FUB_WEBHOOK_SECRET && signature) {
      // Verify webhook signature here
      // Implementation depends on FUB's signature verification method
    }
    
    const fubData = JSON.parse(event.body);
    const { type, data } = fubData;
    
    console.log('FUB Event Type:', type);
    console.log('FUB Data:', JSON.stringify(data, null, 2));
    
    switch (type) {
      case 'person.created':
      case 'person.updated':
        return await handleLeadEvent(data, type === 'person.created');
      
      case 'event.created':
        return await handleEventCreated(data);
      
      default:
        console.log(`Unhandled FUB event type: ${type}`);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Event received but not processed' })
        };
    }
  } catch (error) {
    console.error('Error processing FUB webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

async function handleLeadEvent(fubLead: FUBLead, isNewLead: boolean) {
  console.log(`Processing ${isNewLead ? 'new' : 'updated'} lead from FUB:`, fubLead.id);
  
  try {
    // Transform FUB lead data to our schema
    const transformedLead = transformFUBLead(fubLead);
    
    let leadId: string;
    let isActuallyNew = isNewLead;
    
    if (isNewLead) {
      // Check if lead already exists (by email or phone)
      const existingLead = await findExistingLead(fubLead.email, fubLead.phone);
      
      if (existingLead) {
        // Update existing lead instead of creating new one
        await client.models.Lead.update({
          id: existingLead.id,
          ...transformedLead
        });
        leadId = existingLead.id;
        isActuallyNew = false;
        console.log('Updated existing lead:', leadId);
      } else {
        // Create new lead
        const newLead = await client.models.Lead.create(transformedLead);
        leadId = newLead.data?.id!;
        console.log('Created new lead:', leadId);
      }
    } else {
      // For updates, find by FUB ID or email/phone
      const existingLead = await findExistingLead(fubLead.email, fubLead.phone);
      
      if (existingLead) {
        await client.models.Lead.update({
          id: existingLead.id,
          ...transformedLead
        });
        leadId = existingLead.id;
        console.log('Updated lead:', leadId);
      } else {
        // Lead doesn't exist, create it
        const newLead = await client.models.Lead.create(transformedLead);
        leadId = newLead.data?.id!;
        isActuallyNew = true;
        console.log('Created lead from update event:', leadId);
      }
    }
    
    // Trigger lead processing workflow
    if (isActuallyNew) {
      await triggerLeadProcessor(leadId, 'new_lead', fubLead);
    } else {
      await triggerLeadProcessor(leadId, 'follow_up', fubLead);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Lead processed successfully',
        leadId,
        action: isActuallyNew ? 'created' : 'updated',
        fubLeadId: fubLead.id
      })
    };
  } catch (error) {
    console.error('Error handling lead event:', error);
    throw error;
  }
}

async function handleEventCreated(eventData: any) {
  console.log('Processing FUB event:', eventData);
  
  // Handle various FUB events like appointments, tasks, etc.
  // For now, just log the event
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Event processed successfully',
      eventType: eventData.type || 'unknown'
    })
  };
}

function transformFUBLead(fubLead: FUBLead) {
  // Map FUB lead fields to our schema
  return {
    firstName: fubLead.first_name || '',
    lastName: fubLead.last_name || '',
    email: fubLead.email || undefined,
    phone: fubLead.phone || '',
    status: mapFUBStatus(fubLead.status),
    source: mapFUBSource(fubLead.source),
    priority: determinePriority(fubLead),
    notes: fubLead.notes || undefined,
    tags: fubLead.tags || [],
    timeline: mapFUBTimeline(fubLead.timeline),
    propertyInterest: fubLead.property_interest ? JSON.stringify(fubLead.property_interest) : undefined,
    budget: fubLead.budget ? JSON.stringify(fubLead.budget) : undefined,
    lastContacted: fubLead.updated_at ? new Date(fubLead.updated_at).toISOString() : undefined,
    consentGiven: true, // Assume consent if coming from FUB
  };
}

function mapFUBStatus(fubStatus: string): 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closedWon' | 'closedLost' | 'nurture' | 'optedOut' {
  const statusMap: { [key: string]: any } = {
    'new': 'new',
    'active': 'contacted',
    'hot': 'qualified',
    'warm': 'contacted',
    'cold': 'nurture',
    'closed': 'closedWon',
    'lost': 'closedLost',
    'unsubscribed': 'optedOut',
    'do_not_contact': 'optedOut'
  };
  
  return statusMap[fubStatus?.toLowerCase()] || 'new';
}

function mapFUBSource(fubSource: string): 'website' | 'referral' | 'socialMedia' | 'coldOutreach' | 'event' | 'advertising' | 'zillow' | 'realtorCom' | 'homesCom' | 'manualEntry' | 'emailParsing' | 'other' {
  const sourceMap: { [key: string]: any } = {
    'website': 'website',
    'zillow': 'zillow',
    'realtor.com': 'realtorCom',
    'homes.com': 'homesCom',
    'facebook': 'socialMedia',
    'google': 'advertising',
    'referral': 'referral',
    'manual': 'manualEntry',
    'email': 'emailParsing',
    'event': 'event',
    'cold_call': 'coldOutreach'
  };
  
  return sourceMap[fubSource?.toLowerCase()] || 'other';
}

function mapFUBTimeline(timeline?: string): 'immediate' | 'one_to_three_months' | 'three_to_six_months' | 'six_to_twelve_months' | 'just_browsing' | undefined {
  if (!timeline) return undefined;
  
  const timelineMap: { [key: string]: any } = {
    'asap': 'immediate',
    'immediate': 'immediate',
    '1-3 months': 'one_to_three_months',
    '3-6 months': 'three_to_six_months',
    '6-12 months': 'six_to_twelve_months',
    'browsing': 'just_browsing',
    'just looking': 'just_browsing'
  };
  
  return timelineMap[timeline.toLowerCase()] || 'just_browsing';
}

function determinePriority(fubLead: FUBLead): 'hot' | 'warm' | 'cold' {
  // Determine priority based on FUB data
  const status = fubLead.status?.toLowerCase();
  const timeline = fubLead.timeline?.toLowerCase();
  
  if (status === 'hot' || timeline === 'asap' || timeline === 'immediate') {
    return 'hot';
  } else if (status === 'warm' || timeline === '1-3 months') {
    return 'warm';
  } else {
    return 'cold';
  }
}

async function findExistingLead(email?: string, phone?: string) {
  if (!email && !phone) return null;
  
  try {
    // First try to find by email
    if (email) {
      const leadsByEmail = await client.models.Lead.list({
        filter: { email: { eq: email } }
      });
      if (leadsByEmail.data.length > 0) {
        return leadsByEmail.data[0];
      }
    }
    
    // Then try to find by phone
    if (phone) {
      const leadsByPhone = await client.models.Lead.list({
        filter: { phone: { eq: phone } }
      });
      if (leadsByPhone.data.length > 0) {
        return leadsByPhone.data[0];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding existing lead:', error);
    return null;
  }
}

async function triggerLeadProcessor(leadId: string, action: string, fubData: any) {
  try {
    const payload = {
      leadId,
      action,
      leadData: fubData
    };
    
    const command = new InvokeCommand({
      FunctionName: 'lead-processor', // This would be the actual function name/ARN
      InvocationType: 'Event', // Async invocation
      Payload: JSON.stringify(payload)
    });
    
    await lambdaClient.send(command);
    console.log('Lead processor triggered successfully for lead:', leadId);
  } catch (error) {
    console.error('Error triggering lead processor:', error);
    // Don't throw error - webhook should still return success
  }
}
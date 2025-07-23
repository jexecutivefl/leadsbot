import type { Schema } from "../../data/resource";
import { generateClient } from 'aws-amplify/data';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Initialize clients
const client = generateClient<Schema>();
const sesClient = new SESClient({ region: process.env.SES_REGION || 'us-east-1' });
const snsClient = new SNSClient({ region: process.env.SES_REGION || 'us-east-1' });

interface CommunicationEvent {
  type: 'email' | 'sms' | 'whatsapp';
  leadId: string;
  messageType: string;
  customMessage?: string;
  intent?: 'buying' | 'selling' | 'unknown';
  urgency?: 'low' | 'medium' | 'high';
}

export const handler = async (event: CommunicationEvent) => {
  console.log('Communication service event:', JSON.stringify(event, null, 2));
  
  try {
    const { type, leadId, messageType, customMessage, intent, urgency } = event;
    
    // Get lead details
    const leadResponse = await client.models.Lead.get({ id: leadId });
    const lead = leadResponse.data;
    
    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`);
    }
    
    let result;
    
    switch (type) {
      case 'email':
        result = await sendEmail(lead, messageType, customMessage, intent);
        break;
      
      case 'sms':
        result = await sendSMS(lead, messageType, customMessage, intent);
        break;
      
      case 'whatsapp':
        result = await sendWhatsApp(lead, messageType, customMessage, intent);
        break;
      
      default:
        throw new Error(`Unknown communication type: ${type}`);
    }
    
    // Log the communication
    await logCommunication({
      leadId,
      type,
      content: result.content,
      status: result.success ? 'sent' : 'failed',
      metadata: result.metadata
    });
    
    return {
      statusCode: 200,
      body: {
        message: 'Communication sent successfully',
        leadId,
        type,
        messageType,
        success: result.success,
        messageId: result.messageId
      }
    };
  } catch (error) {
    console.error('Error sending communication:', error);
    
    // Log failed communication
    await logCommunication({
      leadId: event.leadId,
      type: event.type,
      content: `Failed to send ${event.messageType}: ${error.message}`,
      status: 'failed',
      metadata: { error: error.message }
    });
    
    throw error;
  }
};

async function sendEmail(lead: any, messageType: string, customMessage?: string, intent?: string) {
  console.log(`Sending email to lead ${lead.id}: ${messageType}`);
  
  const emailContent = generateEmailContent(lead, messageType, customMessage, intent);
  
  try {
    const command = new SendEmailCommand({
      Source: process.env.FROM_EMAIL,
      Destination: {
        ToAddresses: [lead.email]
      },
      Message: {
        Subject: {
          Data: emailContent.subject,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: emailContent.html,
            Charset: 'UTF-8'
          },
          Text: {
            Data: emailContent.text,
            Charset: 'UTF-8'
          }
        }
      }
    });
    
    const response = await sesClient.send(command);
    
    return {
      success: true,
      content: emailContent.text,
      messageId: response.MessageId,
      metadata: { 
        subject: emailContent.subject, 
        deliveryMethod: 'ses',
        recipient: lead.email
      }
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      content: emailContent.text,
      messageId: null,
      metadata: { error: error.message }
    };
  }
}

async function sendSMS(lead: any, messageType: string, customMessage?: string, intent?: string) {
  console.log(`Sending SMS to lead ${lead.id}: ${messageType}`);
  
  const smsContent = generateSMSContent(lead, messageType, customMessage, intent);
  
  try {
    const command = new PublishCommand({
      PhoneNumber: lead.phone,
      Message: smsContent
    });
    
    const response = await snsClient.send(command);
    
    return {
      success: true,
      content: smsContent,
      messageId: response.MessageId,
      metadata: { 
        deliveryMethod: 'sns',
        recipient: lead.phone
      }
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      content: smsContent,
      messageId: null,
      metadata: { error: error.message }
    };
  }
}

async function sendWhatsApp(lead: any, messageType: string, customMessage?: string, intent?: string) {
  console.log(`Sending WhatsApp to lead ${lead.id}: ${messageType}`);
  
  // WhatsApp Business API integration would go here
  // For now, we'll just log the intent
  const message = generateSMSContent(lead, messageType, customMessage, intent);
  
  return {
    success: true,
    content: message,
    messageId: 'whatsapp-placeholder',
    metadata: { 
      deliveryMethod: 'whatsapp',
      recipient: lead.phone,
      note: 'WhatsApp integration pending'
    }
  };
}

function generateEmailContent(lead: any, messageType: string, customMessage?: string, intent?: string) {
  const firstName = lead.firstName || 'there';
  
  if (customMessage) {
    return {
      subject: 'Update from Your Real Estate Agent',
      text: customMessage,
      html: `<html><body><p>${customMessage}</p></body></html>`
    };
  }
  
  const templates = {
    welcome: {
      subject: `Welcome ${firstName}! Let's find your perfect home`,
      text: `Hi ${firstName},\n\nThank you for your interest in ${intent === 'selling' ? 'selling' : 'buying'} real estate! I'm excited to help you through this journey.\n\nI'll be reaching out shortly to discuss your needs and timeline. In the meantime, feel free to reply with any questions.\n\nBest regards,\nYour Real Estate Agent`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h2>Welcome ${firstName}!</h2>
            <p>Thank you for your interest in ${intent === 'selling' ? 'selling' : 'buying'} real estate! I'm excited to help you through this journey.</p>
            <p>I'll be reaching out shortly to discuss your needs and timeline. In the meantime, feel free to reply with any questions.</p>
            <p>Best regards,<br>Your Real Estate Agent</p>
          </body>
        </html>
      `
    },
    
    property_recommendations: {
      subject: `${firstName}, I found some great properties for you!`,
      text: `Hi ${firstName},\n\nI've been working on finding properties that match your criteria. I have some exciting options to share with you!\n\nWould you like to schedule a call to discuss these opportunities? I'm available for a quick 15-minute conversation at your convenience.\n\nBest regards,\nYour Real Estate Agent`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h2>Great Properties Found!</h2>
            <p>Hi ${firstName},</p>
            <p>I've been working on finding properties that match your criteria. I have some exciting options to share with you!</p>
            <p>Would you like to schedule a call to discuss these opportunities? I'm available for a quick 15-minute conversation at your convenience.</p>
            <p>Best regards,<br>Your Real Estate Agent</p>
          </body>
        </html>
      `
    },
    
    market_update: {
      subject: `${firstName}, Important Market Update`,
      text: `Hi ${firstName},\n\nI wanted to share some important market updates that could impact your ${intent === 'selling' ? 'selling' : 'buying'} timeline.\n\nThe market has been showing some interesting trends lately. Would you like to hop on a quick call to discuss how these changes might benefit you?\n\nBest regards,\nYour Real Estate Agent`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h2>Market Update</h2>
            <p>Hi ${firstName},</p>
            <p>I wanted to share some important market updates that could impact your ${intent === 'selling' ? 'selling' : 'buying'} timeline.</p>
            <p>The market has been showing some interesting trends lately. Would you like to hop on a quick call to discuss how these changes might benefit you?</p>
            <p>Best regards,<br>Your Real Estate Agent</p>
          </body>
        </html>
      `
    },
    
    reactivation: {
      subject: `${firstName}, are you still looking to ${intent === 'selling' ? 'sell' : 'buy'}?`,
      text: `Hi ${firstName},\n\nI hope you're doing well! I wanted to check in and see if you're still interested in ${intent === 'selling' ? 'selling your home' : 'buying a home'}.\n\nThe market has some great opportunities right now, and I'd love to help you take advantage of them.\n\nAre you available for a quick 10-minute call this week?\n\nBest regards,\nYour Real Estate Agent`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h2>Still looking to ${intent === 'selling' ? 'sell' : 'buy'}?</h2>
            <p>Hi ${firstName},</p>
            <p>I hope you're doing well! I wanted to check in and see if you're still interested in ${intent === 'selling' ? 'selling your home' : 'buying a home'}.</p>
            <p>The market has some great opportunities right now, and I'd love to help you take advantage of them.</p>
            <p>Are you available for a quick 10-minute call this week?</p>
            <p>Best regards,<br>Your Real Estate Agent</p>
          </body>
        </html>
      `
    }
  };
  
  return templates[messageType] || templates.welcome;
}

function generateSMSContent(lead: any, messageType: string, customMessage?: string, intent?: string) {
  const firstName = lead.firstName || 'there';
  
  if (customMessage) {
    return customMessage;
  }
  
  const templates = {
    initial_follow_up: `Hi ${firstName}! Quick follow-up from yesterday. When would be a good time for a brief call to discuss your ${intent === 'selling' ? 'selling' : 'home buying'} goals? I'm here to help!`,
    
    weekly_check_in: `Hi ${firstName}! Hope you're having a great week. Any questions about the ${intent === 'selling' ? 'selling' : 'buying'} process? I'm here if you need anything!`,
    
    property_alert: `Hi ${firstName}! Found a property that matches your criteria. Interested in learning more? Let me know if you'd like details!`,
    
    appointment_reminder: `Hi ${firstName}! Reminder: we have our appointment scheduled for tomorrow. Looking forward to connecting with you!`,
    
    market_update: `Hi ${firstName}! Quick market update: ${intent === 'selling' ? 'Home values in your area are trending up!' : 'Great buying opportunities available right now!'} Want to chat about it?`
  };
  
  return templates[messageType] || `Hi ${firstName}! Just checking in. How can I help with your real estate needs today?`;
}

async function logCommunication({ leadId, type, content, status, metadata }: {
  leadId: string;
  type: string;
  content: string;
  status: string;
  metadata: any;
}) {
  try {
    await client.models.Communication.create({
      leadId,
      type,
      direction: 'outbound',
      content,
      status,
      aiGenerated: true,
      metadata: JSON.stringify({
        ...metadata,
        timestamp: new Date().toISOString(),
        source: 'communication-service'
      })
    });
  } catch (error) {
    console.error('Error logging communication:', error);
  }
}
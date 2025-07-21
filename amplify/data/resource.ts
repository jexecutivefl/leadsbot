import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  User: a
    .model({
      email: a.email().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      role: a.enum(['admin', 'agent', 'manager', 'broker']),
      avatar: a.url(),
      phone: a.phone().required(),
      timezone: a.string().default('America/New_York'),
      aiSettings: a.json(), // JSON object for AI configuration
      workingHours: a.json(), // JSON object for availability
      calendarIntegration: a.json(), // JSON object for calendar settings
      notificationSettings: a.json(), // JSON object for notification preferences
      isActive: a.boolean().default(true),
      lastLogin: a.datetime(),
      // Relationships
      assignedLeads: a.hasMany('Lead', 'assignedToId'),
      communications: a.hasMany('Communication', 'userId'),
      documents: a.hasMany('Document', 'userId'),
      appointments: a.hasMany('Appointment', 'userId'),
      aiConfig: a.hasOne('AIConfig', 'userId'),
      conversations: a.hasMany('Conversation', 'userId'),
      analytics: a.hasMany('Analytics', 'userId'),
      notifications: a.hasMany('Notification', 'userId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group('admin').to(['read', 'update']),
    ]),

  Lead: a
    .model({
      firstName: a.string().required(),
      lastName: a.string().required(),
      email: a.email(),
      phone: a.phone().required(),
      status: a.enum([
        'new',
        'contacted', 
        'qualified',
        'proposal',
        'negotiation',
        'closedWon',
        'closedLost',
        'nurture',
        'optedOut'
      ]),
      priority: a.enum(['hot', 'warm', 'cold']),
      source: a.enum([
        'website',
        'referral',
        'socialMedia',
        'coldOutreach',
        'event',
        'advertising',
        'zillow',
        'realtorCom',
        'homesCom',
        'manualEntry',
        'emailParsing',
        'other'
      ]),
      assignedToId: a.id(), // Reference to User
      assignedTo: a.belongsTo('User', 'assignedToId'),
      notes: a.string(),
      lastContacted: a.datetime(),
      nextFollowUp: a.datetime(),
      tags: a.string().array(), // Array of tag strings
      propertyInterest: a.json(), // JSON object for property details
      budget: a.json(), // JSON object for budget information
      timeline: a.enum(['immediate', 'one_to_three_months', 'three_to_six_months', 'six_to_twelve_months', 'just_browsing']),
      preApproved: a.boolean(),
      consentGiven: a.boolean().default(false),
      optOutDate: a.datetime(),
      aiConversationActive: a.boolean().default(false),
      lastAiMessage: a.datetime(),
      totalMessages: a.integer().default(0),
      responseRate: a.float(), // Percentage of messages responded to
      // Relationships
      communications: a.hasMany('Communication', 'leadId'),
      documents: a.hasMany('Document', 'leadId'),
      appointments: a.hasMany('Appointment', 'leadId'),
      conversations: a.hasMany('Conversation', 'leadId'),
    })
    .secondaryIndexes((index) => [
      index('assignedToId').sortKeys(['status']),
      index('status').sortKeys(['priority']),
      index('source'),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.group('admin').to(['read', 'update', 'delete']),
      allow.group('manager').to(['read', 'update']),
    ]),

  Communication: a
    .model({
      leadId: a.id(), // Reference to Lead (optional for general AI conversations)
      lead: a.belongsTo('Lead', 'leadId'),
      userId: a.id(), // Reference to User (if human intervention)
      user: a.belongsTo('User', 'userId'),
      type: a.enum(['email', 'call', 'text', 'aiChat', 'whatsapp']),
      direction: a.enum(['inbound', 'outbound']),
      content: a.string().required(),
      status: a.enum(['sent', 'delivered', 'read', 'failed', 'pending']),
      metadata: a.json(), // JSON object for additional data (delivery receipts, etc.)
      aiGenerated: a.boolean().default(false),
      sentiment: a.enum(['positive', 'neutral', 'negative']),
      intent: a.string(), // AI-detected intent
      responseTime: a.integer(), // Response time in seconds
    })
    .secondaryIndexes((index) => [
      index('leadId'),
      index('type'),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.group('admin').to(['read', 'update', 'delete']),
      allow.group('manager').to(['read', 'update']),
    ]),

  Document: a
    .model({
      leadId: a.id().required(), // Reference to Lead
      lead: a.belongsTo('Lead', 'leadId'),
      userId: a.id(), // Reference to User who uploaded
      user: a.belongsTo('User', 'userId'),
      name: a.string().required(),
      type: a.string().required(),
      size: a.integer().required(),
      url: a.url().required(),
      category: a.enum(['contract', 'disclosure', 'photo', 'other']),
      description: a.string(),
      isPublic: a.boolean().default(false),
    })
    .secondaryIndexes((index) => [
      index('leadId'),
      index('type'),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.group('admin').to(['read', 'update', 'delete']),
      allow.group('manager').to(['read', 'update']),
    ]),

  Appointment: a
    .model({
      leadId: a.id().required(), // Reference to Lead
      lead: a.belongsTo('Lead', 'leadId'),
      userId: a.id().required(), // Reference to User (agent)
      user: a.belongsTo('User', 'userId'),
      title: a.string().required(),
      description: a.string(),
      startTime: a.datetime().required(),
      endTime: a.datetime().required(),
      location: a.string(),
      status: a.enum(['scheduled', 'confirmed', 'cancelled', 'completed', 'noShow']),
      notes: a.string(),
      type: a.enum(['showing', 'consultation', 'closing', 'other']),
      reminderSent: a.boolean().default(false),
      reminderTime: a.datetime(),
      aiScheduled: a.boolean().default(false),
      calendarEventId: a.string(), // External calendar event ID
    })
    .secondaryIndexes((index) => [
      index('leadId').sortKeys(['startTime']),
      index('userId').sortKeys(['startTime']),
      index('status').sortKeys(['startTime']),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.group('admin').to(['read', 'update', 'delete']),
      allow.group('manager').to(['read', 'update']),
    ]),

  AIConfig: a
    .model({
      userId: a.id().required(), // Reference to User
      user: a.belongsTo('User', 'userId'),
      model: a.string().default('gpt-4'),
      temperature: a.float().default(0.7),
      maxTokens: a.integer().default(1000),
      systemPrompt: a.string().required(),
      customInstructions: a.string(),
      followUpScripts: a.json(), // JSON object for different follow-up scenarios
      qualificationQuestions: a.json(), // JSON array of qualification questions
      appointmentScripts: a.json(), // JSON object for appointment scheduling
      optOutKeywords: a.string().array(),
      quietHours: a.json(), // JSON object for quiet hours settings
      maxFollowUps: a.integer().default(10),
      followUpInterval: a.integer().default(24), // hours
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group('admin').to(['read', 'update']),
    ]),

  Conversation: a
    .model({
      leadId: a.id(), // Reference to Lead (optional for general AI conversations)
      lead: a.belongsTo('Lead', 'leadId'),
      userId: a.id(), // Reference to User (agent)
      user: a.belongsTo('User', 'userId'),
      status: a.enum(['active', 'paused', 'completed', 'handedOff']),
      channel: a.enum(['sms', 'email', 'whatsapp', 'voice', 'aiChat']),
      lastMessageAt: a.datetime(),
      messageCount: a.integer().default(0),
      aiHandling: a.boolean().default(true),
      handoffReason: a.string(),
      handoffTime: a.datetime(),
      conversationSummary: a.string(),
      sentiment: a.enum(['positive', 'neutral', 'negative']),
      intent: a.string(),
      nextAction: a.string(),
    })
    .secondaryIndexes((index) => [
      index('leadId').sortKeys(['lastMessageAt']),
      index('status').sortKeys(['lastMessageAt']),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.group('admin').to(['read', 'update', 'delete']),
      allow.group('manager').to(['read', 'update']),
    ]),

  Analytics: a
    .model({
      userId: a.id().required(), // Reference to User
      user: a.belongsTo('User', 'userId'),
      date: a.date().required(),
      leadsCreated: a.integer().default(0),
      leadsContacted: a.integer().default(0),
      leadsQualified: a.integer().default(0),
      appointmentsScheduled: a.integer().default(0),
      appointmentsCompleted: a.integer().default(0),
      messagesSent: a.integer().default(0),
      messagesReceived: a.integer().default(0),
      responseRate: a.float().default(0),
      averageResponseTime: a.float().default(0),
      conversionRate: a.float().default(0),
      sourceBreakdown: a.json(), // JSON object for lead source analytics
      statusBreakdown: a.json(), // JSON object for lead status analytics
    })
    .secondaryIndexes((index) => [
      index('userId').sortKeys(['date']),
      index('date').sortKeys(['userId']),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.group('admin').to(['read', 'update']),
      allow.group('manager').to(['read']),
    ]),

  Notification: a
    .model({
      userId: a.id().required(), // Reference to User
      user: a.belongsTo('User', 'userId'),
      type: a.enum(['leadAssigned', 'appointmentReminder', 'aiHandoff', 'systemAlert']),
      title: a.string().required(),
      message: a.string().required(),
      read: a.boolean().default(false),
      readAt: a.datetime(),
      actionUrl: a.url(),
      priority: a.enum(['low', 'medium', 'high', 'urgent']),
      metadata: a.json(), // JSON object for additional notification data
    })
    .secondaryIndexes((index) => [
      index('userId'),
      index('priority'),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.group('admin').to(['read', 'update', 'delete']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

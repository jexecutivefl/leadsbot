import { defineFunction, secret } from '@aws-amplify/backend';

export const communicationService = defineFunction({
  name: 'communication-service',
  entry: './handler.ts',
  environment: {
    TWILIO_ACCOUNT_SID: secret('TWILIO_ACCOUNT_SID'),
    TWILIO_AUTH_TOKEN: secret('TWILIO_AUTH_TOKEN'),
    SES_REGION: 'us-east-1',
    FROM_EMAIL: 'noreply@yourdomain.com', // Change this to your verified domain
  },
  timeout: 30, // 30 seconds
  memoryMB: 512,
});
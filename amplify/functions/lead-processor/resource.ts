import { defineFunction, secret } from '@aws-amplify/backend';

export const leadProcessor = defineFunction({
  name: 'lead-processor',
  entry: './handler.ts',
  environment: {
    OPENAI_API_KEY: secret('OPENAI_API_KEY'),
    TWILIO_ACCOUNT_SID: secret('TWILIO_ACCOUNT_SID'),
    TWILIO_AUTH_TOKEN: secret('TWILIO_AUTH_TOKEN'),
  },
  timeout: 30, // 30 seconds
  memoryMB: 512,
});
import { defineFunction, secret } from '@aws-amplify/backend';

export const fubWebhook = defineFunction({
  name: 'fub-webhook',
  entry: './handler.ts',
  environment: {
    FUB_API_KEY: secret('FUB_API_KEY'),
    FUB_WEBHOOK_SECRET: secret('FUB_WEBHOOK_SECRET'),
  },
  timeout: 30, // 30 seconds
  memoryMB: 512,
});
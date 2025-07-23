import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { leadProcessor } from './functions/lead-processor/resource';
import { communicationService } from './functions/communication-service/resource';
import { fubWebhook } from './functions/fub-webhook/resource';

defineBackend({
  auth,
  data,
  leadProcessor,
  communicationService,
  fubWebhook,
});

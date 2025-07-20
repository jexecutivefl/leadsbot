Connect your app code to API
In this guide, you will connect your application code to the backend API using the Amplify Libraries. Before you begin, you will need:

Your cloud sandbox with an Amplify Data resource up and running (npx ampx sandbox)
A frontend application set up with the Amplify library installed
npm installed
Configure the Amplify Library
When you deploy you're iterating on your backend (npx ampx sandbox), an amplify_outputs.json file is generated for you. This file contains your API's endpoint information and auth configurations. Add the following code to your app's entrypoint to initialize and configure the Amplify client library:

import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
Generate the Amplify Data client
Once the Amplify library is configured, you can generate a "Data client" for your frontend code to make fully-typed API requests to your backend.

If you're using Amplify with a JavaScript-only frontend (i.e. not TypeScript), then you can still get a fully-typed data fetching experience by annotating the generated client with a JSDoc comment. Select the JavaScript in the code block below to see how.

To generate a new Data client, use the following code:

TypeScript
JavaScript
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>();

// Now you should be able to make CRUDL operations with the
// Data client
const fetchTodos = async () => {
  const { data: todos, errors } = await client.models.Todo.list();
};
Configure authorization mode
The Authorization Mode determines how a request should be authorized with the backend. By default, Amplify Data uses the "userPool" authorization which uses the signed-in user credentials to sign an API request. If you use a allow.publicApiKey() authorization rules for your data models, you need to use "apiKey" as an authorization mode. Review Customize your auth rules to learn more about which authorization modes to choose for which type of request. A Default Authorization Mode is provided as part of the amplify_outputs.json that is generated upon a successful deployment.

You can generate different Data clients with different authorization modes or pass in the authorization mode at the request time.

Set authorization mode on a per-client basis
To apply the same authorization mode on all requests from a Data client, specify the authMode parameter on the generateClient function.

API Key
Amazon Cognito user pool
AWS IAM (including Amazon Cognito identity pool roles)
OpenID Connect (OIDC)
Lambda Authorizer
Use "API Key" as your authorization mode when if defined the allow.publicApiKey() authorization rule.

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>({
  authMode: 'apiKey',
});
Set authorization mode on the request-level
You can also specify the authorization mode on each individual API request. This is useful if your application typically only uses one authorization mode with a small number of exceptions.

API Key
Amazon Cognito user pool
AWS IAM (including Amazon Cognito identity pool roles)
OpenID Connect (OIDC)
Lambda Authorizer
const { data: todos, errors } = await client.models.Todo.list({
  authMode: 'apiKey',
});
Set custom request headers
When working with the Amplify Data endpoint, you may need to set request headers for authorization purposes or to pass additional metadata from your frontend to the backend API.

This is done by specifying a headers parameter into the configuration. You can define headers either on a per Data client-level or on a per-request level:

Custom headers per Data client
Custom headers per request
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>({
  headers: {
    'My-Custom-Header': 'my value',
  },
});
The examples above show you how to set static headers but you can also programmatically set headers by specifying an async function for headers:

Custom headers per Data client
Custom headers per request
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>({
  headers: async (requestOptions) => {
    console.log(requestOptions);
    /* The request options allow you to customize your headers based on the request options such
       as http method, headers, request URI, and query string. These options are typically used
       to create a request signature.
    {
      method: '...',
      headers: { },
      uri: '/',
      queryString: ""
    }
    */
    return {
      'My-Custom-Header': 'my value',
    };
  },
});
Use an additional Data endpoint
If you have an additional Data endpoint that you're managing with a different Amplify project or through other means, this section will show you how to utilize that endpoint in your frontend code.

This is done by specifying the endpoint parameter on the generateClient function.

import { generateClient } from 'aws-amplify/data';

const client = generateClient({
  endpoint: 'https://my-other-endpoint.com/graphql',
});
If this Data endpoint shares its authorization configuration (for example, both endpoints share the same user pool and/or identity pool as the one in your amplify_outputs.json file), you can specify the authMode parameter on generateClient.

const client = generateClient({
  endpoint: 'https://my-other-endpoint.com/graphql',
  authMode: 'userPool',
});
If the endpoint uses API Key authorization, you can pass in the apiKey parameter on generateClient.

const client = generateClient({
  endpoint: 'https://my-other-endpoint.com/graphql',
  authMode: 'apiKey',
  apiKey: 'my-api-key',
});
If the endpoint uses a different authorization configuration, you can manually pass in the authorization header using the instructions in the Set custom request headers section.


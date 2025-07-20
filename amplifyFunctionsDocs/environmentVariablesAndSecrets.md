Environment variables and secrets
Amplify Functions support setting environment variables and secrets on the environment property of defineFunction.

Note: do not store secret values in environment variables. Environment variables values are rendered in plaintext to the build artifacts located at .amplify/artifacts and may be emitted to CloudFormation stack event messages. To store secrets skip to the secrets section

Note: Environment variables and secrets configuration in defineFunction is not supported for Custom Functions.

Environment variables
Environment variables can be configured in defineFunction using the environment property.

amplify/functions/say-hello/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const sayHello = defineFunction({
  environment: {
    NAME: 'World'
  }
});
Any environment variables specified here will be available to the function at runtime.

Some environment variables are constant across all branches and deployments. But many environment values differ between deployment environments. Branch-specific environment variables can be configured for Amplify hosting deployments.

Suppose you created a branch-specific environment variable in hosting called "API_ENDPOINT" which had a different value for your "staging" vs "prod" branch. If you wanted that value to be available to your function you can pass it to the function using

amplify/functions/say-hello/resource.ts
export const sayHello = defineFunction({
  environment: {
    NAME: "World",
    API_ENDPOINT: process.env.API_ENDPOINT
  }
});
Accessing environment variables
Within your function handler, you can access environment variables using the normal process.env global object provided by the Node runtime. However, this does not make it easy to discover what environment variables will be available at runtime. Amplify generates an env symbol that can be used in your function handler and provides typings for all variables that will be available at runtime. Copy the following code to use it.

amplify/functions/say-hello/handler.ts
import { env } from '$amplify/env/say-hello'; // the import is '$amplify/env/<function-name>'

export const handler = async (event) => {
  // the env object has intellisense for all environment variables that are available to the function
  return `Hello, ${env.NAME}!`;
};
Learn more
Understanding the "env" symbol and how to manually configure your Amplify project to use it
Generated env files
When you configure your function with environment variables or secrets, Amplify's backend tooling generates a file using the function's name in .amplify/generated with references to your environment variables and secrets, as well as environment variables predefined by the Lambda runtime. This provides a type-safe experience for working with environment variables that does not require typing process.env manually.

Note: generated files are created before deployments when executing ampx sandbox or ampx pipeline-deploy

For example, if you have a function with the following definition:

amplify/functions/say-hello/resource.ts
import { defineFunction } from "@aws-amplify/backend";

export const sayHello = defineFunction({
  name: "say-hello",
  environment: {
    NAME: "World",
  },
});
Upon starting your next deployment, Amplify will create a file at the following location:

.amplify/generated/env/say-hello.ts
Using the TypeScript path alias, $amplify, you can import the file in your function's handler:

amplify/functions/say-hello/handler.ts
import { env } from "$amplify/env/say-hello"

export const handler = async (event) => {
  // the env object has intellisense for all environment variables that are available to the function
  return `Hello, ${env.NAME}!`;
};
Encountering issues with this file? Visit the troubleshooting guide for Cannot find module $amplify/env/<function-name>

Secrets
Sometimes it is necessary to provide a secret value to a function. For example, it may need a database password or an API key to perform some business use case. Environment variables should NOT be used for this because environment variable values are included in plaintext in the function configuration. Instead, secret access can be used.

Before using a secret in a function, you need to define a secret. After you have defined a secret, you can reference it in your function config.

amplify/functions/say-hello/resource.ts
import { defineFunction, secret } from '@aws-amplify/backend';

export const sayHello = defineFunction({
  environment: {
    NAME: "World",
    API_ENDPOINT: process.env.API_ENDPOINT,
    API_KEY: secret('MY_API_KEY') // this assumes you created a secret named "MY_API_KEY"
  }
});
You can use this secret value at runtime in your function the same as any other environment variable. However, you will notice that the value of the environment variable is not stored as part of the function configuration. Instead, the value is fetched when your function runs and is provided in memory.

amplify/functions/say-hello/handler.ts
import { env } from '$amplify/env/say-hello';

export const handler = async (event) => {
  const request = new Request(env.API_ENDPOINT, {
    headers: {
      // this is the value of secret named "MY_API_KEY"
      Authorization: `Bearer ${env.API_KEY}`
    }
  })
  // ...
  return `Hello, ${env.NAME}!`;
};
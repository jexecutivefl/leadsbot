Set up a Function
Amplify Functions are powered by AWS Lambda, and allow you to perform a wide variety of customization through self-contained functions. Functions can respond to events from other resources, execute some logic in-between events like an authentication flow, or act as standalone jobs. They are used in a variety of settings and use cases:

Authentication flow customizations (e.g. attribute validations, allowlisting email domains)
Resolvers for GraphQL APIs
Handlers for individual REST API routes, or to host an entire API
Scheduled jobs
To get started, create a new directory and a resource file, amplify/functions/say-hello/resource.ts. Then, define the Function with defineFunction:

amplify/functions/say-hello/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const sayHello = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'say-hello',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts'
});
Next, create the corresponding handler file at amplify/functions/say-hello/handler.ts. This is where your function code will go.

amplify/functions/say-hello/handler.ts
import type { Handler } from 'aws-lambda';

export const handler: Handler = async (event, context) => {
  // your function code goes here
  return 'Hello, World!';
};
The handler file must export a function named "handler". This is the entry point to your function. For more information on writing functions, refer to the AWS documentation for Lambda function handlers using Node.js.

Lastly, this function needs to be added to your backend.

amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { sayHello } from './functions/say-hello/resource';

defineBackend({
  sayHello
});
Now when you run npx ampx sandbox or deploy your app on Amplify, it will include your Function.

To invoke your Function, we recommend adding your Function as a handler for a custom query with your Amplify Data resource. This will enable you to strongly type Function arguments and the return statement, and use this to author your Function's business logic. To get started, open your amplify/data/resource.ts file and specify a new query in your schema:

amplify/data/resource.ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend"
import { sayHello } from "../functions/say-hello/resource"

const schema = a.schema({
  sayHello: a
    .query()
    .arguments({
      name: a.string(),
    })
    .returns(a.string())
    .authorization(allow => [allow.guest()])
    .handler(a.handler.function(sayHello)),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
})
Now you can use this query from the Schema export to strongly type your Function handler:

amplify/functions/say-hello/handler.ts
import type { Schema } from "../../data/resource"

export const handler: Schema["sayHello"]["functionHandler"] = async (event) => {
  // arguments typed from `.arguments()`
  const { name } = event.arguments
  // return typed from `.returns()`
  return `Hello, ${name}!`
}
Finally, use the data client to invoke your Function by calling its associated query.

src/main.ts
import type { Schema } from "./amplify/data/resource"
import { Amplify } from "aws-amplify"
import { generateClient } from "aws-amplify/api"
import outputs from "./amplify_outputs.json"

Amplify.configure(outputs)

const client = generateClient<Schema>()

client.queries.sayHello({
  name: "Amplify",
})
Next steps
Now that you have completed setting up your first Function, you may also want to add some additional features or modify a few settings. We recommend you learn more about:
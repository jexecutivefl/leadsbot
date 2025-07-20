With admin actions
Amplify Auth can be managed with the AWS SDK's @aws-sdk/client-cognito-identity-provider package. This package is intended to use server-side, and can be used within a Function. This example focuses on the addUserToGroup action and will be defined as a custom mutation.

To get started, create an "ADMINS" group that will be used to authorize the mutation:

amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["ADMINS"]
})
Next, create the Function resource:

amplify/data/add-user-to-group/resource.ts
import { defineFunction } from "@aws-amplify/backend"

export const addUserToGroup = defineFunction({
  name: "add-user-to-group",
})
Then, in your auth resources, grant access for the function to perform the addUserToGroup action. Learn more about granting access to auth resources.

amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend"
import { addUserToGroup } from "../data/add-user-to-group/resource"

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["ADMINS"],
  access: (allow) => [
    allow.resource(addUserToGroup).to(["addUserToGroup"])
  ],
})
You're now ready to define the custom mutation. Here you will use the newly-created addUserToGroup function resource to handle the addUserToGroup mutation. This mutation can only be called by a user in the "ADMINS" group.

amplify/data/resource.ts
import type { ClientSchema } from "@aws-amplify/backend"
import { a, defineData } from "@aws-amplify/backend"
import { addUserToGroup } from "./resource"

const schema = a.schema({
  addUserToGroup: a
    .mutation()
    .arguments({
      userId: a.string().required(),
      groupName: a.string().required(),
    })
    .authorization((allow) => [allow.group("ADMINS")])
    .handler(a.handler.function(addUserToGroup))
    .returns(a.json())
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
})
Lastly, create the function's handler using the exported client schema to type the handler function, and the generated env to specify the user pool ID you'd like to interact with:

amplify/data/add-user-to-group/handler.ts
import type { Schema } from "../resource"
import { env } from "$amplify/env/add-user-to-group"
import {
  AdminAddUserToGroupCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider"

type Handler = Schema["addUserToGroup"]["functionHandler"]
const client = new CognitoIdentityProviderClient()

export const handler: Handler = async (event) => {
  const { userId, groupName } = event.arguments
  const command = new AdminAddUserToGroupCommand({
    Username: userId,
    GroupName: groupName,
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
  })
  const response = await client.send(command)
  return response
}
In your frontend, use the generated client to call your mutation using the group name and the user's ID.

src/client.ts
import type { Schema } from "../amplify/data/resource"
import { generateClient } from "aws-amplify/data"

const client = generateClient<Schema>()

await client.mutations.addUserToGroup({
  groupName: "ADMINS",
  userId: "5468d468-4061-70ed-8870-45c766d26225",
})
Usernames
Amplify Auth does not support signing in with only username and password, however can be configured to enable usernames for display purposes. Amazon Cognito offers two ways of provisioning login mechanisms:

Username attributes
Alias attributes
Each are described in more detail on the AWS documentation for Cognito user pool settings, however at a high-level can be described as follows:

Username attributes allow you to customize which attribute can be used as the "username", or allowing users to sign in with an email or phone in place of a username
Alias attributes allow you to specify with attribute(s) can be used with sign in in addition to a username
With Amazon Cognito, usernames are immutable, which means after the initial sign-up users are unable to change their username later. In some applications this may be undesirable, which can motivate the use of alias attributes. Alias attributes allow you to define a mutable "preferred username" in addition to an immutable username.

Amplify Auth leverages username attributes to configure Cognito to accept an email or a phone number as the "username". Users will then need to verify their ownership of specified email or phone number to confirm their account.

However, it is common to consider a "username" for display purposes. For example, you can configure your auth resource to accept a "preferred username" to be used as the display name:

amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false
    }
  }
});
This is not a username the user will be able to sign in with, but it can be used to mask their personal information such as their email or phone number when displaying publicly.

If you would like to override the default behavior and allow your users to sign up with an immutable username, you can use CDK to modify your auth resource's usernameAttributes configuration directly:

amplify/backend.ts
import { defineBackend } from "@aws-amplify/backend"
import { auth } from "./auth/resource"
import { data } from "./data/resource"

const backend = defineBackend({
  auth,
  data,
})

const { cfnUserPool } = backend.auth.resources.cfnResources
// an empty array denotes "email" and "phone_number" cannot be used as a username
cfnUserPool.usernameAttributes = []
User attributes
Amplify Auth stores user profile information in user attributes. When the default method for user sign-in, Amplify Auth will automatically configure an email or phoneNumber attribute that is required for sign-in.

To extend a user profile beyond the default email or phoneNumber attribute that is automatically configured when specified in your auth resource's loginWith property, you can configure attributes with the userAttributes property:

Warning: After you create your auth resource, you cannot switch an attribute between required and not required.

amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
    // this configures a required "email" attribute
    email: true,
  },
  userAttributes: {
    // specify a "birthdate" attribute
    birthdate: {
      mutable: true,
      required: false,
    }
  },
})
Standard attributes
User attributes are defined as Cognito Standard Attributes. Attributes can be configured to be required for user sign-up in addition to whether the values are mutable. When configuring your resource to allow your users to login with email, an email must be specified for user sign-up and cannot be changed later. However additional attributes can be configured to be optional, and mutable after sign-up.

amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    // Maps to Cognito standard attribute 'address'
    address: {
      mutable: true,
      required: true,
    },
    // Maps to Cognito standard attribute 'birthdate'
    birthdate: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'email'
    email: {
      mutable: true,
      required: true,
    },
    // Maps to Cognito standard attribute 'family_name'
    familyName: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'gender'
    gender: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'given_name'
    givenName: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'locale'
    locale: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'middle_name'
    middleName: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'name'
    fullname: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'nickname'
    nickname: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'phone_number'
    phoneNumber: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'picture'
    profilePicture: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'preferred_username'
    preferredUsername: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'profile'
    profilePage: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'zoneinfo'
    timezone: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'updated_at'
    lastUpdateTime: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'website'
    website: {
      mutable: true,
      required: false,
    },
  },
});
Custom attributes
In addition to the provided standard attributes, you can configure Custom Attributes. These are attributes that are typically unique to your use case, such as a tenant ID or a user's display name. Custom attributes are identified by the custom: prefix:

amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
    // this configures a required "email" attribute
    email: true,
  },
  userAttributes: {
    "custom:display_name": {
      dataType: "String",
      mutable: true,
      maxLen: 16,
      minLen: 1,
    },
    "custom:favorite_number": {
      dataType: "Number",
      mutable: true,
      min: 1,
      max: 100,
    },
    "custom:is_beta_user": {
      dataType: "Boolean",
      mutable: true,
    },
    "custom:started_free_trial": {
      dataType: "DateTime",
      mutable: true,
    },
  },
})
Unlike standard attributes, custom attributes cannot natively be required for sign-up, however can be codified to require some value by validating user attributes upon sign-up with a pre sign-up trigger.

Custom attributes can also be configured with specific data types. The following data types are supported:

String
Number
Boolean
DateTime
Shown in the snippet above, String and Number can be assigned minimum and maximum constraints. This is useful to defer simple validations to the underlying service, although does not extend to complex validations such as matching against a regular expression.
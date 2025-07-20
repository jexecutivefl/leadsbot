Manage user attributes
User attributes such as email address, phone number help you identify individual users. Defining the user attributes you include for your user profiles makes user data easy to manage at scale. This information will help you personalize user journeys, tailor content, provide intuitive account control, and more. You can capture information upfront during sign-up or enable customers to update their profile after sign-up. In this section we take a closer look at working with user attributes, how to set them up and manage them.

Pass user attributes during sign-up
You can create user attributes during sign-up or when the user is authenticated. To do this as part of sign-up you can pass them in the userAttributes object of the signUp API:

import { signUp } from "aws-amplify/auth";

await signUp({
  username: "jdoe",
  password: "mysecurerandompassword#123",
  options: {
    userAttributes: {
      email: "me@domain.com",
      phone_number: "+12128601234", // E.164 number convention
      given_name: "Jane",
      family_name: "Doe",
      nickname: "Jane",
    },
  },
});
Configure custom user attributes during sign-up
Custom attributes can be passed in with the userAttributes option of the signUp API:

import { signUp } from "aws-amplify/auth";

await signUp({
  username: 'john.doe@example.com',
  password: 'hunter2',
  options: {
    userAttributes: {
      'custom:display_name': 'john_doe123',
    }
  }
});
Retrieve user attributes
You can retrieve user attributes for your users to read in their profile using the fetchUserAttributes API. This helps you personalize their frontend experience as well as control what they will see.

import { fetchUserAttributes } from 'aws-amplify/auth';

await fetchUserAttributes();
Update user attribute
You can use the updateUserAttribute API to create or update existing user attributes.

TypeScript
JavaScript
import {
  updateUserAttribute,
  type UpdateUserAttributeOutput
} from 'aws-amplify/auth';

async function handleUpdateUserAttribute(attributeKey: string, value: string) {
  try {
    const output = await updateUserAttribute({
      userAttribute: {
        attributeKey,
        value
      }
    });
    handleUpdateUserAttributeNextSteps(output);
  } catch (error) {
    console.log(error);
  }
}

function handleUpdateUserAttributeNextSteps(output: UpdateUserAttributeOutput) {
  const { nextStep } = output;

  switch (nextStep.updateAttributeStep) {
    case 'CONFIRM_ATTRIBUTE_WITH_CODE':
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      console.log(
        `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`
      );
      // Collect the confirmation code from the user and pass to confirmUserAttribute.
      break;
    case 'DONE':
      console.log(`attribute was successfully updated.`);
      break;
  }
}
Note: If you change an attribute that requires confirmation (i.e. email or phone_number), the user will receive a confirmation code either to their email or cellphone. This code can be used with the confirmUserAttribute API to confirm the change.

Update user attributes
You can use the updateUserAttributes API to create or update multiple existing user attributes.

import { updateUserAttributes, type UpdateUserAttributesOutput } from "aws-amplify/auth";

await updateUserAttributes({
  userAttributes: {
    email: "me@domain.com",
    name: "Jon Doe",
  },
});
Verify user attribute
Some attributes require confirmation for the attribute update to complete. If the attribute needs to be confirmed, part of the result of the updateUserAttribute or updateUserAttributes APIs will be CONFIRM_ATTRIBUTE_WITH_CODE. A confirmation code will be sent to the delivery medium mentioned in the delivery details. When the user gets the confirmation code, you can present a UI to the user to enter the code and invoke the confirmUserAttribute API with their input:

import {
  confirmUserAttribute,
  type ConfirmUserAttributeInput
} from 'aws-amplify/auth';

async function handleConfirmUserAttribute({
  userAttributeKey,
  confirmationCode
}: ConfirmUserAttributeInput) {
  try {
    await confirmUserAttribute({ userAttributeKey, confirmationCode });
  } catch (error) {
    console.log(error);
  }
}
Send user attribute verification code
If an attribute needs to be verified while the user is authenticated, invoke the sendUserAttributeVerificationCode API as shown below:

import {
  sendUserAttributeVerificationCode,
  type VerifiableUserAttributeKey
} from 'aws-amplify/auth';

async function handleSendUserAttributeVerificationCode(
  key: VerifiableUserAttributeKey
) {
  try {
    await sendUserAttributeVerificationCode({
      userAttributeKey: key
    });
  } catch (error) {
    console.log(error);
  }
}
Delete user attributes
The deleteUserAttributes API allows to delete one or more user attributes.

import {
  deleteUserAttributes,
  type DeleteUserAttributesInput
} from 'aws-amplify/auth';

async function handleDeleteUserAttributes(
  keys: DeleteUserAttributesInput['userAttributeKeys']
) {
  try {
    await deleteUserAttributes({
      userAttributeKeys: ['custom:my_custom_attribute', ...keys]
    });
  } catch (error) {
    console.log(error);
  }
}
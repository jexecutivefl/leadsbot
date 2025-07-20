Moving to production
Amplify Auth provisions Amazon Cognito resources that are provisioned with limited capabilities for sending email and SMS messages. In its default state, it is not intended to handle production workloads, but is sufficient for developing your application and associated business logic.

Email
Cognito provides a default email functionality that limits how many emails can be sent in one day. When considering production workloads, Cognito can be configured to send emails using Amazon Simple Email Service (Amazon SES).

All new AWS accounts default to a "sandbox" status with Amazon SES. This comes with the primary caveat that you can only send mail to verified email addresses and domains

To get started with Amazon SES in production, you must first request production access. Once you submit your request the submission cannot be modified, however you will receive a response from AWS within 24 hours.

After you have configured your account for production access and have verified your sender email, you can configure your Cognito user pool to send emails using the verified sender:

amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend"

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/react/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  senders: {
    email: {
      // configure using the email registered and verified in Amazon SES
      fromEmail: "registrations@example.com",
    },
  },
})
Now when emails are sent on new user sign-ups, password resets, etc., the sending account will be your verified email! To customize further, you can change the display name of the sender, or optionally apply a custom address for your users to reply.

amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend"

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/react/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  senders: {
    email: {
      fromEmail: "registrations@example.com",
      fromName: "MyApp",
      replyTo: "inquiries@example.com"
    },
  },
})
SMS
In order to send SMS authentication codes, you must request an origination number. Authentication codes will be sent from the origination number. If your AWS account is in the SMS sandbox, you must also add a destination phone number, which can be done by going to the Amazon Pinpoint Console, selecting SMS and voice in the navigation pane, and selecting Add phone number in the Destination phone numbers tab. To check if your AWS account is in the SMS sandbox, go to the SNS console, select the Text messaging (SMS) tab from the navigation pane, and check the status under the Account information section.
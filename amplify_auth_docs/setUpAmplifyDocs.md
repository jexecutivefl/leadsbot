Set up Amplify Auth
Amplify Auth is powered by Amazon Cognito. Cognito is a robust user directory service that handles user registration, authentication, account recovery, and other operations. Review the concepts to learn more.

To get started with defining your authentication resource, open or create the auth resource file:

amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend"

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
})
By default, your auth resource is scaffolded using email as the default login mechanism. You can also configure your auth resource to allow signing in with phone numbers or an external provider such as Google, Facebook, Amazon, or Sign in with Apple.

Note: At a minimum you will need to pass a loginWith value to set up how your users sign in to your app. Signing in with email and password is configured by default if you do not provide any value.

Deploy auth resource
After you have chosen and defined your authentication resource, run the following command to create your resource in your personal cloud sandbox.

Terminal
npx ampx sandbox
After a successful deployment, this command also generates an outputs file (amplify_outputs.json) to enable your frontend app to connect to your backend resources. The values you configure in your backend authentication resource are set in the generated outputs file to automatically configure the frontend Authenticator connected component.

Connect your application code to your auth resource
Creating and correctly implementing the sign-in flow can be challenging and time-consuming. Amplify's Authenticator UI component streamlines this by enabling you to rapidly build the entire authentication flow for your app. The component works seamlessly with configuration in amplify/auth/resource.ts to automatically connect with your backend resources.

Amplify has pre-built UI components for React, Vue, Angular, React Native, Swift, Android, and Flutter. In this guide, we are focusing on those for web applications.

First, install the @aws-amplify/ui-react library:

Terminal
npm add @aws-amplify/ui-react
Next, open pages/_app.tsx and add the Authenticator component.

pages/_app.tsx
import type { AppProps } from 'next/app';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
          <Component {...pageProps} />
        </main>
      )}
    </Authenticator>
  );
};
Once you add the Authenticator component to your app, you can test the sign-up, sign-in, and sign-out functionality. You can also customize the Authenticator connected component to adjust colors and styling as needed.
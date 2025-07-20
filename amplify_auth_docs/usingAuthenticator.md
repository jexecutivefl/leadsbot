Using the Authenticator
The quickest way to get started with Amplify Auth in your frontend application is with the Authenticator component, which provides a customizable UI and complete authentication flows.

src/App.tsx
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}
The Authenticator component is automatically configured based on the outputs generated from your backend. To learn more about the Authenticator and how to customize its appearance, visit the Amplify UI documentation.

Conversely, you can bring your own UI and leverage the library from aws-amplify to handle authentication flows manually.
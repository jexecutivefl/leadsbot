Manage user sessions
Amplify Auth provides access to current user sessions and tokens to help you retrieve your user's information to determine if they are signed in with a valid session and control their access to your app.

Retrieve your current authenticated user
You can use the getCurrentUser API to get information about the currently authenticated user including the username, userId and signInDetails.

import { getCurrentUser } from 'aws-amplify/auth';

const { username, userId, signInDetails } = await getCurrentUser();

console.log("username", username);
console.log("user id", userId);
console.log("sign-in details", signInDetails);
This method can be used to check if a user is signed in. It throws an error if the user is not authenticated.

The user's signInDetails are not supported when using the Hosted UI or the signInWithRedirect API.

Retrieve a user session
Your user's session is their signed-in state, which grants them access to your app. When your users sign in, their credentials are exchanged for temporary access tokens. You can get session details to access these tokens and use this information to validate user access or perform actions unique to that user.

If you only need the session details, you can use the fetchAuthSession API which returns a tokens object containing the JSON Web Tokens (JWT).

import { fetchAuthSession } from 'aws-amplify/auth';

const session = await fetchAuthSession();

console.log("id token", session.tokens.idToken)
console.log("access token", session.tokens.accessToken)
Refreshing sessions
The fetchAuthSession API automatically refreshes the user's session when the authentication tokens have expired and a valid refreshToken is present. Additionally, you can also refresh the session explicitly by calling the fetchAuthSession API with the forceRefresh flag enabled.

import { fetchAuthSession } from 'aws-amplify/auth';

await fetchAuthSession({ forceRefresh: true });
Warning: by default, sessions from external identity providers cannot be refreshed.
Listen to auth events
Amplify Auth emits events during authentication flows, which enables you to react to user flows in real time and trigger custom business logic. For example, you may want to capture data, synchronize your app's state, and personalize the user's experience. You can listen to and respond to events across the Auth lifecycle such as sign-in and sign-out.

Expose hub events triggered in response to auth actions
You can use Amplify Hub with its built in Amplify Auth events to subscribe a listener using a publish-subscribe pattern and capture events between different parts of your application. The Amplify Auth category publishes in the auth channel when auth events such as signedIn or signedOut happen independent from your app code.

You can review the Amplify Hub guide to learn more.

Channels are logical group names that help you organize dispatching and listening. However, some channels are protected and cannot be used to publish custom events, and auth is one of these channels. Sending unexpected payloads to protected channels can have undesirable side effects such as impacting authentication flows. See the Amplify Hub guide for more protected channels.

Here is a basic example of setting up a listener that logs an event emitted through the auth channel:

import { Hub } from 'aws-amplify/utils';

Hub.listen('auth', (data) => {
  console.log(data)
});
Once your app is set up to subscribe and listen to specific event types from the auth channel, the listeners will be notified asynchronously when an event occurs. This pattern allows for a one-to-many relationship where one auth event can be shared with many different listeners that have been subscribed. This lets your app react based on the event rather than proactively poll for information.

Additionally, you can set up your listener to extract data from the event payload and execute a callback that you define. For example, you might update UI elements in your app to reflect your user's authenticated state after the signedIn or signedOut events.

Listen to and log auth events
One of the most common workflows will be to log events. In this example you can see how you can listen and target specific auth events using a switch to log your own messages.

import { Hub } from 'aws-amplify/utils';

Hub.listen('auth', ({ payload }) => {
  switch (payload.event) {
    case 'signedIn':
      console.log('user have been signedIn successfully.');
      break;
    case 'signedOut':
      console.log('user have been signedOut successfully.');
      break;
    case 'tokenRefresh':
      console.log('auth tokens have been refreshed.');
      break;
    case 'tokenRefresh_failure':
      console.log('failure while refreshing auth tokens.');
      break;
    case 'signInWithRedirect':
      console.log('signInWithRedirect API has successfully been resolved.');
      break;
    case 'signInWithRedirect_failure':
      console.log('failure while trying to resolve signInWithRedirect API.');
      break;
    case 'customOAuthState':
      logger.info('custom state returned from CognitoHosted UI');
      break;
  }
});
Stop listening to events
You can also stop listening for messages by calling the result of the Hub.listen() function. This may be useful if you no longer need to receive messages in your application flow. This can also help you avoid any memory leaks on low powered devices when you are sending large amounts of data through Amplify Hub on multiple channels.

To stop listening to a certain event, you need to wrap the listener function with a variable and call it once you no longer need it:

/* start listening for messages */
const hubListenerCancelToken = Hub.listen('auth', (data) => {
  console.log('Listening for all auth events: ', data.payload.data);
});

/* later */
hubListenerCancelToken(); // stop listening for messages
You now have a few use cases and examples for listening to and responding to auth events.
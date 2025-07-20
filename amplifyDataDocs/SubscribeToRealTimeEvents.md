Subscribe to real-time events
In this guide, we will outline the benefits of enabling real-time data integrations and how to set up and filter these subscriptions. We will also cover how to unsubscribe from subscriptions.

Before you begin, you will need:

An application connected to the API
Data already created to modify
With Amplify Data Construct @aws-amplify/data-construct@1.8.4, an improvement was made to how relational field data is handled in subscriptions when different authorization rules apply to related models in a schema. The improvement redacts the values for the relational fields, displaying them as null or empty, to prevent unauthorized access to relational data.

This redaction occurs whenever it cannot be determined that the child model will be protected by the same permissions as the parent model.

Because subscriptions are tied to mutations and the selection set provided in the result of a mutation is then passed through to the subscription, relational fields in the result of mutations must be redacted.

If an authorized end-user needs access to the redacted relational fields, they should perform a query to read the relational data.

Additionally, subscriptions will inherit related authorization when relational fields are set as required. To better protect relational data, consider modifying the schema to use optional relational fields.

Set up a real-time list query
The recommended way to fetch a list of data is to use observeQuery to get a real-time list of your app data at all times. You can integrate observeQuery with React's useState and useEffect hooks in the following way:

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

type Todo = Schema['Todo']['type'];

const client = generateClient<Schema>();

export default function MyComponent() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        setTodos([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
  );
}
observeQuery fetches and paginates through all of your available data in the cloud. While data is syncing from the cloud, snapshots will contain all of the items synced so far and an isSynced status of false. When the sync process is complete, a snapshot will be emitted with all the records in the local store and an isSynced status of true.

Troubleshooting
Missing real-time events and model fields
Set up a real-time event subscription
Subscriptions is a feature that allows the server to send data to its clients when a specific event happens. For example, you can subscribe to an event when a new record is created, updated, or deleted through the API. Subscriptions are automatically available for any a.model() in your Amplify Data schema.

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

// Subscribe to creation of Todo
const createSub = client.models.Todo.onCreate().subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

// Subscribe to update of Todo
const updateSub = client.models.Todo.onUpdate().subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

// Subscribe to deletion of Todo
const deleteSub = client.models.Todo.onDelete().subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

// Stop receiving data updates from the subscription
createSub.unsubscribe();
updateSub.unsubscribe();
deleteSub.unsubscribe();
Set up server-side subscription filters
Subscriptions take an optional filter argument to define service-side subscription filters:

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

const sub = client.models.Todo.onCreate({
  filter: {
    content: {
      contains: 'groceries',
    },
  },
}).subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});
If you want to get all subscription events, don't specify any filter parameters.

Limitations:

Specifying an empty object {} as a filter is not recommended. Using {} as a filter might cause inconsistent behavior based on your data model's authorization rules.
If you're using dynamic group authorization and you authorize based on a single group per record, subscriptions are only supported if the user is part of five or fewer user groups.
Additionally, if you authorize by using an array of groups (groups: [String]),
subscriptions are only supported if the user is part of 20 or fewer groups
you can only authorize 20 or fewer user groups per record
Subscription connection status updates
Now that your application is set up and using subscriptions, you may want to know when the subscription is finally established, or reflect to your users when the subscription isn't healthy. You can monitor the connection state for changes through the Hub local eventing system.

import { CONNECTION_STATE_CHANGE, ConnectionState } from 'aws-amplify/data';
import { Hub } from 'aws-amplify/utils';

Hub.listen('api', (data: any) => {
  const { payload } = data;
  if (payload.event === CONNECTION_STATE_CHANGE) {
    const connectionState = payload.data.connectionState as ConnectionState;
    console.log(connectionState);
  }
});
Subscription connection states
Connected - Connected and working with no issues.
ConnectedPendingDisconnect - The connection has no active subscriptions and is disconnecting.
ConnectedPendingKeepAlive - The connection is open, but has missed expected keep-alive messages.
ConnectedPendingNetwork - The connection is open, but the network connection has been disrupted. When the network recovers, the connection will continue serving traffic.
Connecting - Attempting to connect.
ConnectionDisrupted - The connection is disrupted and the network is available.
ConnectionDisruptedPendingNetwork - The connection is disrupted and the network connection is unavailable.
Disconnected - Connection has no active subscriptions and is disconnecting.
Troubleshooting
Troubleshoot connection issues and automated reconnection
Unsubscribe from a subscription
You can also unsubscribe from events by using subscriptions by implementing the following:

// Stop receiving data updates from the subscription
sub.unsubscribe();
Conclusion
Congratulations! You have finished the Subscribe to real-time events guide. In this guide, you set up subscriptions for real-time events and learned how to filter and cancel these subscriptions when needed.
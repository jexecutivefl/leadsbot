Multi-user data access
The ownersDefinedIn rule grants a set of users access to a record by automatically creating an owners field to store the allowed record owners. You can override the default owners field name by specifying inField with the desired field name to store the owner information. You can dynamically manage which users can access a record by updating the owner field.

Add multi-user authorization rule
If you want to grant a set of users access to a record, you use the ownersDefinedIn rule. This automatically creates a owners: a.string().array() field to store the allowed owners.

amplify/data/resource.ts
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      owners: a.string().array(),
    })
    .authorization(allow => [allow.ownersDefinedIn('owners')]),
});
In your application, you can perform CRUD operations against the model using client.models.<model-name> with the userPool auth mode.

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>();

// Create a record with current user as first owner
const { errors, data: newTodo } = await client.models.Todo.create(
  {
    content: 'My new todo',
  },
  {
    authMode: 'userPool',
  }
);
Add another user as an owner

await client.models.Todo.update(
  {
    id: newTodo.id,
    owners: [...(newTodo.owners as string[]), otherUserId],
  },
  {
    authMode: "userPool"
  }
);
Override to a list of owners
You can override the inField to a list of owners. Use this if you want a dynamic set of users to have access to a record. In the example below, the authors list is populated with the creator of the record upon record creation. The creator can then update the authors field with additional users. Any user listed in the authors field can access the record.

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      authors: a.string().array(), // record owner information now stored in "authors" field
    })
    .authorization(allow => [allow.ownersDefinedIn('authors')]),
});
Per-user/per-owner data access
The owner authorization strategy restricts operations on a record to only the record's owner. When configured, the owner field will automatically be added and populated with the identity of the created user. The API will authorize against the owner field to allow or deny operations.

Add per-user/per-owner authorization rule
You can use the owner authorization strategy to restrict a record's access to a specific user. When owner authorization is configured, only the record's owner is allowed the specified operations.

amplify/data/resource.ts
// The "owner" of a Todo is allowed to create, read, update, and delete their own todos
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization(allow => [allow.owner()]),
});
amplify/data/resource.ts
// The "owner" of a Todo record is only allowed to create, read, and update it.
// The "owner" of a Todo record is denied to delete it.
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization(allow => [allow.owner().to(['create', 'read', 'update'])]),
});
In your application, you can perform CRUD operations against the model using client.models.<model-name> with the userPool auth mode.

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
    content: 'My new todo',
  },
  {
    authMode: 'userPool',
  }
);
Behind the scenes, Amplify will automatically add a owner: a.string() field to each record which contains the record owner's identity information upon record creation.

By default, the Cognito user pool's user information is populated into the owner field. The value saved includes sub and username in the format <sub>::<username>. The API will authorize against the full value of <sub>::<username> or sub / username separately and return username. You can alternatively configure OpenID Connect as an authorization provider.

By default, owners can reassign the owner of their existing record to another user.

To prevent an owner from reassigning their record to another user, protect the owner field (by default owner: String) with a field-level authorization rule. For example, in a social media app, you would want to prevent Alice from being able to reassign Alice's Post to Bob.

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      owner: a.string().authorization(allow => [allow.owner().to(['read', 'delete'])]),
    })
    .authorization(allow => [allow.owner()]),
});
Customize the owner field
You can override the owner field to your own preferred field, by specifying a custom ownerField in the authorization rule.

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      author: a.string(), // record owner information now stored in "author" field
    })
    .authorization(allow => [allow.ownerDefinedIn('author')]),
});
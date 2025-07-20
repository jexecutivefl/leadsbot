Create, update, and delete application data
In this guide, you will learn how to create, update, and delete your data using Amplify Libraries' Data client.

Before you begin, you will need:

An application connected to the API
Create an item
You can create an item by first generating the Data client with your backend Data schema. Then you can add an item:

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource'

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create({
  content: "My new todo",
  isDone: true,
})
Note: You do not need to specify createdAt or updatedAt fields because Amplify automatically populates these fields for you.

Update an item
To update the item, use the update function:

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

const todo = {
  id: 'some_id',
  content: 'Updated content',
};

const { data: updatedTodo, errors } = await client.models.Todo.update(todo);
Notes:

You do not need to specify the updatedAt field. Amplify will automatically populate this field for you.
If you specify extra input fields not expected by the API, this query will fail. You can see this in the errors field returned by the query. With Amplify Data, errors are not thrown like exceptions. Instead, any errors are captured and returned as part of the query result in the errors field.
Delete an item
You can then delete the Todo by using the delete mutation. To specify which item to delete, you only need to provide the id of that item:

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource'

const client = generateClient<Schema>();

const toBeDeletedTodo = {
  id: '123123213'
}

const { data: deletedTodo, errors } = await client.models.Todo.delete(toBeDeletedTodo)
Note: When deleting items in many-to-many relationships, the join table records must be deleted before deleting the associated records. For example, for a many-to-many relationship between Posts and Tags, delete the PostTags join record before deleting a Post or Tag. Review Many-to-many relationships for more details.

Troubleshooting
Troubleshoot unauthorized errors
Cancel create, update, and delete requests
You can cancel any mutation API request by calling .cancel on the mutation request promise that's returned by .create(...), .update(...), or .delete(...).

const promise = client.models.Todo.create({ content: 'New Todo' });
//  ^ Note: we're not awaiting the request, we're returning the promise

try {
  await promise;
} catch (error) {
  console.log(error);
  // If the error is because the request was cancelled you can confirm here.
  if (client.isCancelError(error)) {
    console.log(error.message); // "my message for cancellation"
    // handle user cancellation logic
  }
}

//...

// To cancel the above request
client.cancel(promise, 'my message for cancellation');
You need to ensure that the promise returned from .create(), .update(), and .delete() has not been modified. Typically, async functions wrap the promise being returned into another promise. For example, the following will not work:

async function makeAPICall() {
  return client.models.Todo.create({ content: 'New Todo' });
}
const promise = makeAPICall();

// The following will NOT cancel the request.
client.cancel(promise, 'my error message');
Conclusion
Congratulations! You have finished the Create, update, and delete application data guide. In this guide, you created, updated, and deleted your app data.
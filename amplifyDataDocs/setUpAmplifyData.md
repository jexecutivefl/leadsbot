Set up Amplify Data
In this guide, you will learn how to set up Amplify Data. This includes building a real-time API and database using TypeScript to define your data model, and securing your API with authorization rules. We will also explore using AWS Lambda to scale to custom use cases.

Before you begin, you will need:

Node.js v18.16.0 or later
npm v6.14.4 or later
git v2.14.1 or later
With Amplify Data, you can build a secure, real-time API backed by a database in minutes. After you define your data model using TypeScript, Amplify will deploy a real-time API for you. This API is powered by AWS AppSync and connected to an Amazon DynamoDB database. You can secure your API with authorization rules and scale to custom use cases with AWS Lambda.

Building your data backend
If you've run npm create amplify@latest already, you should see an amplify/data/resource.ts file, which is the central location to configure your data backend. The most important element is the schema object, which defines your backend data models (a.model()) and custom queries (a.query()), mutations (a.mutation()), and subscriptions (a.subscription()).

amplify/data/resource.ts
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a.model({
      content: a.string(),
      isDone: a.boolean()
    })
    .authorization(allow => [allow.publicApiKey()])
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});
Every a.model() automatically creates the following resources in the cloud:

a DynamoDB database table to store records
query and mutation APIs to create, read (list/get), update, and delete records
createdAt and updatedAt fields that help you keep track of when each record was initially created or when it was last updated
real-time APIs to subscribe for create, update, and delete events of records
The allow.publicApiKey() rule designates that anyone authenticated using an API key can create, read, update, and delete todos.

To deploy these resources to your cloud sandbox, run the following CLI command in your terminal:

Terminal
npx ampx sandbox
Connect your application code to the data backend
Once the cloud sandbox is up and running, it will also create an amplify_outputs.json file, which includes the relevant connection information to your data backend, like your API endpoint URL and API key.

To connect your frontend code to your backend, you need to:

Configure the Amplify library with the Amplify client configuration file (amplify_outputs.json)
Generate a new API client from the Amplify library
Make an API request with end-to-end type-safety
First, install the Amplify client library to your project:

Terminal
npm add aws-amplify
In your app's entry point, typically main.tsx for React apps created using Vite, make the following edits:

src/main.tsx
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
Write data to your backend
Let's first add a button to create a new todo item. To make a "create Todo" API request, generate the data client using generateClient() in your frontend code, and then call .create() operation for the Todo model. The Data client is a fully typed client that gives you in-IDE code completion. To enable this in-IDE code completion capability, pass in the Schema type to the generateClient function.

src/TodoList.tsx
import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'

const client = generateClient<Schema>()

export default function TodoList() {
  const createTodo = async () => {
    await client.models.Todo.create({
      content: window.prompt("Todo content?"),
      isDone: false
    })
  }

  return <div>
    <button onClick={createTodo}>Add new todo</button>
  </div>
}
Run the application in local development mode with npm run dev and check your network tab after creating a todo. You should see a successful request to a /graphql endpoint.

Try playing around with the code completion of .update(...) and .delete(...) to get a sense of other mutation operations.

Read data from your backend
Next, list all your todos and then refetch the todos after a todo has been added:

src/TodoList.tsx
import { useState, useEffect } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export default function TodoList() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);

  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Todo.list();
    setTodos(items);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const createTodo = async () => {
    await client.models.Todo.create({
      content: window.prompt("Todo content?"),
      isDone: false,
    });

    fetchTodos();
  }

  return (
    <div>
      <button onClick={createTodo}>Add new todo</button>
      <ul>
        {todos.map(({ id, content }) => (
          <li key={id}>{content}</li>
        ))}
      </ul>
    </div>
  );
}
Subscribe to real-time updates
You can also use observeQuery to subscribe to a live feed of your backend data. Let's refactor the code to use a real-time observeQuery instead.

src/App.tsx
import type { Schema } from "../amplify/data/resource";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export default function TodoList() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setTodos([...items]);
      },
    });

    return () => sub.unsubscribe();
  }, []);

  const createTodo = async () => {
    await client.models.Todo.create({
      content: window.prompt("Todo content?"),
      isDone: false,
    });
    // no more manual refetchTodos required!
    // - fetchTodos()
  };

  return (
    <div>
      <button onClick={createTodo}>Add new todo</button>
      <ul>
        {todos.map(({ id, content }) => (
          <li key={id}>{content}</li>
        ))}
      </ul>
    </div>
  );
}
Conclusion
Success! You've learned how to create your first real-time API and database with Amplify Data.
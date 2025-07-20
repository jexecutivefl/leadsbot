Read application data
You can read application data using the Amplify Data client. In this guide, we will review the difference between reading data and getting data, how to filter query results to get just the data you need, and how to paginate results to make your data more manageable. We will also show you how to cancel these requests when needed.

Before you begin, you will need:

An application connected to the API
Data already created to view
List and get your data
Queries are used to read data through the API and include the list and get operations. Amplify Data automatically creates list and get queries for any a.model() type in your schema. The list query retrieves multiple items, such as Todo items, without needing to specific an identifier for a particular record. This is best suited for getting an overview or summary of items, or for enhancing the list operation to filter the items by specific criteria. When you want to query a single entry by an identifier, you would use get to retrieve a specific Todo item.

Note: The cost structure of your underlying data source can impact the cost to run some queries. For example, the list operation uses Amazon DynamoDB "scan operations," which can use more read request units than the get operation. You will want to review the associated costs for these operations for your data source. In our example, we are using DynamoDB. You can learn more about how DynamoDB costs are calculated by visiting Amazon DynamoDB pricing.

You can list items by first generating the Data client with your backend Data schema. Then you can list items of your desired model:

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

// list all items
const { data: todos, errors } = await client.models.Todo.list();

// get a specific item
const { data: todo, errors } = await client.models.Todo.get({
  id: '...',
});
Troubleshooting
Troubleshoot unauthorized errors
Filter list queries
As your data grows, you will need to paginate your list queries. Fortunately, this is already built in to Amplify Data.

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

const { data: todos, errors } = await client.models.Todo.list({
  filter: {
    content: {
      beginsWith: 'hello'
    }
  }
});
Compound filters
You can combine filters with and, or, and not Boolean logic. Observe that filter is recursive in respect to those fields. So if, for example, you wanted to filter for priority values of 1 or 2, you would do this:

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

const { data: todos, errors } = await client.models.Todo.list({
  filter: {
    or: [
      {
        priority: { eq: '1' }
      },
      {
        priority: { eq: '2' }
      }
    ]
  }
});
Note that querying for priority of 1 and 2 would return no results, because this is Boolean logic instead of natural language.

Paginate list queries
To paginate your list query results, make a subsequent list query request with the nextToken and limit input variable set. The limit variable limits how many results are returned. The response will include a nextToken you can use to request the next page of data. A nextToken is a very long string that represents the cursor to the starting item of the next query made with these filters.

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

const {
  data: todos,
  nextToken, // Repeat this API call with the nextToken until the returned nextToken is `null`
  errors
} = await client.models.Todo.list({
  limit: 100, // default value is 100
  nextToken: 'eyJ2ZXJzaW9uejE1a2...' // previous nextToken
});
If you're building a React application, you can use the usePagination hook in Amplify UI to help with managing the pagination user experience.

import * as React from 'react';
import { Pagination } from '@aws-amplify/ui-react';

export const PaginationHasMorePagesExample = () => {
  const [pageTokens, setPageTokens] = React.useState([null]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [hasMorePages, setHasMorePages] = React.useState(true);

  const handleNextPage = async () => {
    if (hasMorePages && currentPageIndex === pageTokens.length) {
      const { data: todos, nextToken } = await client.models.Todo.list({
        nextToken: pageTokens[pageTokens.length - 1]
      });

      if (!nextToken) {
        setHasMorePages(false);
      }

      setPageTokens([...pageTokens, nextToken]);
    }

    setCurrentPageIndex(currentPageIndex + 1);
  };

  return (
    <Pagination
      currentPage={currentPageIndex}
      totalPages={pageTokens.length}
      hasMorePages={hasMorePages}
      onNext={handleNextPage}
      onPrevious={() => setCurrentPageIndex(currentPageIndex - 1)}
      onChange={(pageIndex) => setCurrentPageIndex(pageIndex)}
    />
  );
};
Limitations:

There is no API to get a total page count at this time. Note that scanning all items is a potentially expensive operation.
You cannot query by page number; you have to query by nextToken.
Fetch only the data you need with custom selection set
A business domain model may contain many models with numerous fields. However, apps typically only need subsets of the data or fields to meet the requirements of different components or screens. It is necessary to have a mechanism to retrieve subsets of models and their relationships. This mechanism would help optimize data usage for screens and components by only transferring needed data. Having this capability would improve the app's data efficiency, latency, and the end user's perceived performance.

A custom selection set allows consumers to specify, on a per-call basis, the fields the consumer wants to retrieve; this is possible for all operations that return data (CRUDL + observeQuery). The desired fields are specified in a strongly typed way (discoverable through IntelliSense) with a "dot notation".

// same way for all CRUDL: .create, .get, .update, .delete, .list, .observeQuery
const { data: blogWithSubsetOfData, errors } = await client.models.Blog.get(
  { id: blog.id },
  {
    selectionSet: ['author.email', 'posts.*'],
  }
);
TypeScript type helpers for Amplify Data
When using TypeScript, you frequently need to specify data model types for type generics.

For instance, with React's useState, you provide a type in TypeScript to ensure type-safety in your component code using the state. Use the Schema["MODEL_NAME"]["type"] pattern to get TypeScript types for the shapes of data models returned from the backend API.

import { type Schema } from '@/amplify/data/resource';

type Post = Schema['Post']['type'];

const [posts, setPosts] = useState<Post[]>([]);
You can combine the Schema["MODEL_NAME"]["type"] type with the SelectionSet helper type to describe the return type of API requests using the selectionSet parameter:

import type { SelectionSet } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';


const selectionSet = ['content', 'blog.author.*', 'comments.*'] as const;
type PostWithComments = SelectionSet<Schema['Post']['type'], typeof selectionSet>;

// ...
const [posts, setPosts] = useState<PostWithComments[]>([]);

const fetchPosts = async () => {
  const { data: postsWithComments } = await client.models.Post.list({
    selectionSet,
  });
  setPosts(postsWithComments);
}
Cancel read requests
You can cancel any query API request by calling .cancel on the query request promise that's returned by .list(...) or .get(...).

const promise = client.models.Todo.list();
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
...

// To cancel the above request
client.cancel(promise, "my message for cancellation");
You need to ensure that the promise returned from .list() or .get() has not been modified. Typically, async functions wrap the promise being returned into another promise. For example, the following will not work:

async function makeAPICall() {
  return client.models.Todo.list();
}
const promise = makeAPICall();

// The following will NOT cancel the request.
client.cancel(promise, 'my error message');
Conclusion
Congratulations! You have finished the Read application data guide. In this guide, you learned how to read your data through get and list queries.
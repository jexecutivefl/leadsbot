Customize secondary indexes
You can optimize your list queries based on "secondary indexes". For example, if you have a Customer model, you can query based on the customer's id identifier field by default but you can add a secondary index based on the accountRepresentativeId to get list customers for a given account representative.

A secondary index consists of a "hash key" and, optionally, a "sort key". Use the "hash key" to perform strict equality and the "sort key" for greater than (gt), greater than or equal to (ge), less than (lt), less than or equal to (le), equals (eq), begins with, and between operations.

amplify/data/resource.ts
export const schema = a.schema({
  Customer: a
    .model({
      name: a.string(),
      phoneNumber: a.phone(),
      accountRepresentativeId: a.id().required(),
    })
    .secondaryIndexes((index) => [index("accountRepresentativeId")])
    .authorization(allow => [allow.publicApiKey()]),
});
The example client query below allows you to query for "Customer" records based on their accountRepresentativeId:

src/App.tsx
import { type Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

const { data, errors } =
  await client.models.Customer.listCustomerByAccountRepresentativeId({
    accountRepresentativeId: "YOUR_REP_ID",
  });
Review how this works under the hood with Amazon DynamoDB
Add sort keys to secondary indexes
You can define "sort keys" to add a set of flexible filters to your query, such as "greater than" (gt), "greater than or equal to" (ge), "less than" (lt), "less than or equal to" (le), "equals" (eq), "begins with" (beginsWith), and "between" operations.

amplify/data/resource.ts
export const schema = a.schema({
  Customer: a
    .model({
      name: a.string(),
      phoneNumber: a.phone(),
      accountRepresentativeId: a.id().required(),
    })
    .secondaryIndexes((index) => [
      index("accountRepresentativeId")
        .sortKeys(["name"]),
    ])
    .authorization(allow => [allow.owner()]),
});
On the client side, you should find a new listBy... query that's named after hash key and sort keys. For example, in this case: listByAccountRepresentativeIdAndName. You can supply the filter as part of this new list query:

src/App.tsx
const { data, errors } =
  await client.models.Customer.listCustomerByAccountRepresentativeIdAndName({
    accountRepresentativeId: "YOUR_REP_ID",
    name: {
      beginsWith: "Rene",
    },
  });
Customize the query field for secondary indexes
You can also customize the auto-generated query name under client.models.<MODEL_NAME>.listBy... by setting the queryField() modifier.

amplify/data/resource.ts
const schema = a.schema({
  Customer: a
    .model({
      name: a.string(),
      phoneNumber: a.phone(),
      accountRepresentativeId: a.id().required(),
    })
    .secondaryIndexes((index) => [
      index("accountRepresentativeId")
        .queryField("listByRep"),
    ])
    .authorization(allow => [allow.owner()]),
});
In your client app code, you'll see query updated under the Data client:

src/App.tsx
const {
  data,
  errors
} = await client.models.Customer.listByRep({
  accountRepresentativeId: 'YOUR_REP_ID',
})
Customize the name of secondary indexes
To customize the underlying DynamoDB's index name, you can optionally provide the name() modifier.

amplify/data/resource.ts
const schema = a.schema({
  Customer: a
    .model({
      name: a.string(),
      phoneNumber: a.phone(),
      accountRepresentativeId: a.id().required(),
    })
    .secondaryIndexes((index) => [
      index("accountRepresentativeId")
        .name("MyCustomIndexName"),
    ])
    .authorization(allow => [allow.owner()]),
});
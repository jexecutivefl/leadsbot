User group-based data access
You can use the group authorization strategy to restrict access based on user groups. The user group authorization strategy allows restricting data access to specific user groups or groups defined dynamically on each data record.

Add authorization rules for specific user groups
When you want to restrict access to a specific set of user groups, provide the group names in the groups parameter. In the example below, only users that are part of the "Admin" user group are granted access to the Salary model.

amplify/data/resource.ts
// allow one specific group
const schema = a.schema({
  Salary: a
    .model({
      wage: a.float(),
      currency: a.string(),
    })
    .authorization(allow => [allow.group('Admin')]),
});
In your application, you can perform CRUD operations against the model using client.models.<model-name> with the userPool auth mode.

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>();

// As a signed-in user that belongs to the 'Admin' User Pool Group
const { errors, data: newSalary } = await client.models.Salary.create(
  {
    wage: 50.25,
    currency: 'USD'
  },
  {
    authMode: 'userPool',
  }
);
This can then be updated to allow access to multiple defined groups; in this example below we added access for "Leadership".

// allow multiple specific groups
const schema = a.schema({
  Salary: a
    .model({
      wage: a.float(),
      currency: a.string(),
    })
    .authorization(allow => [allow.groups(['Admin', 'Leadership'])]),
});
Add authorization rules for dynamically set user groups
With dynamic group authorization, each record contains an attribute specifying what Cognito groups should be able to access it. Use the first argument to specify which attribute in the underlying data store holds this group information. To specify that a single group should have access, use a field of type a.string(). To specify that multiple groups should have access, use a field of type a.string().array().

// Dynamic group authorization with multiple groups
const schema = a.schema({
  Post: a
    .model({
      title: a.string(),
      groups: a.string().array(),
    })
    .authorization(allow => [allow.groupsDefinedIn('groups')]),
});
// Dynamic group authorization with a single group
const schema = a.schema({
  Post: a
    .model({
      title: a.string(),
      group: a.string(),
    })
    .authorization(allow => [allow.groupDefinedIn('group')]),
});
By default, group authorization leverages Amazon Cognito user pool groups but you can also use OpenID Connect with group authorization. See OpenID Connect as an authorization provider.

Known limitations for real-time subscriptions when using dynamic group authorization:

If you authorize based on a single group per record, then subscriptions are only supported if the user is part of 5 or fewer user groups
If you authorize via an array of groups (groups: a.string().array() used in the example above),
subscriptions are only supported if the user is part of 20 or fewer groups
you can only authorize 20 or fewer user groups per record
Access user groups from the session
You can access a user's groups from their session using the Auth category:

import { fetchAuthSession } from 'aws-amplify/auth';

const session = await fetchAuthSession();
const groups = session.tokens.accessToken.payload['cognito:groups'] || [];

console.log('User groups:', groups);
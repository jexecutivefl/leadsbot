Modeling relationships
When modeling application data, you often need to establish relationships between different data models. In Amplify Data, you can create one-to-many, one-to-one, and many-to-many relationships in your Data schema. On the client-side, Amplify Data allows you to lazy or eager load of related data.

With Amplify Data Construct @aws-amplify/data-construct@1.8.4, an improvement was made to how relational field data is handled in subscriptions when different authorization rules apply to related models in a schema. The improvement redacts the values for the relational fields, displaying them as null or empty, to prevent unauthorized access to relational data.

This redaction occurs whenever it cannot be determined that the child model will be protected by the same permissions as the parent model.

Because subscriptions are tied to mutations and the selection set provided in the result of a mutation is then passed through to the subscription, relational fields in the result of mutations must be redacted.

If an authorized end-user needs access to the redacted relational fields, they should perform a query to read the relational data.

Additionally, subscriptions will inherit related authorization when relational fields are set as required. To better protect relational data, consider modifying the schema to use optional relational fields.

Types of relationships
Relationship	Code	Description	Example
one to many	a.hasMany(...) & a.belongsTo(...)	Creates a one-to-many relationship between two models.	A Team has many Members. A Member belongs to a Team.
one to one	a.hasOne(...) & a.belongsTo(...)	Creates a one-to-one relationship between two models.	A Customer has one Cart. A Cart belongs to one Customer.
many to many	Two a.hasMany(...) & a.belongsTo(...) on join tables	Create two one-to-many relationships between the related models in a join table.	A Post has many Tags. A Tag has many Posts.
Model one-to-many relationships
Create a one-to-many relationship between two models using the hasMany() and belongsTo() method. In the example below, a Team has many Members and a Member belongs to exactly one Team.

Create a reference field called teamId on the Member model. This reference field's type MUST match the type of Team's identifier. In this case, it's an auto-generated id: a.id().required() field.
Add a relationship field called team that references the teamId field. This allows you to query for the team information from the Member model.
Add a relationship field called members that references the teamId field on the Member model.
const schema = a.schema({
  Member: a.model({
    name: a.string().required(),
    // 1. Create a reference field
    teamId: a.id(),
    // 2. Create a belongsTo relationship with the reference field
    team: a.belongsTo('Team', 'teamId'),
  }),

  Team: a.model({
    mantra: a.string().required(),
    // 3. Create a hasMany relationship with the reference field
    //    from the `Member`s model.
    members: a.hasMany('Member', 'teamId'),
  }),
}).authorization((allow) => allow.publicApiKey());
Create a "Has Many" relationship between records
const { data: team } = await client.models.Team.create({
  mantra: 'Go Frontend!',
});

const { data: member } = await client.models.Member.create({
  name: "Tim",
  teamId: team.id,
});
Update a "Has Many" relationship between records
const { data: newTeam } = await client.models.Team.create({
  mantra: 'Go Fullstack',
});

await client.models.Member.update({
  id: "MY_MEMBER_ID",
  teamId: newTeam.id,
});
Delete a "Has Many" relationship between records
If your reference field is not required, then you can "delete" a one-to-many relationship by setting the relationship value to null.

await client.models.Member.update({
  id: "MY_MEMBER_ID",
  teamId: null,
});
Lazy load a "Has Many" relationship
const { data: team } = await client.models.Team.get({ id: "MY_TEAM_ID"});

const { data: members } = await team.members();

members.forEach(member => console.log(member.id));
Eagerly load a "Has Many" relationship
const { data: teamWithMembers } = await client.models.Team.get(
  { id: "MY_TEAM_ID" },
  { selectionSet: ["id", "members.*"] },
);

teamWithMembers.members.forEach(member => console.log(member.id));
Handling orphaned foreign keys on parent record deletion in "Has Many" relationship
// Get the IDs of the related members.
const { data: teamWithMembers } = await client.models.Team.get(
  { id: teamId },
  { selectionSet: ["id", "members.*"] },
);

// Delete Team
await client.models.Team.delete({ id: teamWithMembers.id });

// Delete all members in parallel
await Promise.all(
  teamWithMembers.members.map(member => 
  client.models.Member.delete({ id: member.id }) 
));
Model a "one-to-one" relationship
Create a one-to-one relationship between two models using the hasOne() and belongsTo() methods. In the example below, a Customer has a Cart and a Cart belongs to a Customer.

Create a reference field called customerId on the Cart model. This reference field's type MUST match the type of Customer's identifier. In this case, it's an auto-generated id: a.id().required() field.
Add a relationship field called customer that references the customerId field. This allows you to query for the customer information from the Cart model.
Add a relationship field called activeCart that references the customerId field on the Cart model.
const schema = a.schema({
  Cart: a.model({
    items: a.string().required().array(),
    // 1. Create reference field
    customerId: a.id(),
    // 2. Create relationship field with the reference field
    customer: a.belongsTo('Customer', 'customerId'),
  }),
  Customer: a.model({
    name: a.string(),
    // 3. Create relationship field with the reference field
    //    from the Cart model
    activeCart: a.hasOne('Cart', 'customerId')
  }),
}).authorization((allow) => allow.publicApiKey());
Create a "Has One" relationship between records
To create a "has one" relationship between records, first create the parent item and then create the child item and assign the parent.

const { data: customer, errors } = await client.models.Customer.create({
  name: "Rene",
});


const { data: cart } = await client.models.Cart.create({
  items: ["Tomato", "Ice", "Mint"],
  customerId: customer?.id,
});
Update a "Has One" relationship between records
To update a "Has One" relationship between records, you first retrieve the child item and then update the reference to the parent to another parent. For example, to reassign a Cart to another Customer:

const { data: newCustomer } = await client.models.Customer.create({
  name: 'Ian',
});

await client.models.Cart.update({
  id: cart.id,
  customerId: newCustomer?.id,
});
Delete a "Has One" relationship between records
You can set the relationship field to null to delete a "Has One" relationship between records.

await client.models.Cart.update({
  id: project.id,
  customerId: null,
});
Lazy load a "Has One" relationship
const { data: cart } = await client.models.Cart.get({ id: "MY_CART_ID"});
const { data: customer } = await cart.customer();
Eagerly load a "Has One" relationship
const { data: cart } = await client.models.Cart.get(
  { id: "MY_CART_ID" },
  { selectionSet: ['id', 'customer.*'] },
);

console.log(cart.customer.id)
Handling orphaned foreign keys on parent record deletion in "Has One" relationship
// Get the customer with their associated cart
const { data: customerWithCart } = await client.models.Customer.get(
  { id: customerId },
  { selectionSet: ["id", "activeCart.*"] },
);

// Delete Cart if exists
await client.models.Cart.delete({ id: customerWithCart.activeCart.id });

// Delete the customer
await client.models.Customer.delete({ id: customerWithCart.id });
Model a "many-to-many" relationship
In order to create a many-to-many relationship between two models, you have to create a model that serves as a "join table". This "join table" should contain two one-to-many relationships between the two related entities. For example, to model a Post that has many Tags and a Tag has many Posts, you'll need to create a new PostTag model that represents the relationship between these two entities.

const schema = a.schema({
  PostTag: a.model({
    // 1. Create reference fields to both ends of
    //    the many-to-many relationship
    postId: a.id().required(),
    tagId: a.id().required(),
    // 2. Create relationship fields to both ends of
    //    the many-to-many relationship using their
    //    respective reference fields
    post: a.belongsTo('Post', 'postId'),
    tag: a.belongsTo('Tag', 'tagId'),
  }),
  Post: a.model({
    title: a.string(),
    content: a.string(),
    // 3. Add relationship field to the join model
    //    with the reference of `postId`
    tags: a.hasMany('PostTag', 'postId'),
  }),
  Tag: a.model({
    name: a.string(),
    // 4. Add relationship field to the join model
    //    with the reference of `tagId`
    posts: a.hasMany('PostTag', 'tagId'),
  }),
}).authorization((allow) => allow.publicApiKey());
Model multiple relationships between two models
Relationships are defined uniquely by their reference fields. For example, a Post can have separate relationships with a Person model for author and editor.

const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    content: a.string().required(),
    authorId: a.id(),
    author: a.belongsTo('Person', 'authorId'),
    editorId: a.id(),
    editor: a.belongsTo('Person', 'editorId'),
  }),
  Person: a.model({
    name: a.string(),
    editedPosts: a.hasMany('Post', 'editorId'),
    authoredPosts: a.hasMany('Post', 'authorId'),
  }),
}).authorization((allow) => allow.publicApiKey());
On the client-side, you can fetch the related data with the following code:

const client = generateClient<Schema>();

const { data: post } = await client.models.Post.get({ id: "SOME_POST_ID" });

const { data: author } = await post?.author();
const { data: editor } = await post?.editor();
Model relationships for models with sort keys in their identifier
In cases where your data model uses sort keys in the identifier, you need to also add reference fields and store the sort key fields in the related data model:

const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    content: a.string().required(),
    // Reference fields must correspond to identifier fields.
    authorName: a.string(),
    authorDoB: a.date(),
    // Must pass references in the same order as identifiers.
    author: a.belongsTo('Person', ['authorName', 'authorDoB']),
  }),
  Person: a.model({
    name: a.string().required(),
    dateOfBirth: a.date().required(),
    // Must reference all reference fields corresponding to the
    // identifier of this model.
    authoredPosts: a.hasMany('Post', ['authorName', 'authorDoB']),
  }).identifier(['name', 'dateOfBirth']),
}).authorization((allow) => allow.publicApiKey());
Make relationships required or optional
Amplify Data's relationships use reference fields to determine if a relationship is required or not. If you mark a reference field as required, then you can't "delete" a relationship between two models. You'd have to delete the related record as a whole.

const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    content: a.string().required(),
    // You must supply an author when creating the post
    // Author can't be set to `null`.
    authorId: a.id().required(),
    author: a.belongsTo('Person', 'authorId'),
    // You can optionally supply an editor when creating the post.
    // Editor can also be set to `null`.
    editorId: a.id(),
    editor: a.belongsTo('Person', 'editorId'),
  }),
  Person: a.model({
    name: a.string(),
    editedPosts: a.hasMany('Post', 'editorId'),
    authoredPosts: a.hasMany('Post', 'authorId'),
  }),
}).authorization((allow) => allow.publicApiKey());
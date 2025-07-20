Concepts
Amplify helps you secure your application while providing an easy sign-in experience for your users. This experience is influenced by your security strategy. This security strategy includes the authentication method, security credentials, and enabling additional verification when needed.

Authentication is a process to validate who you are (abbreviated as AuthN). The system that does this validation is referred to as an Identity Provider or IdP. This can be your own self-hosted IdP or a cloud service. Oftentimes, this IdP is an external provider such as Apple, Facebook, Google, or Amazon.
Authorization is the process of validating what you can access (abbreviated as AuthZ). This is sometimes done by looking at tokens with custom logic, predefined rules, or signed requests with policies.
Common authentication methods and associated risks include:

External provider federation which enables easier access for your users but shares data with third parties.
You can improve security credentials and verification for these authentication methods by:

Modifying the default password policy to ensure your users create stronger passwords.
Requiring additional contact information from users before they can reset passwords.
Enabling multi-factor authentication (MFA) which adds a layer of security at sign-in but may also add friction for your users.
What is Amazon Cognito?
Amplify Auth is powered by Amazon Cognito. Amazon Cognito is an identity and access management service, enabling you to secure your web or mobile applications, and is comprised of two services:

Amazon Cognito User Pools is a full-featured user directory service to handle user registration, authentication, and account recovery
Amazon Cognito Federated Identities or Identity Pools is a service used to authorize your users to interact with other AWS services
Amplify interfaces with User Pools to store your user information, including federation with other OpenID providers like Apple, Facebook, Google, or Amazon, and leverages federated identities to manage user access to AWS resources.

Authorization is often done in one of two ways:

Clients pass the tokens to the backend that perform custom logic to allow or deny actions
Clients sign the requests and the backend validates the signature, allowing or denying actions depending on predefined policy. The predefined rules, known as IAM access policies, are automatically configured by Amplify.
The first is a common authorization method for HTTP or GraphQL APIs, while the second is necessary for interfacing with AWS services such as Amazon S3, Amazon Pinpoint, and others.

Before you build
Amazon Cognito can be customized based on your security strategy for authentication. However, some initial configuration options cannot be changed after the backend resources are configured:

User attributes that are used to identify your individual users (such as email and phone) cannot be renamed or deleted.
Sign-in methods (including username, email, and phone) cannot be added or changed after the initial configuration. This includes both defining which attributes are used to sign in and which attributes are required. Required attributes must have a value for all users once set.
Verification methods (including username and email) are the same as required attributes and cannot be removed once configured.
The sub attribute is a unique identifier within each user pool that cannot be modified and can be used to index and search users.
If MFA is set to required with phone number for all users, you will need to include MFA setup (i.e. mandating phone number) when users sign up.
Visit the Amazon Cognito documentation for more details on these settings, including User pool attributes and Adding MFA to a user pool.

Usernames
Learn more about what Amplify Auth provisions and supports
Email
Learn more about what Amplify Auth provisions and supports
Phone
Learn more about what Amplify Auth provisions and supports
Passwordless
Learn how to configure passwordless sign-in flows
User attributes
Learn more about what Amplify Auth provisions and supports
User groups
Learn more about what Amplify Auth provisions and supports
Multi-factor authentication
Learn more about what Amplify Auth provisions and supports
External identity providers
Learn more about what Amplify Auth provisions and supports
Guest access
Access services without needing to sign in.
Tokens and credentials
Learn about how tokens and credentials are used in Amplify applications
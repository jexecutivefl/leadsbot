Configure AWS for local development
Note: If you already have an AWS account and profile configured locally, you do not need to follow this guide. Please add theAmplifyBackendDeployFullAccess IAM role to your configured AWS profile.

This guide will help you set up Temporary credentials with IAM Identity Center and AWS Organizations, which will enable you to define Single-sign on (SSO), users, groups, permission sets, and more for your team. AWS Organizations can grow to house multiple AWS accounts. Users within the organization can traverse the AWS account(s) as their permission set allows.

Amplify leverages the standard local credentials chain provider to simplify access to AWS services. While this guide highlights IAM Identity Center, you can explore additional methods for authenticating with AWS locally.

IAM Identity Center terminology
Set up Identity Center
Follow the steps below if you have never set up AWS profiles before.


If you already have a profile, attach the AmplifyBackendDeployFullAccess managed policy to your IAM user.

1. Create user with Amplify permissions
Sign in to the AWS Console to access IAM Identity Center page and choose Enable.



A dialog will open, prompting you to "Choose how to configure IAM Identity Center in your AWS environment." Select Enable with AWS Organizations and choose Continue.



Next, we are going to automate a number of steps that simulate the operations of setting up a user in the IAM Identity Center console. To get started open CloudShell, located in the console footer.

Paste the following command in the CloudShell terminal and enter an email address you would like to associate with this AWS account:

CloudShell
read -p "Enter email address: " user_email # hit enter
Enter email address: <your-email-address>
Now, run the following command

CloudShell
response=$(aws sso-admin list-instances)
ssoId=$(echo $response | jq '.Instances[0].IdentityStoreId' -r)
ssoArn=$(echo $response | jq '.Instances[0].InstanceArn' -r)
email_json=$(jq -n --arg email "$user_email" '{"Type":"Work","Value":$email}')
response=$(aws identitystore create-user --identity-store-id $ssoId --user-name amplify-admin --display-name 'Amplify Admin' --name Formatted=string,FamilyName=Admin,GivenName=Amplify --emails "$email_json")
userId=$(echo $response | jq '.UserId' -r)
response=$(aws sso-admin create-permission-set --name amplify-policy --instance-arn=$ssoArn --session-duration PT12H)
permissionSetArn=$(echo $response | jq '.PermissionSet.PermissionSetArn' -r)
aws sso-admin attach-managed-policy-to-permission-set --instance-arn $ssoArn --permission-set-arn $permissionSetArn --managed-policy-arn arn:aws:iam::aws:policy/service-role/AmplifyBackendDeployFullAccess
accountId=$(aws sts get-caller-identity | jq '.Account' -r)
aws sso-admin create-account-assignment --instance-arn $ssoArn --target-id $accountId --target-type AWS_ACCOUNT --permission-set-arn $permissionSetArn --principal-type USER --principal-id $userId
# Hit enter
To validate that this worked, run the following command in the CloudShell. If something failed in this process, please report an issue. Keep this information readily available for the next step.

CloudShell
printf "\n\nStart session url: https://$ssoId.awsapps.com/start\nRegion: $AWS_REGION\nUsername: amplify-admin\n\n"

# you should see
Start session url: https://d-XXXXXXXXXX.awsapps.com/start
Region: us-east-1
Username: amplify-admin
A step-by-step walkthrough in the console
Prefer a manual set up?
2. Create password for user
Now create a password for the user that we need for the next step. In the IdC console, navigate to Users > amplify_admin > Reset password > Send an email to the user with instructions for resetting the password.

Check your email (make sure you also check your spam folder). Click on the Reset password link and choose a password of your choice. When signing in make sure to use amplify-admin as the Username.



Finish local setup
Now, set up an AWS profile that is linked to the user you just created on your local machine. There are a few options for getting IAM Identity Center user credentials, but we will use the AWS CLI configuration wizard.

3. Install the AWS CLI
Install the AWS CLI.

Mac
Windows
Linux
In your browser, download the macOS pkg file:

Install on Mac

4. Set up local AWS profile
Open your terminal, you are ready to configure an AWS profile that uses the SSO user. Use the information from CloudShell to populate the information below.

Terminal
aws configure sso

| SSO session name (Recommended): amplify-admin
| SSO start URL: <START SESSION URL>
| SSO region: <your-region>
| SSO registration scopes [sso:account:access]: <leave blank>
| Attempting to automatically open the SSO authorization page in your default browser.
| If the browser does not open or you wish to use a different device to authorize this request, open the following URL:
|
| https://device.sso.us-east-2.amazonaws.com/
|
| Then enter the code:
|
| SOME-CODE

## browser opens
After you provide this information, the browser will automatically open asking you to sign in with the username and password you just created and configure a multi-factor device to authenticate.

Now return to the terminal and enter the following information:

Terminal
The only AWS account available to you is: <your-aws-account-id>
Using the account ID <your-aws-account-id>
The only role available to you is: amplify-policy
Using the role name "amplify-policy"
CLI default client Region [us-east-1]: <your-region>
CLI default output format [None]:
Make sure to set the profile name to default. Alternatively, remember the auto-generated profile name; you will need this later.

Terminal
CLI profile name [amplify-policy-<your-aws-account-id>]: default
To use this profile, specify the profile name using --profile, as shown:

aws s3 ls --profile default
If you inspect ~/.aws/config, you should now see the SSO profile:

~/.aws/config
[profile default]
sso_session = amplify-admin
sso_account_id = <your-aws-account-id>
sso_role_name = AdministratorAccess
region = <your-region>
[sso-session amplify-admin]
sso_start_url = https://xxxxxx.awsapps.com/start#
sso_region = <your-region>
sso_registration_scopes = sso:account:access
5. Bootstrap your AWS account
Now you are ready to use this AWS profile with AWS Amplify. Open your Amplify project and start the sandbox. If you have multiple local profiles or named your profile something other than default, you can specify a profile with --profile.

Terminal
npx ampx sandbox

# OR

npx ampx sandbox --profile <profile-name>
Before you can start deploying resources in the cloud sandbox environment, Amplify will need to complete a one-time bootstrap setup for the account and AWS Region before it can start deploying resources.

Learn more
What is bootstrapping?
Terminal
npx ampx sandbox --profile amplify-admin
The region us-east-1 has not been bootstrapped. Sign in to the AWS console as a Root user or Admin to complete the bootstrap process, then restart the sandbox.
If this is not the region you are expecting to bootstrap, check for any AWS environment variables that may be set in your shell or use --profile <profile-name> to specify a profile with the correct region.
During the first-time setup, npx ampx sandbox will ask you to sign in to the AWS Management Console. You must sign in as the account root user or as a user that has AdministratorAccess permissions. Once signed in, you will be redirected to the Amplify console. On the Create new app page, choose Initialize setup now. It may take a few minutes for the bootstrapping process to complete.



Success
You have successfully completed the bootstrapping process and you can now return to the terminal to create a new Amplify sandbox environment:

npx ampx sandbox --profile <value>
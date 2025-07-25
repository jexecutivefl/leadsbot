Listen to storage events
Function triggers can be configured to enable event-based workflows when files are uploaded or deleted. To add a function trigger, modify the defineStorage configuration.

First, in your storage definition, add the following:

amplify/storage/resource.ts
export const storage = defineStorage({
  name: 'myProjectFiles',
  triggers: {
    onUpload: defineFunction({
      entry: './on-upload-handler.ts'
    }),
    onDelete: defineFunction({
      entry: './on-delete-handler.ts'
    })
  }
});
Then create the function definitions at amplify/storage/on-upload-handler.ts and amplify/storage/on-delete-handler.ts.

amplify/storage/on-upload-handler.ts
import type { S3Handler } from 'aws-lambda';

export const handler: S3Handler = async (event) => {
  const objectKeys = event.Records.map((record) => record.s3.object.key);
  console.log(`Upload handler invoked for objects [${objectKeys.join(', ')}]`);
};
amplify/storage/on-delete-handler.ts
import type { S3Handler } from 'aws-lambda';

export const handler: S3Handler = async (event) => {
  const objectKeys = event.Records.map((record) => record.s3.object.key);
  console.log(`Delete handler invoked for objects [${objectKeys.join(', ')}]`);
};
Note: The S3Handler type comes from the @types/aws-lambda npm package. This package contains types for different kinds of Lambda handlers, events, and responses.

Now, when you deploy your backend, these functions will be invoked whenever an object is uploaded or deleted from the bucket.

More Advanced Triggers
The example listed above demonstrates what is exposed directly in your storage definition. Specifically, the use of the triggers option when you use defineStorage. This method is for simple triggers that always execute on file uploads or file deletions. There are no additional modifications you can make to the triggers defined in this way.

If you want the ability to do something more than simply handle the events onUpload and onDelete you will have to use .addEventNotification in your backend.ts. If you use this method, the triggers section in your storage/resource.ts file should be removed.

Here is an example of how you can add a Lambda trigger for an S3 object PUT event. This trigger will execute when a file that has been uploaded to the bucket defined in your storage/resource.ts has a matching prefix and suffix as that listed in the function input of addEventNotification.

amplify/backend.ts
import { EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { defineBackend } from '@aws-amplify/backend';
import { storage } from './storage/resource';
import { yourLambda } from './functions/yourLambda/resource';

const backend = defineBackend({
  storage,
  yourLambda,
});

backend.storage.resources.bucket.addEventNotification(
	EventType.OBJECT_CREATED_PUT,
	new LambdaDestination(backend.yourLambda.resources.lambda),
	{
		prefix: 'protected/uploads/',
		suffix: '-uploadManifest.json',
	}
);
It's important to note that using this methodology does not require any changes your lambda function. This modification on your backend.ts file will create a new AWS CloudFormation handler for "Custom::S3BucketNotifications" resources (@aws-cdk/aws-s3) that specifically handles checking the prefix and suffix.
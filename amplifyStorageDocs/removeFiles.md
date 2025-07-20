Remove files
Files can be removed from a storage bucket using the remove API. If a file is protected by an identity Id, only the user who owns the file will be able to remove it.

You can also perform a remove operation from a specific bucket by providing the target bucket's assigned name from Amplify Backend in bucket option.

import { remove } from 'aws-amplify/storage';

try {
  await remove({ 
    path: 'album/2024/1.jpg',
    // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
    bucket: 'assignedNameInAmplifyBackend', // Specify a target bucket using name assigned in Amplify Backend
  });
} catch (error) {
  console.log('Error ', error);
}
Alternatively, you can also pass in an object by specifying the bucket name and region from the console.

import { remove } from 'aws-amplify/storage';

try {
  await remove({ 
    path: 'album/2024/1.jpg',
    // Alternatively, provide bucket name from console and associated region
    bucket: {
      bucketName: 'bucket-name-from-console',
      region: 'us-east-2'
    }

  });
} catch (error) {
  console.log('Error ', error);
}
More remove options
Option	Type	Default	Description
bucket	string |
{ bucketName: string;
region: string; }	Default bucket and region from Amplify configuration	A string representing the target bucket's assigned name in Amplify Backend or an object specifying the bucket name and region from the console.

Read more at Configure additional storage buckets
expectedBucketOwner	string	Optional	The account ID that owns requested bucket.
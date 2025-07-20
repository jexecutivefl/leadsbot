Copy files
Note: You can only copy files up to 5GB in a single operation

You can copy an existing file to a different path within the storage bucket using the copy API.

The copy method duplicates an existing file to a designated path and returns an object {path: 'destPath'} upon successful completion.

import { copy } from 'aws-amplify/storage';

const copyFile = async () => {
  try {
    const response = await copy({
      source: {
        path: `album/2024/${encodeURIComponent('#1.jpg')}`,
        // Alternatively, path: ({identityId}) => `album/${identityId}/${encodeURIComponent('#1.jpg')`
      },
      destination: {
        path: 'shared/2024/#1.jpg',
        // Alternatively, path: ({identityId}) => `shared/${identityId}/#1.jpg`
      },
    });
  } catch (error) {
    console.error('Error', err);
  }
};
The operation can fail if there's a special character in the source path. You should URI encode the source path with special character. You don't need to encode the destination path.

Cross identity ID copying is only allowed if the destination path has the the right access rules to allow other authenticated users writing to it.

Specify a bucket or copy across buckets / regions
You can also perform an copy operation to a specific bucket by providing the bucket option. This option can either be a string representing the target bucket's assigned name in Amplify Backend or an object specifying the bucket name and region from the console.

import { copy } from 'aws-amplify/storage';

const copyFile = async () => {
  try {
    const response = await copy({
      source: {
        path: 'album/2024/1.jpg',
        // Specify a target bucket using name assigned in Amplify Backend
        // or bucket name from console and associated region
        bucket: 'assignedNameInAmplifyBackend',
        expectedBucketOwner: '123456789012'
      },
      destination: {
        path: 'shared/2024/1.jpg',
        // Specify a target bucket using name assigned in Amplify Backend
        // or bucket name from console and associated region
        bucket: {
          bucketName: 'generated-second-bucket-name',
          region: 'us-east-2'
        },
        expectedBucketOwner: '123456789013'
      }
    });
  } catch (error) {
    console.error('Error', error);
  }
};
In order to copy to or from a bucket other than your default, both source and destination must have bucket explicitly defined.

Copy source and destination options
Option	Type	Default	Description
path	string |
({ identityId }) => string	Required	A string or callback that represents the path in source and destination bucket to copy the object to or from.
Each segment of the path in source must by URI encoded.
bucket	string |
{ bucketName: string;
region: string; }	Default bucket and region from Amplify configuration	A string representing the target bucket's assigned name in Amplify Backend or an object specifying the bucket name and region from the console.

Read more at Configure additional storage buckets.
eTag	string	Optional	The copy source object entity tag (ETag) value. Only Copies the object if its ETag matches the specified tag.
notModifiedSince	Date	Optional	Copies the source object if it hasn't been modified since the specified time.

This is evaluated only when eTag is NOT supplied
expectedBucketOwner	string	Optional	source.expectedBucketOwner: The account ID that owns the source bucket.

destination.expectedBucketOwner: The account ID that owns the destination bucket.
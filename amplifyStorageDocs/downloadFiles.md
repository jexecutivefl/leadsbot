Download files
Storage Image React UI Component
You can easily display images in your app by using the cloud-connected Storage Image React UI component. This component fetches images securely from your storage resource and displays it on the web page.

Terminal
npm add @aws-amplify/ui-react-storage aws-amplify
import { StorageImage } from '@aws-amplify/ui-react-storage';

export const DefaultStorageImageExample = () => {
  return <StorageImage alt="cat" path="your-path/cat.jpg" />;
};
Learn more about how you can further customize the UI component by referring to the Storage Image documentation.

To further customize your in-app experience, you can use the getUrl or downloadData API from the Amplify Library for Storage.

Note: Refer to the Transfer Acceleration documentation to learn how to enable transfer acceleration for storage APIs.

Get or download file from a URL
With the getUrl API, you can get a presigned URL which is valid for 900 seconds or 15 minutes by default. You can use this URL to create a download link for users to click on. The expiresAt property is a Date object that represents the time at which the URL will expire.

import { getUrl } from 'aws-amplify/storage';

const linkToStorageFile = await getUrl({
  path: "album/2024/1.jpg",
  // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
});
console.log('signed URL: ', linkToStorageFile.url);
console.log('URL expires at: ', linkToStorageFile.expiresAt);
Inside your template or JSX code, you can use the url property to create a link to the file:

<a href={linkToStorageFile.url.toString()} target="_blank" rel="noreferrer">
  {fileName} 
</a>
This function does not check if the file exists by default. As result, the signed URL may fail if the file to be downloaded does not exist.

More getUrl options
The behavior of the getUrl API can be customized by passing in options.

import { getUrl } from 'aws-amplify/storage';

const linkToStorageFile = await getUrl({
  path: "album/2024/1.jpg",
  options: {
    // specify a target bucket using name assigned in Amplify Backend
    bucket: 'assignedNameInAmplifyBackend',
    // ensure object exists before getting url
    validateObjectExistence: true, 
    // url expiration time in seconds.
    expiresIn: 300,
    // whether to use accelerate endpoint
    useAccelerateEndpoint: true,
    // The account ID that owns the requested bucket.
    expectedBucketOwner: '123456789012',
  }
});
Option	Type	Default	Description
bucket	string |
{ bucketName: string;
region: string; }	Default bucket and region from Amplify configuration	A string representing the target bucket's assigned name in Amplify Backend or an object specifying the bucket name and region from the console.

Read more at Configure additional storage buckets
validateObjectExistence	boolean	false	Whether to head object to make sure the object existence before downloading.
expiresIn	number	900	Number of seconds till the URL expires.

The expiration time of the presigned url is dependent on the session and will max out at 1 hour.
useAccelerateEndpoint	boolean	false	Whether to use accelerate endpoint.

Read more at Transfer Acceleration
expectedBucketOwner	string	Optional	The account ID that owns requested bucket.
Download to a file
Use the downloadData API to download the file locally.

import { downloadData } from 'aws-amplify/storage';

// Downloads file content to memory
const { body, eTag } = await downloadData({
  path: "album/2024/1.jpg"
}).result;
Get the text value of downloaded File
You can get the value of file in any of the three formats: blob, json, or text. You can call the respective method on the body property to consume the set data in the respective format.

import { downloadData } from 'aws-amplify/storage';

try {
  const downloadResult = await downloadData({
    path: "album/2024/1.jpg"
  }).result;
  const text = await downloadResult.body.text();
  // Alternatively, you can use `downloadResult.body.blob()`
  // or `downloadResult.body.json()` get read body in Blob or JSON format.
  console.log('Succeed: ', text);
} catch (error) {
  console.log('Error : ', error);
}
Download from a specified bucket
You can also perform an upload operation to a specific bucket by providing the bucket option. You can pass in a string representing the target bucket's assigned name in Amplify Backend.

import { downloadData } from 'aws-amplify/storage';

const result = await downloadData({
  path: 'album/2024/1.jpg',
  options: {
    // Specify a target bucket using name assigned in Amplify Backend
    bucket: 'assignedNameInAmplifyBackend'
  }
}).result;
Alternatively, you can also pass in an object by specifying the bucket name and region from the console.

import { downloadData } from 'aws-amplify/storage';

const result = await downloadData({
  path: 'album/2024/1.jpg',
  options: {
    // Alternatively, provide bucket name from console and associated region
    bucket: {
      bucketName: 'bucket-name-from-console',
      region: 'us-east-2'
    }
  }
}).result;
Monitor download progress
import { downloadData } from 'aws-amplify/storage';

// Download a file from S3 bucket
const { body, eTag } = await downloadData(
  {
    path: 'album/2024/1.jpg',
    options: {
      onProgress: (progress) => {
        console.log(`Download progress: ${(progress.transferredBytes/progress.totalBytes) * 100}%`);
      }
    }
  }
).result;
Cancel download
import { downloadData, isCancelError } from 'aws-amplify/storage';

const downloadTask = downloadData({ path: 'album/2024/1.jpg' });
downloadTask.cancel();
try {
  await downloadTask.result;
} catch (error) {
  if (isCancelError(error)) {
    // Handle error thrown by task cancellation.
  }
}
More download options
The behavior of the downloadData API can be customized by passing in options.

import { downloadData } from 'aws-amplify/storage';

// Downloads file content to memory
const { body, eTag } = await downloadData({
  path: "album/2024/1.jpg",
  options: {
    // optional bytes range parameter to download a part of the file, the 2nd MB of the file in this example
    bytesRange: {
      start: 1024,
      end: 2048
    },
    useAccelerateEndpoint: true,
  }
}).result;
Option	Type	Default	Description
bucket	string |
{ bucketName: string;
region: string; }	Default bucket and region from Amplify configuration	A string representing the target bucket's assigned name in Amplify Backend or an object specifying the bucket name and region from the console.

Read more at Configure additional storage buckets
onProgress	callback	—	Callback function tracking the upload/download progress.
bytesRange	{ start: number; end:number; }	—	Bytes range parameter to download a part of the file.
useAccelerateEndpoint	boolean	false	Whether to use accelerate endpoint.

Read more at Transfer Acceleration
expectedBucketOwner	string	Optional	The account ID that owns requested bucket.
Frequently Asked Questions
Image compression or CloudFront CDN caching for your S3 buckets is not yet possible.
downloadData does not provide a cache control option and it replies on runtime HTTP caching behavior. If you need to bypass the cache, you can use the getUrl API to create a presigned URL for downloading the file.
downloadData does not support S3 object versioning, it always downloads the latest version.
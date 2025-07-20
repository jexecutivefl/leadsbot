Upload files
You can implement upload functionality in your app by either using the File Uploader UI component or further customizing the upload experience using the upload API.

File Uploader React UI Component
Upload files from your app in minutes by using the cloud-connected File Uploader UI Component.

Terminal
npm add @aws-amplify/ui-react-storage aws-amplify
Then, use the component in your app.

import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

export const DefaultFileUploaderExample = () => {
  return (
    <FileUploader
      acceptedFileTypes={['image/*']}
      path="public/"
      maxFileCount={1}
      isResumable
    />
  );
};
Showing File Uploader UI component

Learn more about how you can further customize the UI component by referring to the File Uploader documentation.

Implement upload functionality
Note: Refer to the Transfer Acceleration documentation to learn how to enable transfer acceleration for storage APIs.

Upload from file
The following is an example of how you would upload a file from a file object, this could be retrieved from the local machine or a different source.

import React from 'react';
import { uploadData } from 'aws-amplify/storage';

function App() {
  const [file, setFile] = React.useState();

  const handleChange = (event) => {
    setFile(event.target.files?.[0]);
  };

  const handleClick = () => {
    if (!file) {
      return;
    }
    uploadData({
      path: `photos/${file.name}`,
      data: file,
    });
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleClick}>Upload</button>
    </div>
  );
}
Upload from data
You can follow this example if you have data saved in memory and would like to upload this data to the cloud.

import { uploadData } from 'aws-amplify/storage';

try {
  const result = await uploadData({
    path: "album/2024/1.jpg",
    // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
    data: file,
  }).result;
  console.log('Succeeded: ', result);
} catch (error) {
  console.log('Error : ', error);
}
Upload to a specified bucket
You can also perform an upload operation to a specific bucket by providing the bucket option. You can pass in a string representing the target bucket's assigned name in Amplify Backend.

import { uploadData } from 'aws-amplify/storage';

const result = await uploadData({
  path: 'album/2024/1.jpg',
  data: file,
  options: {
    // Specify a target bucket using name assigned in Amplify Backend
    bucket: 'assignedNameInAmplifyBackend'
  }
}).result;
Alternatively, you can also pass in an object by specifying the bucket name and region from the console.

import { uploadData } from 'aws-amplify/storage';

const result = await uploadData({
  path: 'album/2024/1.jpg',
  data: file,
  options: {
    // Alternatively, provide bucket name from console and associated region
    bucket: {
      bucketName: 'bucket-name-from-console',
      region: 'us-east-2'
    }
  }
}).result;
Monitor upload progress
Monitor progress of upload by using the onProgress option.

import { uploadData } from 'aws-amplify/storage';

const monitorUpload = async () => {
  try {
    const result = await uploadData({
      path: "album/2024/1.jpg",
      // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
      data: file,
      options: {
        onProgress: ({ transferredBytes, totalBytes }) => {
          if (totalBytes) {
            console.log(
              `Upload progress ${Math.round(
                (transferredBytes / totalBytes) * 100
              )} %`
            );
          }
        },
      },
    }).result;
    console.log("Path from Response: ", result.path);
  } catch (error) {
    console.log("Error : ", error);
  }
}
Pause, resume, and cancel uploads
We have callback functions that support resuming, pausing, and cancelling uploadData requests.

import { uploadData, isCancelError } from 'aws-amplify/storage';

// Pause, resume, and cancel a task
const uploadTask = uploadData({ path, data: file });
//...
uploadTask.pause();
//...
uploadTask.resume();
//...
uploadTask.cancel();
//...
try {
  await uploadTask.result;
} catch (error) {
  if (isCancelError(error)) {
    // Handle error thrown by task cancellation
  }
}
Transfer with Object Metadata
Custom metadata can be associated with your uploaded object by passing the metadata option.

import { uploadData } from 'aws-amplify/storage';

const result = await uploadData({
  path: 'album/2024/1.jpg',
  data: file,
  options: {
    metadata: {
      customKey: 'customValue',
    },
  },
});
More upload options
The behavior of uploadData and properties of the uploaded object can be customized by passing in additional options.

import { uploadData } from 'aws-amplify/storage';

const result = await uploadData({
  path: 'album/2024/1.jpg',
  data: file,
  options: {
    // content-type header to be used when downloading
    contentType: "image/jpeg",
    // configure how object is presented
    contentDisposition: "attachment",
    // whether to use accelerate endpoint
    useAccelerateEndpoint: true,
    // the account ID that owns requested bucket
    expectedBucketOwner: "123456789012",
    // whether to check if an object with the same key already exists before completing the upload
    preventOverwrite: true,
    // whether to compute the checksum for the data to be uploaded, so the S3 can verify the data integrity
    checksumAlgorithm: "crc-32", // only 'crc-32' is supported currently
  },
});
Option	Type	Default	Description
bucket	string |
{ bucketName: string;
region: string; }	Default bucket and region from Amplify configuration	A string representing the target bucket's assigned name in Amplify Backend or an object specifying the bucket name and region from the console.

Read more at Configure additional storage buckets
contentType	string	application/octet-stream	The default content-type header value of the file when downloading it.

Read more at Content-Type documentation
contentEncoding	string	—	The default content-encoding header value of the file when downloading it.

Read more at Content-Encoding documentation
contentDisposition	string	—	Specifies presentational information for the object.

Read more at Content-Disposition documentation
metadata	map<string>	—	A map of metadata to store with the object in S3.

Read more at S3 metadata documentation
useAccelerateEndpoint	boolean	false	Whether to use accelerate endpoint.

Read more at Transfer Acceleration
expectedBucketOwner	string	-	The account ID that owns requested bucket.
preventOverwrite	boolean	false	Whether to check if an object with the same key already exists before completing the upload. If exists, a Precondition Failed error will be thrown
checksumAlgorithm	"crc-32"	-	Whether to compute the checksum for the data to be uploaded, so the S3 can verify the data integrity. Only 'crc-32' is supported currently
Uploads that were initiated over one hour ago will be cancelled automatically. There are instances (e.g. device went offline, user logs out) where the incomplete file remains in your Amazon S3 account. It is recommended to setup a S3 lifecycle rule to automatically cleanup incomplete upload requests.

MultiPart upload
Amplify will automatically perform an Amazon S3 multipart upload for objects that are larger than 5MB. For more information about S3's multipart upload, see Uploading and copying objects using multipart upload
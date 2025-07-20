Set up Storage
In this guide, you will learn how to set up storage in your Amplify app. You will set up your backend resources, and enable listing, uploading, and downloading files.

If you have not yet created an Amplify app, visit the quickstart guide.

Amplify Storage seamlessly integrates file storage and management capabilities into frontend web and mobile apps, built on top of Amazon Simple Storage Service (Amazon S3). It provides intuitive APIs and UI components for core file operations, enabling developers to build scalable and secure file storage solutions without dealing with cloud service complexities.

Building your storage backend
First, create a file amplify/storage/resource.ts. This file will be the location where you configure your storage backend. Instantiate storage using the defineStorage function and providing a name for your storage bucket. This name is a friendly name to identify your bucket in your backend configuration. Amplify will generate a unique identifier for your app using a UUID, the name attribute is just for use in your app.

amplify/storage/resource.ts
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'amplifyTeamDrive'
});
Import your storage definition in your amplify/backend.ts file that contains your backend definition. Add storage to defineBackend.

amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { storage } from './storage/resource';

defineBackend({
  auth,
  storage
});
Now when you run npx ampx sandbox or deploy your app on Amplify, it will configure an Amazon S3 bucket where your files will be stored. Before files can be accessed in your application, you must configure storage access rules.

To deploy these changes, commit them to git and push the changes upstream. Amplify's CI/CD system will automatically pick up the changes and build and deploy the updates.

Terminal
git commit -am "add storage backend"
git push
Define File Path Access
By default, no users or other project resources have access to any files in the storage bucket. Access must be explicitly granted within defineStorage using the access callback.

The access callback returns an object where each key in the object is a file path and each value in the object is an array of access rules that apply to that path.

The following example shows you how you can set up your file storage structure for a generic photo sharing app. Here,

Guests have access to see all profile pictures and only the users that uploaded the profile picture can replace or delete them. Users are identified by their Identity Pool ID in this case i.e. identityID.
There's also a general pool where all users can submit pictures.
Learn more about customizing access to file path.

amplify/storage/resource.ts
export const storage = defineStorage({
  name: 'amplifyTeamDrive',
  access: (allow) => ({
    'profile-pictures/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'picture-submissions/*': [
      allow.authenticated.to(['read','write']),
      allow.guest.to(['read', 'write'])
    ],
  })
});
Configure additional storage buckets
Amplify Storage gives you the flexibility to configure your backend to automatically provision and manage multiple storage resources.

You can define additional storage buckets by using the same defineStorage function and providing a unique, descriptive name to identify the storage bucket. You can pass this name to the storage APIs to specify the bucket you want to perform the action to. Ensure that this name attribute is unique across the defined storage buckets in order to reliably identify the correct bucket and prevent conflicts.

It's important to note that if additional storage buckets are defined one of them must be marked as default with the isDefault flag.

amplify/storage/resource.ts
export const firstBucket = defineStorage({
  name: 'firstBucket',
  isDefault: true, // identify your default storage bucket (required)
});

export const secondBucket = defineStorage({
  name: 'secondBucket',
  access: (allow) => ({
    'private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
})
Add additional storage resources to the backend definition.

amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { firstBucket, secondBucket } from './storage/resource';

defineBackend({
  auth,
  firstBucket,
  secondBucket
});
Storage bucket client usage
Additional storage buckets can be referenced from application code by passing the bucket option to Amplify Storage APIs. You can provide a target bucket's name assigned in Amplify Backend.

import { downloadData } from 'aws-amplify/storage';

try {
  const result = downloadData({
    path: "album/2024/1.jpg",
    options: {
      // Specify a target bucket using name assigned in Amplify Backend
      bucket: "secondBucket"
    }
  }).result;
} catch (error) {
  console.log(`Error: ${error}`)
}
Alternatively, you can also pass in an object by specifying the bucket name and region from the console. See each Amplify Storage API page for additional usage examples.

import { downloadData } from 'aws-amplify/storage';

try {
  const result = downloadData({
    path: 'album/2024/1.jpg',
    options: {
      // Alternatively, provide bucket name from console and associated region
      bucket: {
        bucketName: 'second-bucket-name-from-console',
        region: 'us-east-2'
      }
    }
  }).result;
} catch (error) {
  console.log(`Error: ${error}`);
}
Connect your app code to the storage backend
The Amplify Storage library provides client APIs that connect to the backend resources you defined.

Configure Amplify in project
Import and load the configuration file in your app. It's recommended you add the Amplify configuration step to your app's root entry point. For example index.js in React or main.ts in Angular.

import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
Make sure you call Amplify.configure as early as possible in your application’s life-cycle. A missing configuration or NoCredentials error is thrown if Amplify.configure has not been called before other Amplify JavaScript APIs.

Upload your first file
Next, let's a photo to the picture-submissions/ path.

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
      path: `picture-submissions/${file.name}`,
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
Manage files in Amplify console
After successfully publishing your storage backend and connecting your project with client APIs, you can manage files and folders in the Amplify console. You can perform on-demand actions like upload, download, copy, and more under the Storage tab in the console. Refer to Manage files in Amplify Console guide for additional information.

Conclusion
Congratulations! You finished the Set up Amplify Storage guide. In this guide, you set up and connected to backend resources, customized your file paths and access definitions, and connected your application to the backend to implement features like file uploads and downloads.
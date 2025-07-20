Working with files/attachments
The Storage and GraphQL API categories can be used together to associate a file, such as an image or video, with a particular record. For example, you might create a User model with a profile picture, or a Post model with an associated image. With Amplify's GraphQL API and Storage categories, you can reference the file within the model itself to create an association.

Set up the project
Set up your project by following the instructions in the Quickstart guide.

Define the model
Open amplify/data/resource.ts and add the following model as shown below:

amplify/data/resource.ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Song: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      coverArtPath: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",

    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
Setup the Storage
Next, Let's configure Storage and allow access to all authenticated(signed in) users of your application. create a file amplify/storage/resource.ts and add the following code,This will restrict file access to only the signed-in user.

amplify/storage/resource.ts
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "amplify-gen2-files",
  access: (allow) => ({
    "images/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});
Configure the storage in the amplify/backend.ts file as demonstrated below:

amplify/backend.ts
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

export const backend = defineBackend({
  auth,
  data,
  storage,
});
Configuring authorization
Your application needs authorization credentials for reading and writing to both Storage and the Data, except in the case where all data and files are intended to be publicly accessible.

The Storage and Data categories govern data access based on their own authorization patterns, meaning that it's necessary to configure appropriate auth roles for each individual category. Although both categories share the same access credentials set up through the Auth category, they work independently from one another. For instance, adding an allow.authenticated() to the Data does not guard against file access in the Storage category. Likewise, adding authorization rules to the Storage category does not guard against data access in the API.

When you configure Storage, Amplify will configure appropriate IAM policies on the bucket using a Cognito Identity Pool role. You will then have the option of adding CRUD (Create, Update, Read and Delete) based permissions as well, so that Authenticated and Guest users will be granted limited permissions within these levels. Even after adding this configuration, all Storage access is still guest by default. To guard against accidental public access, the Storage access levels must either be configured on the Storage object globally, or set within individual function calls. This guide uses the former approach, setting all Storage access to authenticated users.

The ability to independently configure authorization rules for each category allows for more granular control over data access, and adds greater flexibility. For scenarios where authorization patterns must be mixed and matched, configure the access level on individual Storage function calls. For example, you may want to use entity_id CRUD access on an individual Storage function call for files that should only be accessible by the owner (such as personal files), authenticated read access to allow all logged in users to view common files (such as images in a shared photo album), and guest read access to allow all users to view a file (such as a public profile picture).

For more details on how to configure Storage authorization levels, see the Storage documentation. For more on configuring Data authorization, see the API documentation.

Create a record with an associated file
You can create a record via the Amplify Data client, upload a file to Storage, and finally update the record to associate it with the uploaded file. Use the following example with the Amplify Data client and Amplify Storage library helpers, uploadData and getUrl, to create a record and associate it the file with the record.

The API record's id is prepended to the Storage file name to ensure uniqueness. If this is excluded, multiple API records could then be associated with the same file path unintentionally.

src/App.tsx
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Create the API record:
const response = await client.models.Song.create({
  name: `My first song`,
});

const song = response.data;

if (!song) return;

// Upload the Storage file:
const result = await uploadData({
  path: `images/${song.id}-${file.name}`,
  data: file,
  options: {
    contentType: "image/png", // contentType is optional
  },
}).result;

// Add the file association to the record:
const updateResponse = await client.models.Song.update({
  id: song.id,
  coverArtPath: result?.path,
});

const updatedSong = updateResponse.data;

setCurrentSong(updatedSong);

// If the record has no associated file, we can return early.
if (!updatedSong.coverArtPath) return;

// Retrieve the file's signed URL:
const signedURL = await getUrl({ path: updatedSong.coverArtPath });
Add or update a file for an associated record
To associate a file with a record, update the record with the path returned by the Storage upload. The following example uploads the file using Storage, updates the record with the file's path, then retrieves the signed URL to download the image. If an image is already associated with the record, this will update the record with the new image.

src/App.tsx
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Upload the Storage file:
const result = await uploadData({
  path: `images/${currentSong.id}-${file.name}`,
  data: file,
  options: {
    contentType: "image/png", // contentType is optional
  },
}).result;

// Add the file association to the record:
const response = await client.models.Song.update({
  id: currentSong.id,
  coverArtPath: result?.path,
});

const updatedSong = response.data;

setCurrentSong(updatedSong);

// If the record has no associated file, we can return early.
if (!updatedSong?.coverArtPath) return;

// Retrieve the file's signed URL:
const signedURL = await getUrl({ path: updatedSong.coverArtPath });
Query a record and retrieve the associated file
To retrieve the file associated with a record, first query the record, then use Storage to get the signed URL. The signed URL can then be used to download the file, display an image, etc:

src/App.tsx
import { generateClient } from "aws-amplify/api";
import { getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.Song.get({
  id: currentSong.id,
});

const song = response.data;

// If the record has no associated file, we can return early.
if (!song?.coverArtPath) return;

// Retrieve the signed URL:
const signedURL = await getUrl({ path: song.coverArtPath });
Delete and remove files associated with API records
There are three common deletion workflows when working with Storage files and the GraphQL API:

Remove the file association, continue to persist both file and record.
Remove the record association and delete the file.
Delete both file and record.
Remove the file association, continue to persist both file and record
The following example removes the file association from the record, but does not delete the file from S3, nor the record from the database.

src/App.tsx
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.Song.get({
  id: currentSong.id,
});

const song = response.data;

// If the record has no associated file, we can return early.
if (!song?.coverArtPath) return;

const updatedSong = await client.models.Song.update({
  id: song.id,
  coverArtPath: null,
});
Remove the record association and delete the file
The following example removes the file from the record, then deletes the file from S3:

src/App.tsx
import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});
const response = await client.models.Song.get({
  id: currentSong.id,
});
const song = response?.data;

// If the record has no associated file, we can return early.
if (!song?.coverArtPath) return;

// Remove associated file from record
const updatedSong = await client.models.Song.update({
  id: song.id,
  coverArtPath: null,
});

// Delete the file from S3:
await remove({ path: song.coverArtPath });
Delete both file and record
src/App.tsx
import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});
const response = await client.models.Song.get({
  id: currentSong.id,
});

const song = response.data;

// If the record has no associated file, we can return early.
if (!song?.coverArtPath) return;

await remove({ path: song.coverArtPath });

// Delete the record from the API:
await client.models.Song.delete({ id: song.id });
Working with multiple files
You may want to add multiple files to a single record, such as a user profile with multiple images. To do this, you can add a list of file keys to the record. The following example adds a list of file keys to a record:

GraphQL schema to associate a data model with multiple files
Add the following model in `amplify/data/resource.ts" file.

amplify/data/resource.ts
const schema = a.schema({
  PhotoAlbum: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      imagePaths: a.string().array(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});
CRUD operations when working with multiple files is the same as when working with a single file, with the exception that we are now working with a list of image keys, as opposed to a single image key.

Create a record with multiple associated files
First create a record via the GraphQL API, then upload the files to Storage, and finally add the associations between the record and files.

src/App.tsx
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Create the API record:
const response = await client.models.PhotoAlbum.create({
  name: `My first photoAlbum`,
});

const photoAlbum = response.data.createPhotoAlbum;

if (!photoAlbum) return;

// Upload all files to Storage:
const imagePaths = await Promise.all(
  Array.from(e.target.files).map(async (file) => {
    const result = await uploadData({
      path: `images/${photoAlbum.id}-${file.name}`,
      data: file,
      options: {
        contentType: "image/png", // contentType is optional
      },
    }).result;

    return result.path;
  })
);

const updatePhotoAlbumDetails = {
  id: photoAlbum.id,
  imagePaths: imagePaths,
};

// Add the file association to the record:
const updateResponse = await client.graphql({
  query: mutations.updatePhotoAlbum,
  variables: { input: updatePhotoAlbumDetails },
});

const updatedPhotoAlbum = updateResponse.data.updatePhotoAlbum;

// If the record has no associated file, we can return early.
if (!updatedPhotoAlbum.imageKeys?.length) return;

// Retrieve signed urls for all files:
const signedUrls = await Promise.all(
  updatedPhotoAlbum?.imagePaths.map(
    async (path) => await getUrl({ path: path! })
  )
);
Add new files to an associated record
To associate additional files with a record, update the record with the paths returned by the Storage uploads.

src/App.tsx
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Upload all files to Storage:
const newimagePaths = await Promise.all(
  Array.from(e.target.files).map(async (file) => {
    const result = await uploadData({
      path: `images/${currentPhotoAlbum.id}-${file.name}`,
      data: file,
      options: {
        contentType: "image/png", // contentType is optional
      },
    }).result;

    return result.path;
  })
);

// Query existing record to retrieve currently associated files:
const queriedResponse = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = queriedResponse.data;

if (!photoAlbum?.imagePaths) return;

// Merge existing and new file paths:
const updatedimagePaths = [...newimagePaths, ...photoAlbum.imagePaths];

// Update record with merged file associations:
const response = await client.models.PhotoAlbum.update({
  id: currentPhotoAlbum.id,
  imagePaths: updatedimagePaths,
});

const updatedPhotoAlbum = response.data;

// If the record has no associated file, we can return early.
if (!updatedPhotoAlbum?.imageKeys) return;

// Retrieve signed urls for merged image paths:
const signedUrls = await Promise.all(
  updatedPhotoAlbum?.imagePaths.map(
    async (path) => await getUrl({ path: path! })
  )
);
Update the file for an associated record
Updating a file for an associated record is the same as updating a file for a single file record, with the exception that you will need to update the list of file keys.

src/App.tsx
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Upload new file to Storage:
const result = await uploadData({
  path: `images/${currentPhotoAlbum.id}-${file.name}`,
  data: file,
  options: {
    contentType: "image/png", // contentType is optional
  },
}).result;

const newFilePath = result.path;

// Query existing record to retrieve currently associated files:
const queriedResponse = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = queriedResponse.data;

if (!photoAlbum?.imagePaths?.length) return;

// Retrieve last image path:
const [lastImagePath] = photoAlbum.imagePaths.slice(-1);

// Remove last file association by path
const updatedimagePaths = [
  ...photoAlbum.imagePaths.filter((path) => path !== lastImagePath),
  newFilePath,
];

// Update record with updated file associations:
const response = await client.models.PhotoAlbum.update({
  id: currentPhotoAlbum.id,
  imagePaths: updatedimagePaths,
});

const updatedPhotoAlbum = response.data;

// If the record has no associated file, we can return early.
if (!updatedPhotoAlbum?.imagePaths) return;

// Retrieve signed urls for merged image paths:
const signedUrls = await Promise.all(
  updatedPhotoAlbum?.imagePaths.map(
    async (path) => await getUrl({ path: path! })
  )
);
Query a record and retrieve the associated files
To retrieve the files associated with a record, first query the record, then use Storage to retrieve all of the signed URLs.

src/App.tsx
async function getImagesForPhotoAlbum() {
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Query the record to get the file paths:
const response = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = response.data;

// If the record has no associated files, we can return early.
if (!photoAlbum?.imagePaths) return;

// Retrieve the signed URLs for the associated images:
const signedUrls = await Promise.all(
  photoAlbum.imagePaths.map(async (imagePath) => {
    if (!imagePath) return;
    return await getUrl({ path: imagePath });
  })
);
}
Delete and remove files associated with API records
The workflow for deleting and removing files associated with API records is the same as when working with a single file, except that when performing a delete you will need to iterate over the list of file paths and call Storage.remove() for each file.

Remove the file association, continue to persist both files and record
src/App.tsx
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = response.data;

// If the record has no associated file, we can return early.
if (!photoAlbum?.imagePaths) return;

const updatedPhotoAlbum = await client.models.PhotoAlbum.update({
  id: photoAlbum.id,
  imagePaths: null,
});
Remove the record association and delete the files
src/App.tsx
import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = response.data;

// If the record has no associated files, we can return early.
if (!photoAlbum?.imagePaths) return;

// Remove associated files from record
const updateResponse = await client.models.PhotoAlbum.update({
  id: photoAlbum.id,
  imagePaths: null, // Set the file association to `null`
});

const updatedPhotoAlbum = updateResponse.data;

// Delete the files from S3:
await Promise.all(
  photoAlbum?.imagePaths.map(async (imagePath) => {
    if (!imagePath) return;
    await remove({ path: imagePath });
  })
);
Delete record and all associated files
src/App.tsx
import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = response.data;

if (!photoAlbum) return;

await client.models.PhotoAlbum.delete({
  id: photoAlbum.id,
});

setCurrentPhotoAlbum(null);

// If the record has no associated file, we can return early.
if (!photoAlbum?.imagePaths) return;

await Promise.all(
  photoAlbum?.imagePaths.map(async (imagePath) => {
    if (!imagePath) return;
    await remove({ path: imagePath });
  })
);
Data consistency when working with records and files
The recommended access patterns in these docs attempt to remove deleted files, but favor leaving orphans over leaving records that point to non-existent files. This optimizes for read latency by ensuring clients rarely attempt to fetch a non-existent file from Storage. However, any app that deletes files can inherently cause records on-device to point to non-existent files.

One example is when we create an API record, associate the Storage file with that record, and then retrieve the file's signed URL. "Device A" calls the GraphQL API to create API_Record_1, and then associates that record with First_Photo. Before "Device A" is about to retrieve the signed URL, "Device B" might query API_Record_1, delete First_Photo, and update the record accordingly. However, "Device A" is still using the old API_Record_1, which is now out-of-date. Even though the shared global state is correctly in sync at every stage, the individual device ("Device A") has an out-of-date record that points to a non-existent file. Similar issues can conceivably occur for updates. Depending on your app, some of these mismatches can be minimized even more with real-time data / GraphQL subscriptions.

It is important to understand when these mismatches can occur and to add meaningful error handling around these cases. This guide does not include exhaustive error handling, real-time subscriptions, re-querying of outdated records, or attempts to retry failed operations. However, these are all important considerations for a production-level application.

Complete examples
Single File (TS)
Multi-File (TS)
src/App.tsx
import "./App.css";
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl, remove } from "aws-amplify/storage";
import React, { useState } from "react";
import type { Schema } from "../amplify/data/resource";
import "@aws-amplify/ui-react/styles.css";
import {
  type WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

type Song = Schema["Song"]["type"];

function App({ signOut, user }: WithAuthenticatorProps) {

  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // Used to display image for current song:
  const [currentImageUrl, setCurrentImageUrl] = useState<
    string | null | undefined
    >("");

  async function createSongWithImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    try {

      // Create the API record:
      const response = await client.models.Song.create({
        name: `My first song`,
      });

      const song = response.data;

      if (!song) return;

      // Upload the Storage file:
      const result = await uploadData({
        path: `images/${song.id}-${file.name}`,
        data: file,
        options: {
          contentType: "image/png", // contentType is optional
        },
      }).result;

      // Add the file association to the record:
      const updateResponse = await client.models.Song.update({
        id: song.id,
        coverArtPath: result?.path,
      });

      const updatedSong = updateResponse.data;
      setCurrentSong(updatedSong);

      // If the record has no associated file, we can return early.
      if (!updatedSong?.coverArtPath) return;

      // Retrieve the file's signed URL:
      const signedURL = await getUrl({ path: updatedSong.coverArtPath });

      setCurrentImageUrl(signedURL.url.toString());
    } catch (error) {
      console.error("Error create song / file:", error);
    }
  }

  // Upload image, add to song, retrieve signed URL and retrieve the image.
  // Also updates image if one already exists.
  async function addNewImageToSong(e: React.ChangeEvent<HTMLInputElement>) {

    if (!currentSong) return;

    if (!e.target.files) return;

    const file = e.target.files[0];

    try {
      // Upload the Storage file:
      const result = await uploadData({
        path: `images/${currentSong.id}-${file.name}`,
        data: file,
        options: {
          contentType: "image/png", // contentType is optional
        },
      }).result;

      // Add the file association to the record:
      const response = await client.models.Song.update({
        id: currentSong.id,
        coverArtPath: result?.path,
      });

      const updatedSong = response.data;

      setCurrentSong(updatedSong);

      // If the record has no associated file, we can return early.
      if (!updatedSong?.coverArtPath) return;

      // Retrieve the file's signed URL:
      const signedURL = await getUrl({ path: updatedSong.coverArtPath });
      setCurrentImageUrl(signedURL.url.toString());

    } catch (error) {
      console.error("Error uploading image / adding image to song: ", error);
    }
  }

  async function getImageForCurrentSong() {
    if (!currentSong) return;

    try {
      // Query the record to get the file path:
      const response = await client.models.Song.get({
        id: currentSong.id,
      });

      const song = response.data;

      // If the record has no associated file, we can return early.
      if (!song?.coverArtPath) return;

      // Retrieve the signed URL:
      const signedURL = await getUrl({ path: song.coverArtPath });
      setCurrentImageUrl(signedURL.url.toString());
    } catch (error) {
      console.error("Error getting song / image:", error);
    }
  }

  // Remove the file association, continue to persist both file and record
  async function removeImageFromSong() {

    if (!currentSong) return;

    try {
      const response = await client.models.Song.get({
        id: currentSong.id,
      });

      const song = response.data;

      // If the record has no associated file, we can return early.
      if (!song?.coverArtPath) return;

      const updatedSong = await client.models.Song.update({
        id: song.id,
        coverArtPath: null,
      });

      // If successful, the response here will be `null`:
      setCurrentSong(updatedSong.data);

      setCurrentImageUrl(updatedSong.data?.coverArtPath);

    } catch (error) {
      console.error("Error removing image from song: ", error);
    }
  }

  // Remove the record association and delete the file
  async function deleteImageForCurrentSong() {

    if (!currentSong) return;

    try {
      const response = await client.models.Song.get({
        id: currentSong.id,
      });

      const song = response?.data;

      // If the record has no associated file, we can return early.
      if (!song?.coverArtPath) return;

      // Remove associated file from record
      const updatedSong = await client.models.Song.update({
        id: song.id,
        coverArtPath: null,
      });

      // Delete the file from S3:
      await remove({ path: song.coverArtPath });

      // If successful, the response here will be `null`:
      setCurrentSong(updatedSong.data);

      setCurrentImageUrl(updatedSong.data?.coverArtPath);

    } catch (error) {
      console.error("Error deleting image: ", error);
    }
  }

  // Delete both file and record
  async function deleteCurrentSongAndImage() {

    if (!currentSong) return;
    try {
      const response = await client.models.Song.get({
        id: currentSong.id,
      });
      const song = response.data;

      // If the record has no associated file, we can return early.
      if (!song?.coverArtPath) return;

      await remove({ path: song.coverArtPath });

      // Delete the record from the API:
      await client.models.Song.delete({ id: song.id });

      clearLocalState();

    } catch (error) {
      console.error("Error deleting song: ", error);
    }
  }

  function clearLocalState() {
    setCurrentSong(null);
    setCurrentImageUrl("");
  }

  return (
    <>
      <h1>Hello {user?.username}</h1>
      <button onClick={signOut}>Sign out</button>
      <div>
        <label>
          <h2>{`Current Song: ${currentSong?.id}`}</h2>
          Create song with file:
          <input id="name" type="file" onChange={createSongWithImage} />
        </label>
        <label>
          Add / update song image:
          <input
            id="name"
            type="file"
            onChange={addNewImageToSong}
            disabled={!currentSong}
          />
        </label>
        <button
          onClick={getImageForCurrentSong}
          disabled={!currentSong || !currentImageUrl}
        >
          Get image for current song
        </button>
        <button
          onClick={removeImageFromSong}
          disabled={!currentSong || !currentImageUrl}
        >
          Remove image from current song (does not delete image)
        </button>
        <button
          onClick={deleteImageForCurrentSong}
          disabled={!currentSong || !currentImageUrl}
        >
          Remove image from current song, then delete image
        </button>
        <button onClick={deleteCurrentSongAndImage} disabled={!currentSong}>
          Delete current song (and image, if it exists)
        </button>
        <button onClick={signOut} className="app-button">
          Sign out
        </button>
      </div>
    </>
  );
}

export default withAuthenticator(App);
List file properties
You can list files without having to download all the files. You can do this by using the list API from the Amplify Library for Storage. You can also get properties individually for a file using the getProperties API.

List Files
import { list } from 'aws-amplify/storage';

const result = await list({
	path: 'album/photos/',
  // Alternatively, path: ({identityId}) => `album/${identityId}/photos/`
});
Note the trailing slash / - if you had requested list({ path : 'album/photos' }) it would also match against files like album/photos123.jpg alongside album/photos/123.jpg.

The format of the response will look similar to the below example:

{
  items: [
    {
      path: "album/photos/123.jpg",
      eTag: "30074401292215403a42b0739f3b5262",
      lastModified: "Thu Oct 08 2020 23:59:31 GMT+0800 (Singapore Standard Time)",
      size: 138256
    },
    // ...
  ],
}
If the pageSize is set lower than the total file size, a single list call only returns a subset of all the files. To list all the files with multiple calls, users can use the nextToken flag:

import { list } from 'aws-amplify/storage';

const PAGE_SIZE = 20;
let nextToken;
// ...
const loadNextPage = async () => {
  const response = await list({
    path: 'photos/',
    // Alternatively, path: ({ identityId }) => `album/${identityId}/photos/`
    options: {
      pageSize: PAGE_SIZE,
      nextToken,
    },
  });
  if (response.nextToken) {
    nextToken = response.nextToken;
  } else {
    nextToken = undefined;
  }
  // render list items from response.items
};
List All files
import { list } from 'aws-amplify/storage';

const result = await list({
	path: 'album/photos/',
  // Alternatively, path: ({identityId}) => `album/${identityId}/photos/`,
  options: {
    listAll: true,
  }
});
Manually created folders will show up as files with a size of 0, but you can also match keys against a regex like file.key.match(/\.[0-9a-z]+$/i) to distinguish files from folders. Since "folders" are a virtual concept in Amazon S3, any file may declare any depth of folder just by having a / in its name.

To access the contents and subpaths of a "folder", you have two options:

Request the entire path and parse the contents.
Use the subpathStrategy option to retrieve only the files within the specified path (i.e. exclude files under subpaths).
Get all nested files within a path
This retrieves all files and folders under a given path. You may need to parse the result to get only the files within the specified path.

function processStorageList(response) {
  let files = [];
  let folders = new Set();
  response.items.forEach((res) => {
    if (res.size) {
      files.push(res);
      // sometimes files declare a folder with a / within then
      let possibleFolder = res.path.split('/').slice(0, -1).join('/');
      if (possibleFolder) folders.add(possibleFolder);
    } else {
      folders.add(res.path);
    }
  });
  return { files, folders };
}
If you need the files and folders in terms of a nested object instead (for example, to build an explorer UI), you could parse it recursively:

function processStorageList(response) {
  const filesystem = {};
  // https://stackoverflow.com/questions/44759750/how-can-i-create-a-nested-object-representation-of-a-folder-structure
  const add = (source, target, item) => {
    const elements = source.split('/');
    const element = elements.shift();
    if (!element) return; // blank
    target[element] = target[element] || { __data: item }; // element;
    if (elements.length) {
      target[element] =
        typeof target[element] === 'object' ? target[element] : {};
      add(elements.join('/'), target[element], item);
    }
  };
  response.items.forEach((item) => add(item.path, filesystem, item));
  return filesystem;
}
This places each item's data inside a special __data key.

Excluding subpaths
In addition to using the list API to get all the contents of a path, you can also use it to get only the files within a path while excluding files under subpaths.

For example, given the following keys in your path you may want to return only the jpg object, and not the "vacation" subpath and its contents:

photos/photo1.jpg
photos/vacation/
This can be accomplished with the subpathStrategy option:

src/main.ts
import { list } from "aws-amplify/storage";
const result = await list({ 
  path: "photos/",
  options:{
    subpathStrategy: { strategy:'exclude' }
  }
});
The response will include only the objects within the photos/ path and will also communicate any excluded subpaths:

{
    excludedSubpaths: [
      'photos/vacation/'
    ],
    items: [
      {
        path: "photos/photo1.jpg",
        eTag: "30074401292215403a42b0739f3b5262",
        lastModified: "Thu Oct 08 2020 23:59:31 GMT+0800 (Singapore Standard Time)",
        size: 138256
      },
    ]
}
The default delimiter character is '/', but this can be changed by supplying a custom delimiter:

src/main.ts
const result = await list({
  // Path uses '-' character to organize files rather than '/'
  path: 'photos-',
  options: {
    subpathStrategy: {
      strategy: 'exclude',
      delimiter: '-'
    }
  }
});
List files from a specified bucket
You can also perform an copy operation to a specific bucket by providing the bucket option. This option can either be a string representing the target bucket's assigned name in Amplify Backend or an object specifying the bucket name and region from the console.

import { list } from 'aws-amplify/storage';

const result = await list({
  path: 'photos/',
  options: {
    // Specify a target bucket using name assigned in Amplify Backend
    bucket: 'assignedNameInAmplifyBackend',
    // Alternatively, provide bucket name from console and associated region
    // bucket: {
    //   bucketName: 'generated-secondary-bucket-name',
    //   region: 'us-east-2'
    // }
  }
});
More list options
Option	Type	Default	Description
bucket	string |
{ bucketName: string;
region: string; }	Default bucket and region from Amplify configuration	A string representing the target bucket's assigned name in Amplify Backend or an object specifying the bucket name and region from the console.

Read more at Configure additional storage buckets
listAll	boolean	false	Set to true to list all files within the specified path
pageSize	number	1000	Sets the maximum number of files to be return. The range is 0 - 1000
nextToken	string	—	Indicates whether the list is being continued on this bucket with a token
subpathStrategy	{ strategy: 'include' } |
{ 'exclude',
delimiter?: string }	{ strategy: 'include' }	An object representing the subpath inclusion strategy and the delimiter used to group results for exclusion.

Read more at Excluding subpaths
useAccelerateEndpoint	boolean	false	Whether to use accelerate endpoint.

Read more at Transfer Acceleration
expectedBucketOwner	string	Optional	The account ID that owns requested bucket.
Get File Properties
You can also view the properties of an individual file.

import { getProperties } from 'aws-amplify/storage';

try {
  const result = await getProperties({
    path: 'album/2024/1.jpg',
    // Alternatively, path: ({ identityId }) => `album/${identityId}/1.jpg`
    options: {
      // Specify a target bucket using name assigned in Amplify Backend
      bucket: 'assignedNameInAmplifyBackend'
    }
  });
  console.log('File Properties ', result);
} catch (error) {
  console.log('Error ', error);
}
The properties and metadata will look similar to the below example

{
  path: "album/2024/1.jpg",
  contentType: "image/jpeg",
  contentLength: 6873,
  eTag: "\"56b32cf4779ff6ca3ba3f2d455fa56a7\"",
  lastModified: Wed Apr 19 2023 14:20:55 GMT-0700 (Pacific Daylight Time) {},
  metadata: { owner: 'aws' }
}
More getProperties options
Option	Type	Default	Description
bucket	string |
{ bucketName: string;
region: string; }	Default bucket and region from Amplify configuration	A string representing the target bucket's assigned name in Amplify Backend or an object specifying the bucket name and region from the console.

Read more at Configure additional storage buckets
useAccelerateEndpoint	boolean	false	Whether to use accelerate endpoint.
To get the metadata in result for all APIs you have to configure user defined metadata in CORS.

Learn more about how to setup an appropriate CORS Policy.
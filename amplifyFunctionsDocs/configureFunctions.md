Configure Functions
defineFunction comes out-of-the-box with sensible but minimal defaults. The following options are provided to tweak the function configuration.

Note: The following options are not supported for Custom Functions except for resourceGroupName.

name
By default, functions are named based on the directory the defineFunction call is placed in. In the above example, defining the function in amplify/functions/my-demo-function/resource.ts will cause the function to be named my-demo-function by default.

If an entry is specified, then the name defaults to the basename of the entry path. For example, an entry of ./signup-trigger-handler.ts would cause the function name to default to signup-trigger-handler.

This optional property can be used to explicitly set the name of the function.

amplify/functions/my-demo-function/resource.ts
export const myDemoFunction = defineFunction({
  entry: './demo-function-handler.ts',
  name: 'overrideName' // explicitly set the name to override the default naming behavior
});
timeoutSeconds
By default, functions will time out after 3 seconds. This can be configured to any whole number of seconds up to 15 minutes.

amplify/functions/my-demo-function/resource.ts
export const myDemoFunction = defineFunction({
  timeoutSeconds: 60 // 1 minute timeout
});
memoryMB
By default, functions have 512 MB of memory allocated to them. This can be configured from 128 MB up to 10240 MB. Note that this can increase the cost of function invocation. For more pricing information see here.

amplify/functions/my-demo-function/resource.ts
export const myDemoFunction = defineFunction({
  memoryMB: 256 // allocate 256 MB of memory to the function.
});
ephemeralStorageSizeMB
By default, functions have 512MB of ephemeral storage to them. This can be configured from 512 MB upto 10240 MB. Note that this can increase the cost of function invocation. For more pricing information visit the Lambda pricing documentation.

amplify/functions/my-demo-function/resource.ts
export const myDemoFunction = defineFunction({
  ephemeralStorageSizeMB: 1024 // allocate 1024 MB of ephemeral storage to the function.
});
runtime
Currently, only Node runtimes are supported by defineFunction. However, you can change the Node version that is used by the function. The default is the oldest Node LTS version that is supported by AWS Lambda (currently Node 18).

If you wish to use an older version of Node, keep an eye on the Lambda Node version deprecation schedule. As Lambda removes support for old Node versions, you will have to update to newer supported versions.

amplify/functions/my-demo-function/resource.ts
export const myDemoFunction = defineFunction({
  runtime: 20 // use Node 20
});
entry
By default, Amplify will look for your function handler in a file called handler.ts in the same directory as the file where defineFunction is called. To point to a different handler location, specify an entry value.

amplify/functions/my-demo-function/resource.ts
export const myDemoFunction = defineFunction({
  entry: './path/to/handler.ts' // this path should either be absolute or relative to the current file
});
resourceGroupName
By default, functions are grouped together in a resource group named function. You can override this to group related function with other Amplify resources like auth, data, storage, or separate them into your own custom group. This is typically useful when you have resources that depend on each other and you want to group them together.

amplify/functions/my-demo-function/resource.ts
export const myDemoFunction = defineFunction({
  resourceGroupName: 'data'
});
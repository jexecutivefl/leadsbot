Streaming logs
Amplify enables you to stream logs from your AWS Lambda functions directly to your terminal while running ampx sandbox. To get started, specify the --stream-function-logs option when starting sandbox:

Terminal
npx ampx sandbox --stream-function-logs
Note: this feature is only available for Sandbox

Streaming function logs directly to your terminal enable faster debug iterations, and greater insight into your functions' executions.

Filtering
By default, Amplify will stream all of your functions' logs. If you wish to only stream a subset of functions you can specify a filter by function name or a regular expression for function names. For example, if you have a collection of Auth triggers where the function names include "auth".

When working with more than 5 functions, we recommend using the --logs-filter flag to filter the log output to specific functions.

Terminal
npx ampx sandbox --stream-function-logs --logs-filter auth
After you successfully deploy your personal cloud sandbox, start your frontend application, and sign up for the first time, you will see logs from your triggers' executions printed to the terminal where sandbox is running.

Terminal
> npx ampx sandbox --stream-function-logs --logs-filter auth
...

✨  Total time: 158.44s

[Sandbox] Watching for file changes...
File written: amplify_outputs.json
[auth-pre-sign-up] 3:36:34 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-pre-sign-up] 3:36:34 PM START RequestId: 685be2bd-5df1-4dd5-9eb1-24f5f6337f91 Version: $LATEST
[auth-pre-sign-up] 3:36:34 PM END RequestId: 685be2bd-5df1-4dd5-9eb1-24f5f6337f91
[auth-pre-sign-up] 3:36:34 PM REPORT RequestId: 685be2bd-5df1-4dd5-9eb1-24f5f6337f91	Duration: 4.12 ms	Billed Duration: 5 ms	Memory Size: 512 MB	Max Memory Used: 67 MB	Init Duration: 173.67 ms
[auth-post-confirmation] 3:38:40 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-post-confirmation] 3:38:40 PM START RequestId: fce69b9f-b257-4af8-8a6e-821f84a39ce7 Version: $LATEST
[auth-post-confirmation] 3:38:41 PM 2024-07-19T22:38:41.209Z	fce69b9f-b257-4af8-8a6e-821f84a39ce7	INFO	processed 412f8911-acfa-41c7-9605-fa0c40891ea9
[auth-post-confirmation] 3:38:41 PM END RequestId: fce69b9f-b257-4af8-8a6e-821f84a39ce7
[auth-post-confirmation] 3:38:41 PM REPORT RequestId: fce69b9f-b257-4af8-8a6e-821f84a39ce7	Duration: 264.38 ms	Billed Duration: 265 ms	Memory Size: 512 MB	Max Memory Used: 93 MB	Init Duration: 562.19 ms
[auth-pre-authentication] 3:38:41 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-pre-authentication] 3:38:41 PM START RequestId: 9210ca3a-1351-4826-8544-123684765710 Version: $LATEST
[auth-pre-authentication] 3:38:41 PM END RequestId: 9210ca3a-1351-4826-8544-123684765710
[auth-pre-authentication] 3:38:41 PM REPORT RequestId: 9210ca3a-1351-4826-8544-123684765710	Duration: 3.47 ms	Billed Duration: 4 ms	Memory Size: 512 MB	Max Memory Used: 67 MB	Init Duration: 180.24 ms
[auth-post-authentication] 3:38:42 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-post-authentication] 3:38:42 PM START RequestId: 60c1d680-ea24-4a8b-93de-02d085859140 Version: $LATEST
[auth-post-authentication] 3:38:42 PM END RequestId: 60c1d680-ea24-4a8b-93de-02d085859140
[auth-post-authentication] 3:38:42 PM REPORT RequestId: 60c1d680-ea24-4a8b-93de-02d085859140	Duration: 4.61 ms	Billed Duration: 5 ms	Memory Size: 512 MB	Max Memory Used: 68 MB	Init Duration: 172.66 ms
Writing to a file
By default, Amplify will print logs to the terminal where sandbox is running, however you can alternatively write logs to a file by specifying --logs-out-file:

Terminal
npx ampx sandbox --stream-function-logs --logs-out-file sandbox.log
This can be combined with --logs-filter to create a log file of just your Auth-related functions, for example:

Terminal
npx ampx sandbox --stream-function-logs --logs-filter auth --logs-out-file sandbox-auth.log
However it cannot be combined multiple times to write logs to multiple files.
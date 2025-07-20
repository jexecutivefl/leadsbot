Enable logging
You can enable logging to debug your GraphQL API using Amazon CloudWatch logs. To learn more about logging and monitoring capabilities for your GraphQL API, visit the AWS AppSync documentation for logging and monitoring.

Enable default logging configuration
Default logging can be enabled by setting the logging property to true in the call to defineData. For example:

amplify/data/resource.ts
export const data = defineData({
  // ...
  logging: true
});
Using logging: true applies the default configuration:

excludeVerboseContent: true (see AppSync's Request-level logs)
fieldLogLevel: 'none' (see AppSync's Field-level logs)
retention: '1 week' (see Enum RetentionDays)
Customize logging configuration
You can customize individual configuration values by providing a DataLogConfig object. For example:

amplify/data/resource.ts
export const data = defineData({
  // ...
  logging: {
    excludeVerboseContent: false,
    fieldLogLevel: 'all',
    retention: '1 month'
  }
});
WARNING: Setting excludeVerboseContent to false logs full queries and user parameters, which can contain sensitive data. We recommend limiting CloudWatch log access to only those roles or users (e.g., DevOps or developers) who genuinely require it, by carefully scoping your IAM policies.

Configuration Properties
logging
true: Enables default logging.
DataLogConfig object: Overrides one or more default fields.
DataLogConfig Fields
excludeVerboseContent?: boolean

Defaults to true
When false, logs can contain request-level logs. See AppSync's Request-Level Logs.
fieldLogLevel?: DataLogLevel

Defaults to 'none'
Supported values of AppSync's Field Log Levels:
'none'
'error'
'info'
'debug'
'all'
retention?: LogRetention

Number of days to keep the logs
Defaults to '1 week'
Supported values of Enum RetentionDays:
'1 day'
'3 days'
'5 days'
'1 week'
'2 weeks'
'1 month'
'2 months'
'3 months'
'4 months'
'5 months'
'6 months'
'1 year'
'13 months'
'18 months'
'2 years'
'5 years'
'10 years'
'infinite'
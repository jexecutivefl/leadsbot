Scheduling Functions
Amplify offers the ability to schedule Functions to run on specific intervals using natural language or cron expressions. To get started, specify the schedule property in defineFunction:

Note: Configuring the schedule in defineFunction is not supported for Custom Functions.

amplify/jobs/weekly-digest/resource.ts
import { defineFunction } from "@aws-amplify/backend";

export const weeklyDigest = defineFunction({
  name: "weekly-digest",
  schedule: "every week",
});
Function schedules are powered by Amazon EventBridge rules, and can be leveraged to address use cases such as:

generating a "front page" of top-performing posts
generating a weekly digest of top-performing posts
generating a monthly report of warehouse inventory
Their handlers can be typed using the EventBridgeHandler type:

amplify/jobs/weekly-digest/handler.ts
import type { EventBridgeHandler } from "aws-lambda";

export const handler: EventBridgeHandler<"Scheduled Event", null, void> = async (event) => {
  console.log("event", JSON.stringify(event, null, 2))
}
Note: AWS Lambda types can be installed with

Terminal
npm add --save-dev @types/aws-lambda
Schedules can either be a single interval, or multiple intervals:

amplify/jobs/generate-report/resource.ts
import { defineFunction } from "@aws-amplify/backend";

export const generateReport = defineFunction({
  name: "generate-report",
  schedule: ["every week", "every month", "every year"],
});
Schedules can also be defined to execute using minutes or hours with a shorthand syntax:

amplify/jobs/drink-some-water/resource.ts
import { defineFunction } from "@aws-amplify/backend";

export const drinkSomeWater = defineFunction({
  name: "drink-some-water",
  schedule: "every 1h"
})
Or combined to create complex schedules:

amplify/jobs/remind-me/resource.ts
import { defineFunction } from "@aws-amplify/backend";

export const remindMe = defineFunction({
  name: "remind-me",
  schedule: [
    // every sunday at midnight
    "every week",
    // every tuesday at 5pm
    "0 17 ? * 3 *",
    // every wednesday at 5pm
    "0 17 ? * 4 *",
    // every thursday at 5pm
    "0 17 ? * 5 *",
    // every friday at 5pm
    "0 17 ? * 6 *",
  ]
})
Using natural language
Schedules can be written using natural language, using terms you use every day. Amplify supports the following time periods:

day will always start at midnight
week will always start on Sunday at midnight
month will always start on the first of the month at midnight
year will always start on the first of the year at midnight
m for minutes
h for hours
Natural language expressions are prefixed with "every":

amplify/jobs/drink-some-water/resource.ts
import { defineFunction } from "@aws-amplify/backend";

export const drinkSomeWater = defineFunction({
  name: "drink-some-water",
  schedule: "every 1h"
})
Using cron expressions
Schedules can be written using cron expressions.

amplify/jobs/remind-me/resource.ts
import { defineFunction } from "@aws-amplify/backend";

export const remindMe = defineFunction({
  name: "remind-me-to-take-the-trash-out",
  schedule: [
    // every tuesday at 9am
    "0 9 ? * 3 *",
    // every friday at 9am
    "0 9 ? * 6 *",
  ]
})
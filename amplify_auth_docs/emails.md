Email
By default Amplify Auth is scaffolded with email as the default method for user sign-in.

amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
})
This will configure an email attribute that is required for sign-up and cannot be changed.
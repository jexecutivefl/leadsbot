Phone
By default Amplify Auth is scaffolded with email as the default method for user sign-in, however this can be changed or extended to also allow your users to sign in using their phone number.

amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend"

export const auth = defineAuth({
  loginWith: {
    phone: true,
  },
})
This will configure the phone_number attribute that is required for sign-up and cannot be changed.
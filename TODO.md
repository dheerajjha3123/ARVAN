# TODO: Add Functionality for User Not Found in OTP Login

## Completed Tasks
- [x] Modify backend `verfy_otp` function in `customers.controller.ts` to return `{ success: false, message: "User not found, you have to register first" }` when user not found for login type, instead of throwing error. Also delete the OTP.
- [x] Modify frontend OTP component in `otp.tsx` to handle `success: false` response, show error toast with the message, and redirect to signup page after 2 seconds.

## Summary
The functionality has been added where if a user is not found in the database during OTP login attempt, OTP is not sent and an error message is shown prompting to register first. If OTP is sent (for existing users), and during verification user is not found (edge case), a popup appears saying "User not found, you have to register first", and the user is redirected to the signup page. After registration and OTP verification, the user can log in using OTP.

## Testing
- Test the login flow with a non-existent user phone number: OTP should not be sent, error message shown.
- Test with existing user: OTP sent, verification works.
- Verify signup flow works and allows login after.

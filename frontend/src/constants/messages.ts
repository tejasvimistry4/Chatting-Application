export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Welcome back! You are now logged in.",
  LOGIN_FAILED: "Unable to log in. Please check your credentials.",
  REGISTER_SUCCESS: "Account created successfully. Welcome!",
  REGISTER_FAILED: "Unable to create your account.",
  LOGOUT_SUCCESS: "You have been logged out successfully.",
} as const;

export const COMMON_MESSAGES = {
  SOMETHING_WENT_WRONG: "Something went wrong. Please try again.",
  NETWORK_ERROR: "Unable to connect to the server.",
  PROFILE_UPDATED: "Profile updated successfully.",
} as const;

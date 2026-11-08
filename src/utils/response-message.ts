export const responseMessage = {
  // HTTP / System
  badRequest: "Invalid request",
  conflict: "Data already exists",
  forbidden: "Access denied",
  internalServer: "Internal server error",
  notFound: "Data not found",
  unauthorized: "Authentication required",
  parse: "The data could not be processed",
  http: "An error occurred while processing the request",
  validation: "The submitted data is invalid",
  foreignKey: "Referenced data does not exist or is still in use",
  notNull: "This field is required",
  notSet: "No values to set",
  checkConstraint: "The data does not meet the requirements",
  database: "A database error occurred",

  // Authentication
  loginSuccess: "Login successful",
  logoutSuccess: "Logout successful",
  refreshSuccess: "Session refreshed successfully",

  invalidCredentials: "Invalid username or password",
  invalidToken: "Invalid token",
  invalidOtp: "Invalid OTP",
  expiredToken: "Session has expired",
  sessionNotFound: "Session not found",
  sessionExpired: "Session has expired",
  sessionRevoked: "Session has been revoked",
  sessionConflict: "Your account is already logged in on another device",

  // Authorization
  permissionDenied: "You do not have permission to perform this action",

  // Password
  passwordChanged: "Password changed successfully",
  passwordReset: "Password reset successfully",
  currentPasswordInvalid: "Current password is incorrect",
  passwordMismatch: "Password confirmation does not match",

  // Account
  accountInactive: "Account is inactive",
  accountLocked: "Account is locked",
  accountSuspended: "Account is suspended",
  usernameConflict: "Username already exists",
  phoneConflict: "Phone already exists",
  emailConflict: "Email already exists",

  // Generic success
  success: "Success",
  created: "Data created successfully",
  updated: "Data updated successfully",
  deleted: "Data deleted successfully",
} as const;

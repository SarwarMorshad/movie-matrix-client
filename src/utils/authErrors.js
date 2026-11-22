// Friendly messages for Firebase Auth error codes
const MESSAGES = {
  "auth/invalid-credential": "Wrong email or password.",
  "auth/wrong-password": "Wrong email or password.",
  "auth/user-not-found": "Wrong email or password.",
  "auth/invalid-email": "That doesn't look like a valid email address.",
  "auth/email-already-in-use": "An account with this email already exists. Try signing in instead.",
  "auth/weak-password": "That password is too weak.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/network-request-failed": "Network problem. Check your connection and try again.",
  "auth/popup-blocked": "Your browser blocked the Google window. Allow pop-ups and try again.",
  "auth/user-disabled": "This account has been disabled.",
};

// Closing the Google window isn't an error worth showing
export const isCancelledPopup = (error) =>
  ["auth/popup-closed-by-user", "auth/cancelled-popup-request"].includes(error?.code);

export const authErrorMessage = (error, fallback = "Something went wrong. Please try again.") =>
  MESSAGES[error?.code] || fallback;

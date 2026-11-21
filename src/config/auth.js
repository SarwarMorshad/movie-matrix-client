// Email/password accounts created on or after this moment must verify their
// email before they can use the app. Older accounts are grandfathered.
// Keep in sync with the server's src/config/auth.js.
export const VERIFICATION_REQUIRED_SINCE = new Date("2026-11-22T00:00:00Z");

const usesPassword = (user) => user.providerData.some((p) => p.providerId === "password");
const usesOtherProvider = (user) => user.providerData.some((p) => p.providerId !== "password");

/**
 * Can this Firebase user use the app?
 * Yes for Google (and other providers), verified emails, and accounts created
 * before VERIFICATION_REQUIRED_SINCE; no for new unverified email/password accounts.
 */
export const isAccountActive = (user) => {
  if (!user) return false;
  if (user.emailVerified || usesOtherProvider(user) || !usesPassword(user)) return true;
  return new Date(user.metadata.creationTime) < VERIFICATION_REQUIRED_SINCE;
};

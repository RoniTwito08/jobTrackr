export const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: false, // בפרודקשן נהפוך ל-true
  path: "/",
};

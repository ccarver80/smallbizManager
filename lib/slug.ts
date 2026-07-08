export const RESERVED_SLUGS = new Set([
  "api",
  "admin",
  "login",
  "signup",
  "dashboard",
  "auth",
  "static",
  "assets",
  "mail",
]);

export const SLUG_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

export const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "api",
  "admin",
  "login",
  "signup",
  "dashboard",
  "auth",
  "static",
  "assets",
  "mail",
  "sites",
]);

export const SUBDOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

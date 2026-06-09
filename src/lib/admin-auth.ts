import { createHash } from "node:crypto";

export const ADMIN_COOKIE_NAME = "howdesign_admin";

export function getAdminSessionValue() {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return null;
  }

  return createHash("sha256").update(adminPassword).digest("hex");
}

export function isAdminSession(value?: string) {
  const sessionValue = getAdminSessionValue();
  return Boolean(sessionValue && value === sessionValue);
}

import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const cookieName = "loopwijzer_admin";

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "loopwijzer-local-admin-session";
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "loopwijzer-admin";
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

function sessionToken() {
  const value = "admin";
  return `${value}.${sign(value)}`;
}

function tokensMatch(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  return token ? tokensMatch(token, sessionToken()) : false;
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export function verifyAdminPassword(value: FormDataEntryValue | null) {
  return typeof value === "string" && tokensMatch(value, adminPassword());
}

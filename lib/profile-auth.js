import { createHmac, createHash, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "profile_upload_session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

export function isUploadConfigured() {
  return Boolean(
    process.env.PROFILE_UPLOAD_PASSWORD?.length >= 16 &&
    process.env.PROFILE_SESSION_SECRET &&
    process.env.PROFILE_SESSION_SECRET.length >= 32 &&
    process.env.BLOB_READ_WRITE_TOKEN,
  );
}

function sessionSignature(expiresAt) {
  return createHmac("sha256", process.env.PROFILE_SESSION_SECRET)
    .update(`${COOKIE_NAME}.${expiresAt}`)
    .digest("base64url");
}

export function hasUploadSession(req) {
  if (!isUploadConfigured()) return false;
  const cookieHeader = req.headers.cookie || "";
  const cookie = cookieHeader.split(";").map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE_NAME}=`));
  if (!cookie) return false;

  const [expiresAt, signature] = cookie.slice(COOKIE_NAME.length + 1).split(".");
  if (!expiresAt || !signature || !/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now()) {
    return false;
  }

  const expected = Buffer.from(sessionSignature(expiresAt));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function createUploadCookie() {
  const expiresAt = String(Date.now() + SESSION_DURATION_SECONDS * 1000);
  const value = `${expiresAt}.${sessionSignature(expiresAt)}`;
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DURATION_SECONDS}`;
}

export function clearUploadCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function passwordMatches(candidate) {
  const expected = createHash("sha256").update(process.env.PROFILE_UPLOAD_PASSWORD).digest();
  const actual = createHash("sha256").update(candidate).digest();
  return timingSafeEqual(expected, actual);
}

export function isSameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

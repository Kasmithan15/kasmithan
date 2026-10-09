import {
  clearUploadCookie,
  createUploadCookie,
  hasUploadSession,
  isSameOrigin,
  isUploadConfigured,
  passwordMatches,
} from "../lib/profile-auth.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    return res.status(200).json({
      authenticated: hasUploadSession(req),
      configured: isUploadConfigured(),
    });
  }

  if (!isSameOrigin(req)) {
    return res.status(403).json({ error: "Request origin could not be verified." });
  }

  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", clearUploadCookie());
    return res.status(200).json({ authenticated: false });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!isUploadConfigured()) {
    return res.status(503).json({ error: "Photo uploads are not configured." });
  }

  const password = req.body?.password;
  if (typeof password !== "string" || !passwordMatches(password)) {
    return res.status(401).json({ error: "The upload password is incorrect." });
  }

  res.setHeader("Set-Cookie", createUploadCookie());
  return res.status(200).json({ authenticated: true });
}

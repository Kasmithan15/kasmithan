import Busboy from "busboy";
import { list, put } from "@vercel/blob";
import { hasUploadSession, isSameOrigin, isUploadConfigured } from "../lib/profile-auth.js";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

function readImage(req) {
  return new Promise((resolve, reject) => {
    let image = null;
    let imageError = null;
    let fileCount = 0;
    let parser;

    try {
      parser = Busboy({
        headers: req.headers,
        limits: { files: 1, fileSize: MAX_FILE_SIZE, fields: 0 },
      });
    } catch {
      reject(new Error("Choose a valid image file."));
      return;
    }

    parser.on("file", (fieldName, stream, info) => {
      fileCount += 1;
      const chunks = [];
      if (fieldName !== "image" || !ALLOWED_TYPES.has(info.mimeType)) {
        imageError = new Error("Only JPEG, PNG, and WebP images are allowed.");
        stream.resume();
        return;
      }

      stream.on("limit", () => {
        imageError = new Error("Choose an image smaller than 4 MB.");
      });
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => {
        if (!imageError) image = { buffer: Buffer.concat(chunks), mimeType: info.mimeType };
      });
    });

    parser.on("filesLimit", () => {
      imageError = new Error("Upload one image at a time.");
    });
    parser.on("fieldsLimit", () => {
      imageError = new Error("Unexpected form fields.");
    });
    parser.on("error", reject);
    parser.on("close", () => {
      if (imageError) reject(imageError);
      else if (fileCount !== 1 || !image) reject(new Error("Choose an image to upload."));
      else resolve(image);
    });
    req.pipe(parser);
  });
}

function matchesImageSignature({ buffer, mimeType }) {
  if (mimeType === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (mimeType === "image/webp") {
    return buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP";
  }
  return false;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(200).json({ url: null });
    }
    try {
      const { blobs } = await list({ prefix: "profile-photo", limit: 10 });
      const photo = blobs.find((blob) => blob.pathname === "profile-photo");
      return res.status(200).json({
        url: photo?.url || null,
        uploadedAt: photo?.uploadedAt?.toISOString() || null,
      });
    } catch (error) {
      console.error("Unable to read profile photo from Blob storage:", error);
      return sendError(res, 502, "Could not load the profile photo.");
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return sendError(res, 405, "Method not allowed.");
  }

  if (!isSameOrigin(req)) return sendError(res, 403, "Request origin could not be verified.");
  if (!isUploadConfigured()) return sendError(res, 503, "Photo uploads are not configured.");
  if (!hasUploadSession(req)) return sendError(res, 401, "Sign in before uploading a profile photo.");

  let image;
  try {
    image = await readImage(req);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read the uploaded image.";
    return sendError(res, message.includes("4 MB") ? 413 : 400, message);
  }

  if (!matchesImageSignature(image)) {
    return sendError(res, 415, "The selected file does not contain a supported image.");
  }

  try {
    const blob = await put("profile-photo", image.buffer, {
      access: "public",
      contentType: image.mimeType,
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });
    return res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error("Unable to save profile photo to Blob storage:", error);
    return sendError(res, 502, "Could not save the profile photo. Check the Vercel Blob setup and try again.");
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

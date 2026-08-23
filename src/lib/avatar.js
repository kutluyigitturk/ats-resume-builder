import "server-only";

import sharp from "sharp";
import { prisma } from "@/lib/prisma";

// 3:4, the proportion of a passport photo, and the shape a CV template will
// want. The circle in the menu shows its top square. Storing one derivative
// rather than the original plus a crop keeps a single row per person: someone
// who wants a different crop uploads again, which costs them one action and
// saves the database three copies of every photo.
export const OUT_WIDTH = 480;
export const OUT_HEIGHT = 640;
export const OUT_MIME = "image/webp";

// 480px across a 30mm frame is about 406dpi, comfortably past what print
// needs, and webp at this quality lands around 40-50KB.
const WEBP_QUALITY = 82;

// The upload is the original file, so it has to allow for a phone photo.
// Vercel refuses serverless request bodies over 4.5MB, so this is the real
// ceiling rather than a number we picked.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

// A few kilobytes of PNG can decode to gigapixels and take the process with
// it. sharp is told the limit up front so it refuses during the decode.
const MAX_INPUT_PIXELS = 50_000_000;

// Whitelist, never a blacklist, and SVG is the reason. An SVG is a document
// that can carry script; served from our own origin it would be stored XSS,
// and this app sets no Content-Security-Policy to blunt it.
const ALLOWED_INPUT = new Set(["jpeg", "png", "webp"]);

// Reads the whole image row. Nothing else in the app should query UserAvatar -
// keeping it to one module is what stops the bytes leaking into a select that
// runs on every request.
export async function readAvatar(userId) {
  return prisma.userAvatar.findUnique({
    where: { userId },
    select: { data: true, mimeType: true, updatedAt: true },
  });
}

// Turns an uploaded file plus a crop rectangle into the stored derivative.
// Throws an Error whose message is safe to show the user.
export async function saveAvatar(userId, bytes, requestedCrop) {
  let meta;

  try {
    meta = await sharp(bytes, { limitInputPixels: MAX_INPUT_PIXELS }).metadata();
  } catch {
    throw new Error("That file is not an image we can read. Use a JPEG, PNG or WebP.");
  }

  if (!ALLOWED_INPUT.has(meta.format)) {
    throw new Error("Use a JPEG, PNG or WebP photo.");
  }

  // .rotate() applies the EXIF orientation and drops the tag, so the crop
  // rectangle has to be measured against the image AFTER that turn - on a
  // sideways phone photo the width and height swap.
  const turned = meta.orientation >= 5 && meta.orientation <= 8;
  const sourceWidth = turned ? meta.height : meta.width;
  const sourceHeight = turned ? meta.width : meta.height;

  if (!sourceWidth || !sourceHeight) {
    throw new Error("That image has no readable size. Try another photo.");
  }

  const crop = clampCrop(requestedCrop, sourceWidth, sourceHeight);

  // The order matters. rotate() first so extract() works in the coordinates
  // the user actually saw; the re-encode at the end is what strips every
  // remaining tag - a phone photo carries the GPS coordinates of wherever it
  // was taken, and the person uploading it does not know that.
  const data = await sharp(bytes, { limitInputPixels: MAX_INPUT_PIXELS })
    .rotate()
    .extract(crop)
    .resize(OUT_WIDTH, OUT_HEIGHT, { fit: "cover" })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const now = new Date();

  await prisma.$transaction([
    prisma.userAvatar.upsert({
      where: { userId },
      create: { userId, data, mimeType: OUT_MIME, width: OUT_WIDTH, height: OUT_HEIGHT },
      update: { data, mimeType: OUT_MIME, width: OUT_WIDTH, height: OUT_HEIGHT },
    }),
    prisma.user.update({ where: { id: userId }, data: { avatarUpdatedAt: now } }),
  ]);

  return now;
}

export async function removeAvatar(userId) {
  await prisma.$transaction([
    prisma.userAvatar.deleteMany({ where: { userId } }),
    prisma.user.update({ where: { id: userId }, data: { avatarUpdatedAt: null } }),
  ]);
}

// The rectangle arrives from the browser, so it is a request, not a fact. It
// is squared up against the real decoded dimensions here: a crop reaching past
// the edge would otherwise make sharp throw, and one built by hand could ask
// for a region that does not exist.
function clampCrop(requested, sourceWidth, sourceHeight) {
  const asInt = (value) => {
    const n = Math.round(Number(value));
    return Number.isFinite(n) ? n : 0;
  };

  const left = Math.min(Math.max(asInt(requested?.x), 0), sourceWidth - 1);
  const top = Math.min(Math.max(asInt(requested?.y), 0), sourceHeight - 1);

  const width = Math.min(Math.max(asInt(requested?.width), 1), sourceWidth - left);
  const height = Math.min(Math.max(asInt(requested?.height), 1), sourceHeight - top);

  return { left, top, width, height };
}

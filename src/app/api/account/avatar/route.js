import { getCurrentUser } from "@/lib/session";
import { hitRateLimit, tooManyAttempts } from "@/lib/rateLimit";
import { readAvatar, saveAvatar, removeAvatar, MAX_UPLOAD_BYTES, OUT_MIME } from "@/lib/avatar";

// Decoding and re-encoding an image is not something the edge runtime can do.
export const runtime = "nodejs";

// Generous for a person changing their mind about a photo, useless for a
// script: every write decodes an image and holds memory while it does.
const PER_USER = { limit: 20, windowMs: 60 * 60 * 1000 };

// A cross-site form post carries no preflight, so the only thing standing
// between another origin and this endpoint is the cookie policy plus this.
// Same threat model the logout route documents.
function isSameOrigin(request) {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin" || site === "none";

  // Older browsers send no Sec-Fetch-Site; fall back to comparing hosts.
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

// Serves the caller their OWN photo, keyed on the session rather than an id in
// the path. An enumerable /api/avatar/<id> would be a face-scraping endpoint
// that maps account ids to photographs.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return new Response(null, { status: 401 });

  const avatar = await readAvatar(user.id);
  if (!avatar) return new Response(null, { status: 404 });

  return new Response(avatar.data, {
    headers: {
      // Our own type, from our own re-encode - never anything the upload said.
      "Content-Type": avatar.mimeType || OUT_MIME,
      "Content-Disposition": "inline",
      "Cache-Control": "private, max-age=0, must-revalidate",
      ETag: `"${avatar.updatedAt.getTime()}"`,
    },
  });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in to change your photo." }, { status: 401 });

  if (!isSameOrigin(request)) {
    return Response.json({ error: "Request blocked." }, { status: 403 });
  }

  const limit = await hitRateLimit("avatar:user", user.id, PER_USER);
  if (!limit.allowed) return tooManyAttempts(limit.retryAfterSeconds);

  let form;
  try {
    form = await request.formData();
  } catch {
    return Response.json(
      { error: "That upload did not arrive intact. Try again." },
      { status: 400 }
    );
  }

  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function") {
    return Response.json({ error: "Choose a photo to upload.", field: "file" }, { status: 400 });
  }

  // Checked before reading the body into memory, not after.
  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json(
      { error: "That photo is over 4 MB. Try a smaller one.", field: "file" },
      { status: 413 }
    );
  }

  let crop;
  try {
    crop = JSON.parse(form.get("crop") ?? "null");
  } catch {
    crop = null;
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // The size header can lie; the bytes cannot.
  if (bytes.length > MAX_UPLOAD_BYTES) {
    return Response.json(
      { error: "That photo is over 4 MB. Try a smaller one.", field: "file" },
      { status: 413 }
    );
  }

  try {
    const updatedAt = await saveAvatar(user.id, bytes, crop);
    return Response.json({ updatedAt: updatedAt.getTime() });
  } catch (error) {
    // saveAvatar throws messages written for the person who uploaded the file.
    console.error("Avatar upload failed:", error);
    return Response.json(
      { error: error.message || "Could not use that photo. Try another one.", field: "file" },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in to change your photo." }, { status: 401 });

  if (!isSameOrigin(request)) {
    return Response.json({ error: "Request blocked." }, { status: 403 });
  }

  await removeAvatar(user.id);
  return Response.json({ ok: true });
}

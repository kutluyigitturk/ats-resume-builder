import { getCurrentUser } from "@/lib/session";
import { hitRateLimit, tooManyAttempts } from "@/lib/rateLimit";
import { prisma } from "@/lib/prisma";

// Matches the signup route's limit. One field cannot have two ceilings: a
// name accepted at signup has to stay editable here, and a lower cap would
// mean anyone who used more than this could never save their own name again.
const MAX_NAME_LENGTH = 80;

const PER_USER = { limit: 30, windowMs: 60 * 60 * 1000 };

// Same reasoning as the avatar route: a cross-site POST carries no preflight,
// so the cookie policy needs this beside it.
function isSameOrigin(request) {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin" || site === "none";

  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

// getCurrentUser, not requireUser: requireUser redirects, which in a route
// handler answers a fetch() with a 307 to an HTML page instead of the JSON
// the form is waiting for.
export async function PATCH(request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in to change your name." }, { status: 401 });

  if (!isSameOrigin(request)) {
    return Response.json({ error: "Request blocked." }, { status: 403 });
  }

  const limit = await hitRateLimit("profile:user", user.id, PER_USER);
  if (!limit.allowed) return tooManyAttempts(limit.retryAfterSeconds);

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "That request did not arrive intact." }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim();

  if (!name) {
    return Response.json({ error: "Enter your name.", field: "name" }, { status: 400 });
  }

  if (name.length > MAX_NAME_LENGTH) {
    return Response.json(
      { error: `Use ${MAX_NAME_LENGTH} characters or fewer.`, field: "name" },
      { status: 400 }
    );
  }

  // Only the name. Everything else on User has its own endpoint and its own
  // rules, and a PATCH that quietly accepted more would be the seam where
  // that stops being true.
  await prisma.user.update({ where: { id: user.id }, data: { name } });

  return Response.json({ name });
}

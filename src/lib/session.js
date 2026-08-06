import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "session";
const SESSION_DAYS = 30;

// SHA-256 is enough here, unlike for passwords. A password is short and
// guessable, so it needs a deliberately slow hash. This token is 256 bits of
// randomness - guessing it is infeasible regardless of hash speed - and it is
// verified on every single request, so speed matters.
function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function expiryDate() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
}

// Issues a new session and writes the cookie. The raw token exists only in
// the cookie; the database holds nothing but its hash.
export async function createSession(userId, userAgent) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = expiryDate();

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      userAgent: userAgent?.slice(0, 255) ?? null,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    // JavaScript cannot read this cookie, so an XSS bug cannot steal the session.
    httpOnly: true,
    // Sent over HTTPS only, except on localhost where there is no HTTPS.
    secure: process.env.NODE_ENV === "production",
    // Not attached to cross-site POST requests, which blocks CSRF.
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// Returns the logged-in user, or null. Every protected page and API route
// goes through this.
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    select: {
      expiresAt: true,
      user: {
        select: { id: true, email: true, plan: true, emailVerified: true },
      },
    },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.deleteMany({ where: { tokenHash } });
    return null;
  }

  return session.user;
}

// Deletes the session row as well as the cookie. Clearing only the cookie
// would leave a token that still works if it was captured earlier.
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }

  cookieStore.delete(COOKIE_NAME);
}
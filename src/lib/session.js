import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
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
        select: { id: true, email: true, name: true, plan: true, emailVerified: true },
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

// The gate every protected layout uses. Kept here rather than repeated per
// layout so a route can never be added with a subtly weaker check.
//
// Deliberately not wrapped in a try/catch: a protected page fails closed. If
// the session cannot be read, the error reaches the boundary and the visitor
// gets an error screen with a retry - never the page. Redirecting to /login
// instead would be a lie, telling someone their session ended when the
// database merely hiccuped.
export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

// Reads the session without letting a failure take the page down. For any
// surface that must render whether or not the lookup works - the public auth
// pages, the 404 - a database hiccup should mean "treated as signed out",
// never a white screen on the one page someone lands on to recover.
export async function getCurrentUserQuietly() {
  try {
    return await getCurrentUser();
  } catch (error) {
    // The framework signals redirects, not-founds and "this route must be
    // dynamic" by throwing. Swallowing those breaks routing itself.
    unstable_rethrow(error);

    console.error("Session lookup failed on a public surface:", error);
    return null;
  }
}

// The mirror of requireUser, for the pages that only make sense logged out.
// Someone already signed in who lands on /login has nothing to do there.
//
// This one fails OPEN, which is the opposite of requireUser and the whole
// point: /login, /signup and /forgot-password are the way back in. If reading
// the session throws, the visitor is treated as signed out and gets the form.
// Letting the error through here would close the only door left open.
export async function redirectIfAuthenticated() {
  const user = await getCurrentUserQuietly();

  if (user) {
    redirect("/dashboard");
  }
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

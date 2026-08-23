import { verify } from "@node-rs/argon2";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { clientIp, hitRateLimit, clearRateLimit, tooManyAttempts } from "@/lib/rateLimit";

// A real argon2id hash of a random string nobody knows. When the email does
// not exist we still verify against this, so a failed login takes the same
// time either way. Otherwise an attacker could time responses to discover
// which email addresses are registered.
const DUMMY_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$ZFO1XzmRejIwqTPXfYP9kQ$VK7ghNCL0o2ze7lfeSQHk5IRrrwnBCImXsOrZ0Lo2kA";

// Deliberately vague: never reveal whether it was the email or the password
// that was wrong.
const INVALID_CREDENTIALS = "Email or password is incorrect.";

// Three limits, and the split between the first two is the point.
//
// Locking an address after a few failures would hand anyone who knows an
// email a way to keep its owner out on demand - the limiter becomes the
// attack. So the tight limit is keyed on the address *and* the source: a
// stranger failing repeatedly locks out only themselves, while the real user
// coming from their own connection is untouched.
//
// The loose per-address limit is the backstop for guessing spread across many
// addresses, set high enough that tripping it takes a botnet rather than a
// grudge. The per-IP one catches one password sprayed across many accounts.
const PER_EMAIL_AND_IP = { limit: 8, windowMs: 15 * 60 * 1000 };
const PER_EMAIL = { limit: 60, windowMs: 60 * 60 * 1000 };
const PER_IP = { limit: 30, windowMs: 15 * 60 * 1000 };

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return Response.json({ error: INVALID_CREDENTIALS }, { status: 401 });
  }

  try {
    const address = clientIp(request);

    const perIp = await hitRateLimit("login:ip", address, PER_IP);
    if (!perIp.allowed) return tooManyAttempts(perIp.retryAfterSeconds);

    const perPair = await hitRateLimit("login:email+ip", `${email}|${address}`, PER_EMAIL_AND_IP);
    if (!perPair.allowed) return tooManyAttempts(perPair.retryAfterSeconds);

    const perEmail = await hitRateLimit("login:email", email, PER_EMAIL);
    if (!perEmail.allowed) return tooManyAttempts(perEmail.retryAfterSeconds);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true, emailVerified: true },
    });

    const passwordMatches = await verify(user?.passwordHash ?? DUMMY_HASH, password);

    if (!user || !passwordMatches) {
      return Response.json({ error: INVALID_CREDENTIALS }, { status: 401 });
    }

    // Checked only after the password is confirmed. Doing it earlier would
    // tell anyone who guesses an address whether it is registered here.
    if (!user.emailVerified) {
      return Response.json(
        {
          error: "Confirm your email address before logging in.",
          needsVerification: true,
        },
        { status: 403 }
      );
    }

    // The password was right, so the failures before it were this user's own
    // typing. Clearing both means a person who fumbles their password four
    // times and then gets it right starts the next visit with a clean slate.
    await clearRateLimit("login:email+ip", `${email}|${address}`);
    await clearRateLimit("login:email", email);

    await createSession(user.id, request.headers.get("user-agent"));

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

import { verify } from "@node-rs/argon2";
import { prisma } from "@/lib/prisma";
import { issueToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { clientIp, hitRateLimit, tooManyAttempts } from "@/lib/rateLimit";

const DUMMY_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$ZFO1XzmRejIwqTPXfYP9kQ$VK7ghNCL0o2ze7lfeSQHk5IRrrwnBCImXsOrZ0Lo2kA";

const RESEND_COOLDOWN_MS = 60 * 1000;

// The per-user cooldown below already paces the mail. This one is about the
// password guessing this endpoint would otherwise allow for free, since it
// checks credentials just like login does.
const PER_IP = { limit: 20, windowMs: 15 * 60 * 1000 };

// Requires the password, not just the address. Without it this endpoint would
// let anyone send mail to any address on our behalf, and would reveal which
// addresses are registered.
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

  try {
    const ip = await hitRateLimit("resend:ip", clientIp(request), PER_IP);
    if (!ip.allowed) return tooManyAttempts(ip.retryAfterSeconds);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, passwordHash: true, emailVerified: true },
    });

    const passwordMatches = await verify(user?.passwordHash ?? DUMMY_HASH, password);

    if (!user || !passwordMatches) {
      return Response.json({ error: "Email or password is incorrect." }, { status: 401 });
    }

    if (user.emailVerified) {
      return Response.json({ error: "This address is already confirmed." }, { status: 400 });
    }

    const recent = await prisma.token.findFirst({
      where: {
        userId: user.id,
        type: "EMAIL_VERIFY",
        createdAt: { gt: new Date(Date.now() - RESEND_COOLDOWN_MS) },
      },
      select: { id: true },
    });

    // Silently skip inside the cooldown. Reporting it would let someone map
    // out exactly when the last email went out.
    if (!recent) {
      const token = await issueToken(user.id, "EMAIL_VERIFY");
      await sendVerificationEmail(user.email, token, user.name);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Resend verification error:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

import { hash } from "@node-rs/argon2";
import { prisma } from "@/lib/prisma";
import { issueToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { checkPassword } from "@/lib/password";
import { clientIp, hitRateLimit, tooManyAttempts } from "@/lib/rateLimit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;

// Every signup sends an email from our domain, so an unlimited endpoint is
// also an unlimited way to send mail to strangers and burn our sender
// reputation. Generous enough for a shared office, useless for a script.
const PER_IP = { limit: 10, windowMs: 60 * 60 * 1000 };

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Normalize before validating so "  Kutlu@Mail.COM " and "kutlu@mail.com"
  // can never become two separate accounts.
  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(body.password ?? "");
  const name = String(body.name ?? "").trim();

  // The field travels with the message so the form can attach it to the right
  // input. Matching on the message text instead would break silently the next
  // time a word in it changes.
  if (!name) {
    return Response.json({ error: "Enter your name.", field: "name" }, { status: 400 });
  }

  if (name.length > MAX_NAME_LENGTH) {
    return Response.json(
      { error: `Use ${MAX_NAME_LENGTH} characters or fewer.`, field: "name" },
      { status: 400 }
    );
  }

  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return Response.json(
      { error: "Enter a valid email address.", field: "email" },
      { status: 400 }
    );
  }

  const passwordError = checkPassword(password, email);

  if (passwordError) {
    return Response.json({ error: passwordError, field: "password" }, { status: 400 });
  }

  try {
    const ip = await hitRateLimit("signup:ip", clientIp(request), PER_IP);
    if (!ip.allowed) return tooManyAttempts(ip.retryAfterSeconds);

    // Argon2id is memory-hard, which makes GPU-based cracking expensive.
    // A random salt is generated per call and embedded in the output,
    // so identical passwords never produce identical hashes.
    const passwordHash = await hash(password);

    const user = await prisma.user.create({
      data: { email, passwordHash, name },
      select: { id: true, email: true, name: true },
    });

    const token = await issueToken(user.id, "EMAIL_VERIFY");
    await sendVerificationEmail(user.email, token, user.name);

    return Response.json(user, { status: 201 });
  } catch (error) {
    // P2002 is Prisma's unique constraint violation. Letting the database
    // decide - instead of checking with a separate query first - closes the
    // race where two simultaneous signups both pass the check.
    if (error?.code === "P2002") {
      return Response.json(
        { error: "An account with this email already exists.", field: "email" },
        { status: 409 }
      );
    }

    // Log the real error for us, return a generic one to the client.
    console.error("Signup error:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

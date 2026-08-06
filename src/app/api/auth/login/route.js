import { verify } from "@node-rs/argon2";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

// A real argon2id hash of a random string nobody knows. When the email does
// not exist we still verify against this, so a failed login takes the same
// time either way. Otherwise an attacker could time responses to discover
// which email addresses are registered.
const DUMMY_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$ZFO1XzmRejIwqTPXfYP9kQ$VK7ghNCL0o2ze7lfeSQHk5IRrrwnBCImXsOrZ0Lo2kA";

// Deliberately vague: never reveal whether it was the email or the password
// that was wrong.
const INVALID_CREDENTIALS = "Email or password is incorrect.";

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
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });

    const passwordMatches = await verify(user?.passwordHash ?? DUMMY_HASH, password);

    if (!user || !passwordMatches) {
      return Response.json({ error: INVALID_CREDENTIALS }, { status: 401 });
    }

    await createSession(user.id, request.headers.get("user-agent"));

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
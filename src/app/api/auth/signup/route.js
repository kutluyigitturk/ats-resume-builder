import { hash } from "@node-rs/argon2";
import { prisma } from "@/lib/prisma";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

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

  if (!EMAIL_PATTERN.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return Response.json(
      {
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      },
      { status: 400 }
    );
  }

  try {
    // Argon2id is memory-hard, which makes GPU-based cracking expensive.
    // A random salt is generated per call and embedded in the output,
    // so identical passwords never produce identical hashes.
    const passwordHash = await hash(password);

    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true },
    });

    return Response.json(user, { status: 201 });
  } catch (error) {
    // P2002 is Prisma's unique constraint violation. Letting the database
    // decide - instead of checking with a separate query first - closes the
    // race where two simultaneous signups both pass the check.
    if (error?.code === "P2002") {
      return Response.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Log the real error for us, return a generic one to the client.
    console.error("Signup error:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
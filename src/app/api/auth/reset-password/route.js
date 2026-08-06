import { hash } from "@node-rs/argon2";
import { prisma } from "@/lib/prisma";
import { consumeToken } from "@/lib/tokens";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const token = String(body.token ?? "");
  const password = String(body.password ?? "");

  if (password.length < MIN_PASSWORD_LENGTH) {
    return Response.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 }
    );
  }

  try {
    const userId = await consumeToken(token, "PASSWORD_RESET");

    if (!userId) {
      return Response.json(
        { error: "This link is invalid or has expired. Request a new one." },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password);

    // Changing the password logs out every device. If someone else was in the
    // account, this is the moment they lose access - which is the whole point
    // of resetting it.
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
      prisma.session.deleteMany({ where: { userId } }),
    ]);

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

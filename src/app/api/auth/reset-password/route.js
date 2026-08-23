import { hash } from "@node-rs/argon2";
import { prisma } from "@/lib/prisma";
import { consumeToken, checkToken } from "@/lib/tokens";
import { checkPassword } from "@/lib/password";

const INVALID_LINK = "This link is invalid or has expired. Request a new one.";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const token = String(body.token ?? "");
  const password = String(body.password ?? "");

  try {
    // Read the token before spending it. A reset token is single-use, so
    // consuming it first and then rejecting a weak password would leave the
    // user holding a dead link and no way back in.
    const owner = await checkToken(token, "PASSWORD_RESET");

    if (!owner) {
      return Response.json({ error: INVALID_LINK }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: owner },
      select: { email: true },
    });

    const passwordError = checkPassword(password, user?.email ?? "");

    if (passwordError) {
      return Response.json({ error: passwordError, field: "password" }, { status: 400 });
    }

    // Only now is the token spent. This is also the check that matters: the
    // read above cannot tell a used token from a fresh one, this one can.
    const userId = await consumeToken(token, "PASSWORD_RESET");

    if (!userId) {
      return Response.json({ error: INVALID_LINK }, { status: 400 });
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

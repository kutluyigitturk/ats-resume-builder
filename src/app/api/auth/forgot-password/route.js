import { prisma } from "@/lib/prisma";
import { issueToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";

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

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (user) {
      const token = await issueToken(user.id, "PASSWORD_RESET");
      await sendPasswordResetEmail(user.email, token);
    }
  } catch (error) {
    console.error("Forgot password error:", error);
  }

  // Always the same answer, whether or not the address is registered.
  // Anything else would turn this endpoint into a way to check which emails
  // have accounts here.
  return Response.json({ ok: true });
}

import { prisma } from "@/lib/prisma";
import { issueToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { clientIp, hitRateLimit } from "@/lib/rateLimit";

// Anyone can name any address here, so without a limit this is a button that
// mails a stranger on demand. The limits are silent: saying "too many
// attempts" for one address and nothing for another would turn this endpoint
// into the account check the generic reply below exists to prevent.
const PER_EMAIL = { limit: 3, windowMs: 60 * 60 * 1000 };
const PER_IP = { limit: 15, windowMs: 60 * 60 * 1000 };

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
    const ip = await hitRateLimit("forgot:ip", clientIp(request), PER_IP);
    const perEmail = await hitRateLimit("forgot:email", email, PER_EMAIL);

    if (ip.allowed && perEmail.allowed) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true },
      });

      if (user) {
        const token = await issueToken(user.id, "PASSWORD_RESET");
        await sendPasswordResetEmail(user.email, token, user.name);
      }
    }
  } catch (error) {
    console.error("Forgot password error:", error);
  }

  // Always the same answer, whether or not the address is registered.
  // Anything else would turn this endpoint into a way to check which emails
  // have accounts here.
  return Response.json({ ok: true });
}

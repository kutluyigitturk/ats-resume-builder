import { prisma } from "@/lib/prisma";
import { checkToken } from "@/lib/tokens";

// The link in the email lands here rather than on the page, so the write
// happens in a request handler instead of during a render - a render can run
// more than once, and a page that changes the database is a page that cannot
// be safely re-rendered or prefetched.
export async function GET(request) {
  const token = new URL(request.url).searchParams.get("token");
  const userId = await checkToken(token, "EMAIL_VERIFY");

  if (userId) {
    // The `emailVerified: null` condition keeps the original timestamp if the
    // link is opened again, and makes running this twice harmless - which it
    // has to be, because the token stays valid until it expires.
    await prisma.user.updateMany({
      where: { id: userId, emailVerified: null },
      data: { emailVerified: new Date() },
    });
  }

  const status = userId ? "verified" : "expired";

  return Response.redirect(new URL(`/verify-email?status=${status}`, request.url), 302);
}

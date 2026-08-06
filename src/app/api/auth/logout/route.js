import { destroySession } from "@/lib/session";

// POST rather than GET on purpose: a GET would let any page log the user out
// with a stray <img src="/api/auth/logout">.
export async function POST() {
  await destroySession();
  return Response.json({ ok: true });
}
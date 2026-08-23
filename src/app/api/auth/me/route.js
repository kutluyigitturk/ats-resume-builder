import { getCurrentUser } from "@/lib/session";

// Lets client components find out who is logged in without threading the
// user through props. Returns only fields that are safe to expose.
export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  return Response.json(user);
}

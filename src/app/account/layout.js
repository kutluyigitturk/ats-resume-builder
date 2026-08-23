import { requireUser } from "@/lib/session";
import { SessionUserProvider } from "@/components/SessionUser";

// Same gate as /dashboard and /builder: the redirect happens on the server, so
// a logged-out visitor never receives markup that names an account.
export default async function AccountLayout({ children }) {
  const user = await requireUser();

  return <SessionUserProvider user={user}>{children}</SessionUserProvider>;
}

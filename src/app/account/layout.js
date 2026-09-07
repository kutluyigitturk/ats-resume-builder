import { requireUser } from "@/lib/session";
import { SessionUserProvider } from "@/components/SessionUser";
import AccountShell from "@/components/account/AccountShell";

// Same gate as /dashboard and /builder: the redirect happens on the server, so
// a logged-out visitor never receives markup that names an account.
//
// The shell lives here rather than in a page, so moving between the tabs
// swaps only the right-hand column - the sidebar and the navbar never remount.
export default async function AccountLayout({ children }) {
  const user = await requireUser();

  return (
    <SessionUserProvider user={user}>
      <AccountShell>{children}</AccountShell>
    </SessionUserProvider>
  );
}

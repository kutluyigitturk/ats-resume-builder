import { requireUser } from "@/lib/session";
import { SessionUserProvider } from "@/components/SessionUser";

// Runs on the server before anything under /dashboard renders. A logged-out
// visitor never receives the page - the redirect happens first, so the markup
// is never sent. Applies to every route nested under /dashboard.
export default async function DashboardLayout({ children }) {
  const user = await requireUser();

  return <SessionUserProvider user={user}>{children}</SessionUserProvider>;
}

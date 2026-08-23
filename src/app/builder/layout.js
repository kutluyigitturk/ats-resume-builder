import { requireUser } from "@/lib/session";
import { AccountEmailProvider } from "@/components/AccountEmail";

// The builder is behind the same gate as the dashboard. It is also the only
// caller of /api/generate-pdf, which refuses anonymous requests - leaving the
// page open would have meant an editor that cannot export.
export default async function BuilderLayout({ children }) {
  const user = await requireUser();

  return <AccountEmailProvider email={user.email}>{children}</AccountEmailProvider>;
}

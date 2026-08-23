import { getCurrentUserQuietly } from "@/lib/session";
import { SessionUserProvider } from "@/components/SessionUser";

// A public surface, so the session is read the fail-open way: if the lookup
// throws, the visitor sees the signed-out nav rather than an error page.
// Pricing is one of the pages someone lands on before they have an account.
export default async function PricingLayout({ children }) {
  const user = await getCurrentUserQuietly();

  return <SessionUserProvider user={user}>{children}</SessionUserProvider>;
}

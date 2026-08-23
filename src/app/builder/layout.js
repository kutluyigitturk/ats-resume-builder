import { requireUser } from "@/lib/session";

// The builder is behind the same gate as the dashboard. It is also the only
// caller of /api/generate-pdf, which now refuses anonymous requests - leaving
// the page open would have meant an editor that cannot export.
export default async function BuilderLayout({ children }) {
  await requireUser();

  return children;
}

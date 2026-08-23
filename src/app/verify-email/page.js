import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";

const cardShadow = "0 1px 2px rgba(23,23,27,0.03), 0 12px 32px -14px rgba(23,23,27,0.12)";

const COPY = {
  verified: {
    heading: "Email verified",
    body: "Your address is confirmed. You can log in now.",
  },
  expired: {
    heading: "Link expired",
    body: "This link is no longer valid. Log in and request a new one.",
  },
  // Someone who typed or bookmarked the bare address has not had anything go
  // wrong, and telling them a link failed would send them looking for a fault
  // that isn't there.
  none: {
    heading: "Nothing to confirm here",
    body: "Open the link from your confirmation email, or log in to request a new one.",
  },
};

// Purely the result screen. The token is spent by /api/auth/verify-email,
// which redirects here with the outcome.
export default async function VerifyEmailPage({ searchParams }) {
  const { status, token } = await searchParams;

  // Links mailed before the token moved to the API route still point here.
  // Handing them on keeps every address that was already invited working,
  // instead of showing "expired" for a token that is perfectly valid.
  if (!status && token) {
    redirect(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
  }

  const copy = COPY[status] ?? COPY.none;

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#f6f6f4] px-5 py-20"
      style={{ fontFamily: "var(--font-geist), sans-serif" }}
    >
      <div className="absolute top-7 left-8">
        <Logo />
      </div>

      <div
        className="w-full max-w-[400px] rounded-2xl border border-[#e6e6e3] bg-white p-9 text-center"
        style={{ boxShadow: cardShadow }}
      >
        <h1 className="text-[25px] font-semibold tracking-tight text-slate-900">{copy.heading}</h1>
        <p className="mt-1.5 mb-6 text-[14.5px] text-slate-500">{copy.body}</p>

        <Link
          href="/login"
          className="flex h-[47px] w-full items-center justify-center rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Go to log in
        </Link>
      </div>
    </main>
  );
}

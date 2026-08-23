import Link from "next/link";
import Logo from "@/components/Logo";
import { getCurrentUserQuietly } from "@/lib/session";

// The page idea, drawn in the product's own vocabulary: a sheet that runs out
// of content. Decorative, so it carries no accessible name.
function EmptySheet() {
  return (
    <svg
      width="72"
      height="92"
      viewBox="0 0 72 92"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="text-slate-300"
      aria-hidden="true"
    >
      <rect x="0.75" y="0.75" width="70.5" height="90.5" rx="6" />
      <path d="M14 20h44M14 30h44M14 40h44M14 50h44M14 60h44" />
      <path d="M14 74h26M14 84h14" />
    </svg>
  );
}

// Shown for any address that does not exist. No card: a card is the shape of a
// form, and the eye reads the shape before the words - which is what made this
// page look like the login screen with different text.
export default async function NotFound() {
  // The signed-out visitor who mistypes a URL is the common case here, and
  // /dashboard would bounce them to a password field after promising them
  // their resumes.
  const user = await getCurrentUserQuietly();

  const href = user ? "/dashboard" : "/";
  const label = user ? "Go to my resumes" : "Back to the home page";

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#f6f6f4] px-5 py-20 text-center"
      style={{ fontFamily: "var(--font-geist), sans-serif" }}
    >
      <div className="absolute top-7 left-8">
        <Logo />
      </div>

      <EmptySheet />

      <p
        className="mt-6 text-[11.5px] font-semibold tracking-[0.08em] text-slate-400 uppercase"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        404
      </p>

      <h1
        className="mt-3.5 text-[28px] font-bold tracking-tight text-slate-900"
        style={{ fontFamily: "var(--font-sora), sans-serif" }}
      >
        This page does not exist
      </h1>

      <p className="mt-2.5 max-w-[360px] text-[15px] leading-[1.6] text-pretty text-slate-500">
        The link may be out of date, or the address may have a typo in it. Your resumes are where
        you left them.
      </p>

      <Link
        href={href}
        className="mt-7 inline-flex h-11 items-center rounded-xl bg-blue-700 px-6 text-[14.5px] font-semibold text-white transition-colors hover:bg-blue-800"
      >
        {label}
      </Link>
    </main>
  );
}

import Link from "next/link";
import Logo from "@/components/Logo";

const cardShadow = "0 1px 2px rgba(23,23,27,0.03), 0 12px 32px -14px rgba(23,23,27,0.12)";

// Shown for any address that does not exist. Next's own 404 is unstyled and
// offers no way back, which strands anyone who mistypes a URL or follows an
// old link.
export default function NotFound() {
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
        <h1 className="text-[25px] font-semibold tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-1.5 mb-6 text-[14.5px] leading-relaxed text-slate-500">
          The address you opened does not exist. Check the link, or go back to your resumes.
        </p>

        <Link
          href="/dashboard"
          className="flex h-[47px] w-full items-center justify-center rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Go to my resumes
        </Link>

        <Link
          href="/"
          className="mt-3 inline-block text-[13.5px] font-medium text-blue-700 hover:text-blue-800"
        >
          Back to the home page
        </Link>
      </div>
    </main>
  );
}

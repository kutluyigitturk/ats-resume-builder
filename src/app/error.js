"use client";

import { useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const cardShadow = "0 1px 2px rgba(23,23,27,0.03), 0 12px 32px -14px rgba(23,23,27,0.12)";

// Catches anything thrown while rendering a page. Without it a hiccup in the
// session lookup - a database that pauses for a moment - puts the visitor on a
// white screen reading "Application error" with a hash and no way forward.
export default function Error({ error, reset }) {
  useEffect(() => {
    // Server-side failures are already in the server log with this digest;
    // this records the client half so the two can be matched up.
    console.error("Page failed to render:", error?.digest ?? error);
  }, [error]);

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
        <h1 className="text-[25px] font-semibold tracking-tight text-slate-900">
          This page did not load
        </h1>
        {/* Never error.message: it can carry connection strings and internals,
            and it tells the visitor nothing they can act on. */}
        <p className="mt-1.5 mb-6 text-[14.5px] leading-relaxed text-slate-500">
          Something on our side failed while loading it. Try again — if it keeps happening, your
          resumes are safe and waiting.
        </p>

        <button
          type="button"
          onClick={reset}
          className="flex h-[47px] w-full items-center justify-center rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Try again
        </button>

        <Link
          href="/dashboard"
          className="mt-3 inline-block text-[13.5px] font-medium text-blue-700 hover:text-blue-800"
        >
          Go to my resumes
        </Link>
      </div>
    </main>
  );
}

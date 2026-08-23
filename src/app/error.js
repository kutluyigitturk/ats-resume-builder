"use client";

import { useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

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
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#f6f6f4] px-5 py-20 text-center"
      style={{ fontFamily: "var(--font-geist), sans-serif" }}
    >
      <div className="absolute top-7 left-8">
        <Logo />
      </div>

      {/* The digest, not "500": it matches the server log line exactly, so a
          report about this page can be traced. A status code invites a bug
          report that says nothing. */}
      {error?.digest && (
        <p
          className="text-[11.5px] font-semibold tracking-[0.08em] text-slate-400 uppercase"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          Error {error.digest}
        </p>
      )}

      <h1
        className="mt-3.5 text-[28px] font-bold tracking-tight text-slate-900"
        style={{ fontFamily: "var(--font-sora), sans-serif" }}
      >
        This page did not load
      </h1>

      {/* Never error.message: it can carry connection strings and internals,
          and it tells the visitor nothing they can act on. */}
      <p className="mt-2.5 max-w-[360px] text-[15px] leading-[1.6] text-pretty text-slate-500">
        Something on our side failed while loading it. Your resumes are safe. Try again in a moment.
      </p>

      <button
        type="button"
        onClick={reset}
        className="mt-7 inline-flex h-11 items-center rounded-xl bg-blue-700 px-6 text-[14.5px] font-semibold text-white transition-colors hover:bg-blue-800"
      >
        Try again
      </button>

      {/* Grey and underlined rather than a second blue link - two blue things
          at two sizes is most of what made these pages read as forms. This one
          goes home rather than to the dashboard, because a client component
          cannot know whether the visitor is signed in. */}
      <Link
        href="/"
        className="mt-4 text-[13.5px] text-slate-500 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-700"
      >
        Back to the home page
      </Link>
    </main>
  );
}

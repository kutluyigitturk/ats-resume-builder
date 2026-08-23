"use client";

import { GoogleIcon } from "@/components/SocialIcons";

// Google sign-in is not wired up yet. Rather than a button that looks ready
// and does nothing when clicked, this one says so: disabled, dimmed, and
// carrying the word "Soon" as text rather than only as a colour.
export default function SocialSoon({ label }) {
  return (
    <button
      type="button"
      disabled
      className="flex h-[46px] w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border border-[#e2e2df] bg-[#fbfbfa] text-[14.5px] font-medium text-slate-400"
    >
      <span className="opacity-45">
        <GoogleIcon />
      </span>
      {label}
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
        Soon
      </span>
    </button>
  );
}

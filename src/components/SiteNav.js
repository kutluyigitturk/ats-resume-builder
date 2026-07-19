"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import { accent } from "@/config/brand";

const body = { fontFamily: "var(--font-geist), sans-serif" };

const tools = [
  { label: "Resume Builder", href: "/dashboard" },
  { label: "Cover Letter Generator", href: "#", soon: true },
];

function ToolsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[15px] font-medium text-slate-500 transition-colors duration-200 hover:text-slate-900"
      >
        Tools
        <svg
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2"
          style={{ boxShadow: "0 12px 32px -12px rgba(23,23,27,0.18)" }}
        >
          {tools.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14.5px] font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-blue-700"
            >
              {t.label}
              {t.soon && (
                <span className="ml-3 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                  Soon
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SiteNav() {
  return (
    <Navbar>
      <Logo />
      <div className="hidden items-center gap-1 md:flex" style={body}>
        <ToolsDropdown />
        <Link
          href="/pricing"
          className="rounded-lg px-3.5 py-2 text-[15px] font-medium text-slate-500 transition-colors duration-200 hover:text-slate-900"
        >
          Pricing
        </Link>
      </div>
      <div className="flex items-center gap-2.5" style={body}>
        <Link
          href="/login"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[15px] font-medium text-slate-900 transition-colors duration-200 hover:bg-slate-50"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-xl px-4 py-2 text-[15px] font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
          style={{ backgroundColor: accent.ink }}
        >
          Sign up
        </Link>
      </div>
    </Navbar>
  );
}
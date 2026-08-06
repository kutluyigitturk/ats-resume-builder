"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const cardShadow = "0 1px 2px rgba(23,23,27,0.03), 0 12px 32px -14px rgba(23,23,27,0.12)";
const inputCls =
  "h-[46px] w-full rounded-xl border border-[#d6d6d2] bg-[#fbfbfa] px-3.5 text-[14.5px] text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-blue-700/15";
const labelCls = "mb-1.5 block text-[13px] font-medium text-slate-500";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Deliberately ignored. The confirmation below is shown either way, so
      // this page never reveals whether the address exists.
    } finally {
      setSent(true);
      setSubmitting(false);
    }
  }

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#f6f6f4] px-5 py-20"
      style={{ fontFamily: "var(--font-geist), sans-serif" }}
    >
      <div className="absolute top-7 left-8">
        <Logo />
      </div>

      <div
        className="w-full max-w-[400px] rounded-2xl border border-[#e6e6e3] bg-white p-9"
        style={{ boxShadow: cardShadow }}
      >
        {sent ? (
          <div className="text-center">
            <h1 className="text-[25px] font-semibold tracking-tight text-slate-900">
              Check your inbox
            </h1>
            <p className="mt-1.5 mb-6 text-[14.5px] leading-relaxed text-slate-500">
              If an account exists for <span className="font-medium text-slate-700">{email}</span>,
              a reset link is on its way. It expires in an hour.
            </p>
            <Link
              href="/login"
              className="flex h-[47px] w-full items-center justify-center rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800"
            >
              Back to log in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-center text-[25px] font-semibold tracking-tight text-slate-900">
              Forgot your password?
            </h1>
            <p className="mt-1.5 mb-6 text-center text-[14.5px] text-slate-500">
              We&apos;ll email you a link to set a new one.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-[15px]">
                <label htmlFor="email" className={labelCls}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  className={inputCls}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 h-[47px] w-full rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p className="mt-[22px] text-center text-[14px] text-slate-500">
              Remembered it?{" "}
              <Link href="/login" className="font-medium text-blue-700 hover:text-blue-800">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}

"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

const cardShadow = "0 1px 2px rgba(23,23,27,0.03), 0 12px 32px -14px rgba(23,23,27,0.12)";
const inputCls =
  "h-[46px] w-full rounded-xl border border-[#d6d6d2] bg-[#fbfbfa] px-3.5 text-[14.5px] text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-blue-700/15";
const labelCls = "mb-1.5 block text-[13px] font-medium text-slate-500";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setDone(true);
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <h1 className="text-[25px] font-semibold tracking-tight text-slate-900">
          Password changed
        </h1>
        <p className="mt-1.5 mb-6 text-[14.5px] leading-relaxed text-slate-500">
          You have been signed out everywhere else. Log in with your new password.
        </p>
        <Link
          href="/login"
          className="flex h-[47px] w-full items-center justify-center rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Go to log in
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center text-[25px] font-semibold tracking-tight text-slate-900">
        Set a new password
      </h1>
      <p className="mt-1.5 mb-6 text-center text-[14.5px] text-slate-500">
        Choose something you haven&apos;t used here before.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-[15px]">
          <label htmlFor="password" className={labelCls}>
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className={inputCls}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-[15px]">
          <label htmlFor="confirm" className={labelCls}>
            Confirm password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Type it again"
            className={inputCls}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {error && (
          <p className="mb-[15px] rounded-xl bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 h-[47px] w-full rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Change password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
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
        {/* useSearchParams needs a Suspense boundary during prerendering. */}
        <Suspense fallback={<p className="text-center text-[14.5px] text-slate-500">Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}

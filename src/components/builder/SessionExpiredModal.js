"use client";

import { useRef, useState } from "react";
import AuthField from "@/components/AuthField";
import Modal from "@/components/ui/Modal";
import { shake } from "@/lib/shake";

// A session that runs out mid-edit used to end in a red line under the toolbar
// and a trip to /login. Signing back in here keeps the user in their resume,
// and the export they asked for runs the moment it succeeds.
export default function SessionExpiredModal({ onClose, onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const emailRef = useRef(null);
  const errorRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Could not sign you in. Try again.");
        shake(errorRef.current);
        return;
      }

      onSignedIn();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      shake(errorRef.current);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      labelledBy="session-expired-title"
      backdropClass="backdrop:bg-black/25 backdrop:backdrop-blur-sm"
    >
      <div
        className="mx-4 w-full max-w-[380px] rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl"
        style={{ fontFamily: "var(--font-geist), sans-serif" }}
      >
        <h2
          id="session-expired-title"
          className="text-[19px] font-semibold tracking-tight text-slate-900"
        >
          Your session has ended
        </h2>
        <p className="mt-1.5 mb-5 text-[13.5px] leading-relaxed text-slate-500">
          Sign in again to download your PDF. Your resume is safe — nothing you typed is lost.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <AuthField
            ref={emailRef}
            autoFocus
            id="session-email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthField
            id="session-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p
              ref={errorRef}
              role="alert"
              className="mb-[15px] rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700"
            >
              {error}
            </p>
          )}

          <div className="mt-1 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-[44px] flex-1 rounded-xl border border-slate-200 text-[14px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Not now
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-[44px] flex-[1.4] rounded-xl bg-blue-700 text-[14px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in and download"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

"use client";

import { useRef, useState } from "react";
import AuthField from "@/components/AuthField";
import Modal from "@/components/ui/Modal";
import { useAccountEmail } from "@/components/AccountEmail";
import { shake } from "@/lib/shake";

// A session that runs out mid-edit used to end in a red line under the toolbar
// and a trip to /login. Signing back in here keeps the user in their resume,
// and the export they asked for finishes before the dialog closes.
export default function SessionExpiredModal({ onClose, onSignedIn }) {
  const knownEmail = useAccountEmail();

  const [email, setEmail] = useState(knownEmail ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [stage, setStage] = useState("idle"); // idle | signing | exporting

  const passwordRef = useRef(null);
  const errorRef = useRef(null);

  const busy = stage !== "idle";

  function fail(message) {
    setError(message);
    shake(errorRef.current);
    // Keep what they typed and select it: a typo should cost one retype, not
    // the whole password.
    passwordRef.current?.focus();
    passwordRef.current?.select();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setStage("signing");

    let response;
    try {
      response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      setStage("idle");
      fail("Could not reach the server. Check your connection and try again.");
      return;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setStage("idle");
      // The vague "Email or password is incorrect" exists to stop anyone
      // learning which addresses are registered. Here the server already told
      // this browser who the user is and the address cannot even be edited, so
      // the vague version only confuses. Everything else passes through.
      fail(
        response.status === 401
          ? "That password is not right."
          : (data?.error ?? "Could not sign you in. Try again.")
      );
      return;
    }

    setStage("exporting");
    const exportError = await onSignedIn();

    if (exportError) {
      setStage("idle");
      setError(exportError);
      shake(errorRef.current);
    }
  }

  return (
    <Modal
      open
      onClose={busy ? () => {} : onClose}
      labelledBy="session-expired-title"
      initialFocusRef={passwordRef}
      backdropClass="backdrop:bg-[rgba(23,23,27,0.30)] backdrop:backdrop-blur-[2px]"
    >
      <div
        className="mx-4 w-full max-w-[400px] rounded-2xl border border-[#e6e6e3] bg-white p-8"
        style={{
          fontFamily: "var(--font-geist), sans-serif",
          boxShadow: "0 2px 4px rgba(23,23,27,0.04), 0 28px 64px -24px rgba(23,23,27,0.40)",
        }}
      >
        <h2
          id="session-expired-title"
          className="text-[19px] font-semibold tracking-tight text-slate-900"
        >
          Your session has ended
        </h2>
        {/* Reassurance first: "is my work gone" fires before anything else is
            read, so it cannot arrive as a clause after the instruction. */}
        <p className="mt-2 mb-5 text-[13.5px] leading-relaxed text-slate-500">
          Your resume is safe, nothing you typed is lost. Sign in again to finish your download.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {knownEmail ? (
            <div className="mb-[15px]">
              <label
                htmlFor="session-email"
                className="mb-1.5 block text-[13px] font-medium text-slate-500"
              >
                Email
              </label>
              <div className="flex h-[46px] w-full items-center justify-between rounded-xl border border-[#d6d6d2] bg-[#fbfbfa] px-3.5">
                {/* A real readonly input rather than text: a password-only form
                    still needs the address present for password managers. */}
                <input
                  id="session-email"
                  type="email"
                  value={knownEmail}
                  readOnly
                  tabIndex={-1}
                  autoComplete="username"
                  className="min-w-0 flex-1 truncate border-none bg-transparent p-0 text-[14.5px] text-slate-700 outline-none"
                />
                {/* A new tab on purpose: this one holds the resume, and letting
                    a different account sign in here would hand them the
                    previous person's work. */}
                <a
                  href="/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 shrink-0 text-[12.5px] font-medium text-blue-700 hover:text-blue-800"
                >
                  Not you?
                </a>
              </div>
            </div>
          ) : (
            <AuthField
              id="session-email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          <AuthField
            ref={passwordRef}
            id="session-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Without this the dialog is a dead end for anyone who cannot
              remember their password, while the login page it mirrors offers a
              way out. */}
          <div className="-mt-1.5 mb-4 flex justify-end">
            <a
              href="/forgot-password"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium text-blue-700 hover:text-blue-800"
            >
              Forgot password?
            </a>
          </div>

          {error && (
            <p
              ref={errorRef}
              role="alert"
              className="mb-[15px] rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700"
            >
              {error}
            </p>
          )}

          {/* One column, not two halves: someone who clicked Download wants the
              download. There is no fork here to weight evenly. */}
          <button
            type="submit"
            disabled={busy}
            className="h-[46px] w-full rounded-xl bg-blue-700 text-[14.5px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {stage === "signing"
              ? "Signing in…"
              : stage === "exporting"
                ? "Preparing your PDF…"
                : "Sign in and download"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="mx-auto mt-3 block text-[13.5px] font-medium text-slate-500 transition-colors hover:text-slate-700 disabled:opacity-40"
          >
            Not now
          </button>
        </form>
      </div>
    </Modal>
  );
}

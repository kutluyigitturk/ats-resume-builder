"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import AuthField from "@/components/AuthField";
import SocialSoon from "@/components/SocialSoon";
import { checkPassword } from "@/lib/password";
import { shake } from "@/lib/shake";

const cardShadow = "0 1px 2px rgba(23,23,27,0.03), 0 12px 32px -14px rgba(23,23,27,0.12)";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 80;

// The order the fields appear in, which is also the order they are reported.
const FIELDS = ["name", "email", "password"];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);
  const [resendState, setResendState] = useState("idle");
  const [resendError, setResendError] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const refs = { name: nameRef, email: emailRef, password: passwordRef };

  // Moving focus to the first bad field is what actually announces the
  // problem to a screen reader; the shake is only for people watching.
  function reportFirst(fieldErrors) {
    const first = FIELDS.find((field) => fieldErrors[field]);
    if (!first) return;

    const element = refs[first].current;
    element?.focus();
    shake(element);
  }

  function validate() {
    const next = {};

    if (!name.trim()) {
      next.name = "Enter your name.";
    } else if (name.trim().length > MAX_NAME_LENGTH) {
      next.name = `Use ${MAX_NAME_LENGTH} characters or fewer.`;
    }

    if (!email.trim()) {
      next.email = "Enter your email address.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = "Enter a valid email address, like name@example.com.";
    }

    // The same function the server uses, so the form can never promise a
    // password the server will turn down.
    const passwordError = checkPassword(password, email);
    if (passwordError) next.password = passwordError;

    return next;
  }

  function clearError(field) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  // Counts the cooldown down one second at a time. The state change happens in
  // the timer callback rather than in the effect body, so this does not cascade
  // a render on every pass.
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // The endpoint wants the password as well as the address, so it cannot be
  // used to mail a stranger. Both are still in state from the form above.
  async function handleResend() {
    setResendState("sending");
    setResendError(null);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setResendState("idle");
        setResendError(data?.error ?? "Could not send it. Try again in a moment.");
        return;
      }

      setResendState("sent");
      // The server silently ignores a second request inside its own one-minute
      // window, so the button stays down for the same minute. Otherwise it
      // would keep reporting mail that was never sent.
      setCooldown(60);
    } catch {
      setResendState("idle");
      setResendError("Could not reach the server. Check your connection and try again.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);

    const fieldErrors = validate();
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      reportFirst(fieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // The server names the field its message belongs to. Anything without
        // one - a rate limit, an outage - has no field to sit next to.
        if (data.field) {
          const serverErrors = { [data.field]: data.error };
          setErrors(serverErrors);
          reportFirst(serverErrors);
        } else {
          setFormError(data.error ?? "Unable to create your account. Try again in a moment.");
        }
        return;
      }

      setCreated(true);
    } catch {
      setFormError("Could not reach the server. Check your connection and try again.");
    } finally {
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
        {created ? (
          <div className="text-center">
            <h1 className="text-[25px] font-semibold tracking-tight text-slate-900">
              Check your inbox
            </h1>
            <p className="mt-1.5 mb-6 text-[14.5px] leading-relaxed text-slate-500">
              We sent a confirmation link to{" "}
              <span className="font-medium text-slate-700">{email}</span>. Open it to finish setting
              up your account.
            </p>
            <Link
              href="/login"
              className="flex h-[47px] w-full items-center justify-center rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800"
            >
              Go to log in
            </Link>

            {/* Without this the screen is a dead end: mail that never arrives
                leaves the account unusable and the page offers no way out. */}
            <div className="mt-5 border-t border-[#eeeeeb] pt-4 text-[13.5px]">
              {resendState === "sent" ? (
                <p className="text-slate-500" role="status">
                  Sent again. It can take a minute to arrive - check your spam folder too.
                </p>
              ) : (
                <p className="text-slate-500">
                  Didn&apos;t get it?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendState === "sending" || cooldown > 0}
                    className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800 disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
                  >
                    {resendState === "sending" ? "Sending…" : "Send it again"}
                  </button>
                </p>
              )}

              {cooldown > 0 && (
                <p className="mt-1.5 text-[13px] text-slate-400">
                  You can ask for another link in {cooldown}s.
                </p>
              )}

              {resendError && (
                <p role="alert" className="mt-2 text-[13px] text-red-700">
                  {resendError}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-center text-[25px] font-semibold tracking-tight text-slate-900">
              Create your account
            </h1>
            <p className="mt-1.5 mb-6 text-center text-[14.5px] text-slate-500">
              Start building a resume that gets read.
            </p>

            <SocialSoon label="Sign up with Google" />

            <div className="my-[22px] flex items-center gap-3.5">
              <div className="h-px flex-1 bg-[#e6e6e3]" />
              <span className="text-[13px] text-slate-400">or</span>
              <div className="h-px flex-1 bg-[#e6e6e3]" />
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <AuthField
                ref={nameRef}
                id="name"
                label="Your name"
                type="text"
                autoComplete="name"
                placeholder="Kutlu Türkyiğit"
                maxLength={MAX_NAME_LENGTH}
                value={name}
                error={errors.name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError("name");
                }}
              />

              <AuthField
                ref={emailRef}
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                error={errors.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
              />

              <AuthField
                ref={passwordRef}
                id="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                error={errors.password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                }}
              />

              {formError && (
                <p
                  role="alert"
                  className="mb-[15px] rounded-xl bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-700"
                >
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 h-[47px] w-full rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="mx-auto mt-4 max-w-[300px] text-center text-[12px] leading-relaxed text-slate-400">
              By signing up, you agree to our{" "}
              <a
                href="https://tally.so/help/terms-and-privacy"
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 underline underline-offset-2"
              >
                Terms &amp; Privacy
              </a>
              .
            </p>

            <p className="mt-4 text-center text-[14px] text-slate-500">
              Already have an account?{" "}
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

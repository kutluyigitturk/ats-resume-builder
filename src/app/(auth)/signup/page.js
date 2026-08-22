"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import AuthField from "@/components/AuthField";
import { GoogleIcon } from "@/components/SocialIcons";
import { shake } from "@/lib/shake";

const cardShadow = "0 1px 2px rgba(23,23,27,0.03), 0 12px 32px -14px rgba(23,23,27,0.12)";
const socialBtn =
  "flex h-[46px] w-full items-center justify-center gap-2.5 rounded-xl border border-[#d6d6d2] bg-white text-[14.5px] font-medium text-slate-900 transition-colors hover:bg-slate-50";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Maps a server message onto the field it belongs to. Anything not listed
// stays at form level.
const FIELD_FOR_ERROR = {
  "Enter a valid email address.": "email",
  "An account with this email already exists.": "email",
  "Password must be at least 8 characters.": "password",
};

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const refs = { email: emailRef, password: passwordRef };

  // Moving focus to the first bad field is what actually announces the
  // problem to a screen reader; the shake is only for people watching.
  function reportFirst(fieldErrors) {
    const first = ["email", "password"].find((name) => fieldErrors[name]);
    if (!first) return;

    const element = refs[first].current;
    element?.focus();
    shake(element);
  }

  function validate() {
    const next = {};

    if (!email.trim()) {
      next.email = "Enter your email address.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = "Enter a valid email address, like name@example.com.";
    }

    if (!password) {
      next.password = "Choose a password.";
    } else if (password.length < 8) {
      next.password = "Choose a password with at least 8 characters.";
    }

    return next;
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
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const field = FIELD_FOR_ERROR[data.error];

        if (field) {
          const serverErrors = { [field]: data.error };
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
          </div>
        ) : (
          <>
            <h1 className="text-center text-[25px] font-semibold tracking-tight text-slate-900">
              Create your account
            </h1>
            <p className="mt-1.5 mb-6 text-center text-[14.5px] text-slate-500">
              Start building a resume that gets read.
            </p>

            <button type="button" className={socialBtn}>
              <GoogleIcon /> Sign up with Google
            </button>

            <div className="my-[22px] flex items-center gap-3.5">
              <div className="h-px flex-1 bg-[#e6e6e3]" />
              <span className="text-[13px] text-slate-400">or</span>
              <div className="h-px flex-1 bg-[#e6e6e3]" />
            </div>

            <form onSubmit={handleSubmit} noValidate>
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
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
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
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
              />

              {formError && (
                <p className="mb-[15px] rounded-xl bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-700">
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

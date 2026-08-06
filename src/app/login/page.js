"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import AuthField from "@/components/AuthField";
import { GoogleIcon } from "@/components/SocialIcons";
import { shake } from "@/lib/shake";

const cardShadow = "0 1px 2px rgba(23,23,27,0.03), 0 12px 32px -14px rgba(23,23,27,0.12)";
const socialBtn =
  "flex h-[46px] w-full items-center justify-center gap-2.5 rounded-xl border border-[#d6d6d2] bg-white text-[14.5px] font-medium text-slate-900 transition-colors hover:bg-slate-50";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resent, setResent] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const formErrorRef = useRef(null);
  const refs = { email: emailRef, password: passwordRef };

  function reportFirst(fieldErrors) {
    const first = ["email", "password"].find((name) => fieldErrors[name]);
    if (!first) return;

    const element = refs[first].current;
    element?.focus();
    shake(element);
  }

  // Only the empty cases are checked here. Whether the credentials are right
  // is the server's answer, and it deliberately never says which half failed.
  function validate() {
    const next = {};
    if (!email.trim()) next.email = "Enter your email address.";
    if (!password) next.password = "Enter your password.";
    return next;
  }

  async function handleResend() {
    setResent(true);

    await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).catch(() => {});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);
    setNeedsVerification(false);
    setResent(false);

    const fieldErrors = validate();
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      reportFirst(fieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Kept at form level on purpose. Pinning "incorrect" to the email or
        // the password field would tell an attacker which one was right.
        setFormError(data.error ?? "Unable to log you in. Try again in a moment.");
        setNeedsVerification(Boolean(data.needsVerification));
        shake(formErrorRef.current);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setFormError("Could not reach the server. Check your connection and try again.");
      shake(formErrorRef.current);
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
        <h1 className="text-center text-[25px] font-semibold tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p className="mt-1.5 mb-6 text-center text-[14.5px] text-slate-500">
          Log in to keep building.
        </p>

        <button type="button" className={socialBtn}>
          <GoogleIcon /> Continue with Google
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
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            error={errors.password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
          />

          <div className="-mt-1.5 mb-4 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-[13px] font-medium text-blue-700 hover:text-blue-800"
            >
              Forgot password?
            </Link>
          </div>

          {formError && (
            <div
              ref={formErrorRef}
              // Announced as soon as it appears, without moving focus away
              // from the field the user is still in.
              role="alert"
              className="mb-[15px] rounded-xl bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-700"
            >
              <p>{formError}</p>
              {needsVerification &&
                (resent ? (
                  <p className="mt-1.5 text-red-600">Sent. Check your inbox for the new link.</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="mt-1.5 font-semibold underline underline-offset-2 hover:text-red-800"
                  >
                    Send the link again
                  </button>
                ))}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="h-[47px] w-full rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-[22px] text-center text-[14px] text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-blue-700 hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

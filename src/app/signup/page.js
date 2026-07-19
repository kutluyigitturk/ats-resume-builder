import Link from "next/link";
import Logo from "@/components/Logo";
import { GoogleIcon } from "@/components/SocialIcons";

const cardShadow = "0 1px 2px rgba(23,23,27,0.03), 0 12px 32px -14px rgba(23,23,27,0.12)";
const socialBtn =
  "flex h-[46px] w-full items-center justify-center gap-2.5 rounded-xl border border-[#d6d6d2] bg-white text-[14.5px] font-medium text-slate-900 transition-colors hover:bg-slate-50";
const inputCls =
  "h-[46px] w-full rounded-xl border border-[#d6d6d2] bg-[#fbfbfa] px-3.5 text-[14.5px] text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-blue-700/15";
const labelCls = "mb-1.5 block text-[13px] font-medium text-slate-500";

export default function SignupPage() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#f6f6f4] px-5 py-20"
      style={{ fontFamily: "var(--font-geist), sans-serif" }}
    >
      <div className="absolute left-8 top-7">
        <Logo />
      </div>

      <div
        className="w-full max-w-[400px] rounded-2xl border border-[#e6e6e3] bg-white p-9"
        style={{ boxShadow: cardShadow }}
      >
        <h1 className="text-center text-[25px] font-semibold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mb-6 mt-1.5 text-center text-[14.5px] text-slate-500">
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

        <div className="mb-[15px]">
          <label className={labelCls}>Email</label>
          <input type="email" placeholder="you@email.com" className={inputCls} />
        </div>
        <div className="mb-[15px]">
          <label className={labelCls}>Password</label>
          <input type="password" placeholder="Create a password" className={inputCls} />
        </div>

        <button
          type="button"
          className="mt-1 h-[47px] w-full rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Create account
        </button>

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
      </div>
    </main>
  );
}
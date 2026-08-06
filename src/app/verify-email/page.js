import Link from "next/link";
import Logo from "@/components/Logo";
import { prisma } from "@/lib/prisma";
import { checkToken } from "@/lib/tokens";

const cardShadow = "0 1px 2px rgba(23,23,27,0.03), 0 12px 32px -14px rgba(23,23,27,0.12)";

export default async function VerifyEmailPage({ searchParams }) {
  const { token } = await searchParams;
  const userId = await checkToken(token, "EMAIL_VERIFY");

  if (userId) {
    // The `emailVerified: null` condition keeps the original timestamp if the
    // link is opened again, and makes running this twice harmless.
    await prisma.user.updateMany({
      where: { id: userId, emailVerified: null },
      data: { emailVerified: new Date() },
    });
  }

  const verified = Boolean(userId);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#f6f6f4] px-5 py-20"
      style={{ fontFamily: "var(--font-geist), sans-serif" }}
    >
      <div className="absolute top-7 left-8">
        <Logo />
      </div>

      <div
        className="w-full max-w-[400px] rounded-2xl border border-[#e6e6e3] bg-white p-9 text-center"
        style={{ boxShadow: cardShadow }}
      >
        <h1 className="text-[25px] font-semibold tracking-tight text-slate-900">
          {verified ? "Email verified" : "Link expired"}
        </h1>
        <p className="mt-1.5 mb-6 text-[14.5px] text-slate-500">
          {verified
            ? "Your address is confirmed. You can log in now."
            : "This link is no longer valid. Log in and request a new one."}
        </p>

        <Link
          href="/login"
          className="flex h-[47px] w-full items-center justify-center rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Go to log in
        </Link>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";

// KodeKloud-style palette (intentionally distinct from the site's blue).
const BLUE = "#14a6f1";
const INK = "#0b1220";
const GRAY = "#5b6472";
const MUTED = "#8a93a0";

const plans = [
  {
    name: "Standard",
    desc: "Best for building a clean, ATS-ready resume, fast.",
    perMoAnnual: "8.90",
    perMoMonthly: "11.90",
    annualTotal: "106.80",
    was: "142.80",
    off: 25,
    popular: false,
    featuresHeading: "What it covers:",
    features: [
      "Up to 3 resumes",
      "All ATS-friendly templates",
      "Live A4 preview",
      "Text-based PDF export",
      "Basic style controls",
      "Completeness score",
    ],
  },
  {
    name: "Pro",
    desc: "Best for job seekers applying to many roles, with unlimited resumes.",
    perMoAnnual: "14.90",
    perMoMonthly: "19.90",
    annualTotal: "178.80",
    was: "238.80",
    off: 25,
    popular: true,
    featuresHeading: "Everything in Standard, plus:",
    features: [
      "Unlimited resumes",
      "Full style control (fonts, margins, spacing, section order)",
      "Professional template",
      "Priority PDF export, no watermark",
      "Tailor a resume per role (manual)",
    ],
  },
  {
    name: "AI",
    desc: "Best for those who want AI to help write and sharpen their resume.",
    perMoAnnual: "29.90",
    perMoMonthly: "39.90",
    annualTotal: "358.80",
    was: "478.80",
    off: 25,
    popular: false,
    featuresHeading: "Everything in Pro, plus:",
    features: [
      "AI resume writing & bullet improvement",
      "AI Cover Letter Generator",
      "AI tailoring to a job description",
      "AI resume analysis & ATS match score",
    ],
  },
];

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={BLUE}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "var(--font-geist), sans-serif" }}>
      <SiteNav />

      <div className="mx-auto max-w-6xl px-6 pt-36 pb-24">
        <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: INK }}>
          Plans &amp; Pricing
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-[15px] leading-relaxed" style={{ color: GRAY }}>
          Start free — your first resume is on us. No credit card required.
        </p>
        <div className="mt-5 flex justify-center">
          <Link
            href="/signup"
            className="rounded-full px-6 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BLUE }}
          >
            Sign up free
          </Link>
        </div>

        {/* Billing toggle */}
        <div className="mt-9 flex justify-center">
          <div className="inline-flex rounded-full bg-[#eef1f5] p-1">
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className="rounded-full px-4 py-2.5 text-[12.5px] font-semibold transition-colors sm:px-5 sm:text-[14px]"
              style={annual ? { backgroundColor: BLUE, color: "#fff" } : { color: MUTED }}
            >
              Pay Annually (Save up to 25%)
            </button>
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className="rounded-full px-4 py-2.5 text-[12.5px] font-semibold transition-colors sm:px-5 sm:text-[14px]"
              style={!annual ? { backgroundColor: BLUE, color: "#fff" } : { color: MUTED }}
            >
              Pay Monthly
            </button>
          </div>
        </div>
        <p className="mt-3 text-center text-[12px] italic" style={{ color: MUTED }}>
          *terms and conditions apply
        </p>

        {/* Plan cards */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className="relative flex flex-col overflow-hidden rounded-2xl bg-white"
              style={{ border: p.popular ? `1.5px solid ${BLUE}` : "1px solid #e5e7eb" }}
            >
              <div
                className="flex h-9 items-center justify-center text-[13px] font-bold text-white"
                style={{ backgroundColor: p.popular ? BLUE : "transparent" }}
              >
                {p.popular ? "Most Popular" : ""}
              </div>

              <div className="flex flex-1 flex-col p-7">
                <h2 className="text-2xl font-bold" style={{ color: INK }}>
                  {p.name}
                </h2>
                <p className="mt-3 min-h-[54px] text-[13.5px] leading-relaxed" style={{ color: GRAY }}>
                  {p.desc}
                </p>

                {/* Price */}
                <div className="mt-4 flex items-end justify-between">
                  <div className="text-[30px] font-bold leading-none" style={{ color: INK }}>
                    USD {annual ? p.perMoAnnual : p.perMoMonthly}
                    <span className="text-[15px] font-medium" style={{ color: MUTED }}>
                      /mo
                    </span>
                  </div>
                  <div className="text-right text-[12px] leading-tight" style={{ color: MUTED }}>
                    {annual ? (
                      <>
                        USD {p.annualTotal}
                        <br />
                        billed annually
                      </>
                    ) : (
                      <>
                        billed
                        <br />
                        monthly
                      </>
                    )}
                  </div>
                </div>

                {/* Was + Off (annual only) */}
                <div className="mt-4 flex h-6 items-center justify-between">
                  {annual && (
                    <>
                      <span className="text-[14px] line-through" style={{ color: "#94a3b8" }}>
                        USD {p.was}
                      </span>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[12px] font-semibold"
                        style={{ backgroundColor: "#e4f7ec", color: "#15a34a" }}
                      >
                        {p.off}% Off
                      </span>
                    </>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={`/signup?plan=${p.name.toLowerCase()}`}
                  className="mt-5 block w-full rounded-full py-3 text-center text-[14px] font-semibold transition-opacity hover:opacity-90"
                  style={
                    p.popular
                      ? { backgroundColor: BLUE, color: "#fff" }
                      : { backgroundColor: "#fff", color: BLUE, border: `1.5px solid ${BLUE}` }
                  }
                >
                  Subscribe
                </Link>
                <p className="mt-3 text-center text-[12px]" style={{ color: MUTED }}>
                  No commitment. Cancel anytime.
                </p>

                <div className="my-6 h-px w-full" style={{ backgroundColor: "#eef0f3" }} />

                {/* Features */}
                <p className="mb-4 text-[14px] font-bold" style={{ color: INK }}>
                  {p.featuresHeading}
                </p>
                <ul className="space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[13.5px] leading-snug" style={{ color: "#374151" }}>
                      <Check />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8 text-center text-[12px]" style={{ color: MUTED }}>
                  Local taxes may apply
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
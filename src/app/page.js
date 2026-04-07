"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import { RoughNotation } from "react-rough-notation";




/* ─── Scroll Reveal Hook ─────────────────────────── */

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────── */

function NavbarContent() {
  return (
    <>
      <Logo />
      <div className="flex items-center gap-1">
        <Link
          href="/dashboard"
          className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-slate-900"
        >
          Resume Builder
        </Link>
        <span className="cursor-default rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400">
          Cover Letter
        </span>
        <span className="cursor-default rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400">
          Pricing
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-slate-900">
          Log in
        </button>
        <Link
          href="/dashboard"
          className="btn-primary rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md"
        >
          Get Started
        </Link>
      </div>
    </>
  );
}

/* ─── Hero ───────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-48">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob-1 absolute -left-24 -top-24 h-[600px] w-[600px] rounded-full bg-blue-200/30 blur-[100px]" />
        <div className="blob-2 absolute -right-24 top-1/4 h-[500px] w-[500px] rounded-full bg-indigo-200/25 blur-[100px]" />
        <div className="blob-3 absolute -bottom-24 left-1/4 h-[400px] w-[400px] rounded-full bg-sky-100/30 blur-[80px]" />
        <div className="blob-2 absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/20 blur-[60px]" />
      </div>

      <div className="relative z-10 mx-auto w-full text-center">

        <Reveal delay={100}>
          <h1
            className="mb-6 font-bold leading-[1.1] tracking-tight text-slate-900 text-center"
            style={{ fontFamily: "Inter, 'Inter Fallback', sans-serif", fontSize: "64px", whiteSpace: "nowrap" }}
          >
            The{" "}
            <RoughNotation
              type="highlight"
              show={true}
              color="#1E90FF"
              animationDelay={300}
              animationDuration={800}
            >
              simplest
            </RoughNotation>
            {" "}way to create resumes
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p
            className="mx-auto text-center text-slate-900"
            style={{
              fontFamily: "Inter, 'Inter Fallback', sans-serif",
              fontSize: "22px",
              lineHeight: "1.4",
              fontWeight: "500",
              maxWidth: "800px",
              marginBottom: "64px",
            }}
          >
            Stop struggling with other tools. Build ATS-optimized resumes with live preview and instant PDF export.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="btn-primary group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-slate-800 hover:shadow-xl hover:scale-[1.02]"
            >
              Start Building — It&apos;s Free
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </Reveal>

        {/* Builder Mockup with Floating Badges */}
        <Reveal delay={400}>
          <div className="mt-16 sm:mt-20">
            <div className="relative mx-auto max-w-5xl">

              {/* ── Floating Badges ── */}

              {/* PDF — top left */}
              <div
                className="floating-badge visible float-slow hidden sm:block"
                style={{ top: "-18px", left: "-60px", "--badge-rotate": "-6deg", animationDelay: "0s" }}
              >
                <div className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3.5 py-2 shadow-lg shadow-red-100/40 ring-1 ring-red-100/60" style={{ transform: "rotate(-6deg)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6" /><path d="M12 18v-6" /><path d="m9 15 3 3 3-3" />
                  </svg>
                  <span className="text-xs font-bold text-red-600">PDF</span>
                </div>
              </div>

              {/* ATS Score — top right */}
              <div
                className="floating-badge visible float-medium hidden sm:block"
                style={{ top: "-14px", right: "-50px", "--badge-rotate": "5deg", animationDelay: "0.8s" }}
              >
                <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 shadow-lg shadow-emerald-100/40 ring-1 ring-emerald-100/60" style={{ transform: "rotate(5deg)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
                  </svg>
                  <span className="text-xs font-bold text-emerald-600">ATS</span>
                </div>
              </div>

              {/* A4 — mid left */}
              <div
                className="floating-badge visible float-fast hidden sm:block"
                style={{ top: "35%", left: "-70px", "--badge-rotate": "-4deg", animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 shadow-lg shadow-blue-100/40 ring-1 ring-blue-100/60" style={{ transform: "rotate(-4deg)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" />
                  </svg>
                  <span className="text-xs font-bold text-blue-600">A4</span>
                </div>
              </div>

              {/* Live Preview — mid right */}
              <div
                className="floating-badge visible float-slow hidden sm:block"
                style={{ top: "40%", right: "-80px", "--badge-rotate": "4deg", animationDelay: "0.5s" }}
              >
                <div className="flex items-center gap-1.5 rounded-xl bg-violet-50 px-3.5 py-2 shadow-lg shadow-violet-100/40 ring-1 ring-violet-100/60" style={{ transform: "rotate(4deg)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                  <span className="text-xs font-bold text-violet-600">Live Preview</span>
                </div>
              </div>

              {/* Free — bottom left */}
              <div
                className="floating-badge visible float-medium hidden sm:block"
                style={{ bottom: "30px", left: "-46px", "--badge-rotate": "6deg", animationDelay: "2s" }}
              >
                <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3.5 py-2 shadow-lg shadow-amber-100/40 ring-1 ring-amber-100/60" style={{ transform: "rotate(6deg)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <span className="text-xs font-bold text-amber-600">Free</span>
                </div>
              </div>

              {/* LinkedIn logo — bottom right */}
              <div
                className="floating-badge visible float-fast hidden sm:block"
                style={{ bottom: "50px", right: "-56px", "--badge-rotate": "-5deg", animationDelay: "1.2s" }}
              >
                <div className="flex items-center gap-1.5 rounded-xl bg-sky-50 px-3.5 py-2 shadow-lg shadow-sky-100/40 ring-1 ring-sky-100/60" style={{ transform: "rotate(-5deg)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#0a66c2">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-xs font-bold text-sky-700">LinkedIn</span>
                </div>
              </div>

              {/* ── Mockup Container ── */}
              <div className="rounded-xl border border-slate-200/80 bg-white/50 p-2 shadow-2xl backdrop-blur-sm">
                <div className="overflow-hidden rounded-lg border border-slate-200/60 bg-slate-100">
                  <div className="flex h-8 items-center gap-2 border-b border-slate-200/60 bg-white px-4">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    </div>
                    <div className="mx-auto h-4 w-48 rounded bg-slate-100" />
                  </div>

                  <div className="flex h-[420px] sm:h-[500px]">
                    {/* Left panel skeleton */}
                    <div className="hidden w-2/5 border-r border-slate-200/60 bg-white p-5 sm:block">
                      <div className="mb-6 h-10 w-full rounded-lg bg-slate-100" />
                      <div className="space-y-4">
                        <div className="rounded-xl border border-slate-200 p-4">
                          <div className="mb-3 h-3 w-24 rounded bg-slate-200" />
                          <div className="grid grid-cols-2 gap-3">
                            <div className="h-8 rounded-md bg-slate-100" />
                            <div className="h-8 rounded-md bg-slate-100" />
                            <div className="h-8 rounded-md bg-slate-100" />
                            <div className="h-8 rounded-md bg-slate-100" />
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 p-4">
                          <div className="mb-3 h-3 w-32 rounded bg-slate-200" />
                          <div className="h-20 rounded-md bg-slate-100" />
                        </div>
                        <div className="rounded-xl border border-slate-200 p-4">
                          <div className="mb-3 h-3 w-28 rounded bg-slate-200" />
                          <div className="space-y-2">
                            <div className="h-8 rounded-md bg-slate-100" />
                            <div className="h-8 rounded-md bg-slate-100" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right panel — A4 preview skeleton */}
                    <div className="flex flex-1 items-start justify-center bg-slate-50 p-6">
                      <div className="w-full max-w-sm rounded border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex justify-center">
                          <div className="h-4 w-36 rounded bg-slate-800" />
                        </div>
                        <div className="mb-1 flex justify-center">
                          <div className="h-2 w-48 rounded bg-slate-200" />
                        </div>
                        <div className="mb-4 flex justify-center">
                          <div className="h-1.5 w-56 rounded bg-slate-100" />
                        </div>
                        <div className="mb-3 h-px w-full bg-slate-900" />
                        <div className="mb-2 h-2.5 w-28 rounded bg-slate-300" />
                        <div className="mb-1 h-1.5 w-full rounded bg-slate-100" />
                        <div className="mb-1 h-1.5 w-full rounded bg-slate-100" />
                        <div className="mb-4 h-1.5 w-3/4 rounded bg-slate-100" />
                        <div className="mb-2 h-2.5 w-20 rounded bg-slate-300" />
                        <div className="mb-2 flex justify-between">
                          <div className="h-2 w-32 rounded bg-slate-200" />
                          <div className="h-2 w-16 rounded bg-slate-200" />
                        </div>
                        <div className="mb-1 h-1.5 w-full rounded bg-slate-100" />
                        <div className="mb-1 h-1.5 w-full rounded bg-slate-100" />
                        <div className="mb-4 h-1.5 w-5/6 rounded bg-slate-100" />
                        <div className="mb-2 h-2.5 w-16 rounded bg-slate-300" />
                        <div className="mb-2 flex justify-between">
                          <div className="h-2 w-40 rounded bg-slate-200" />
                          <div className="h-2 w-14 rounded bg-slate-200" />
                        </div>
                        <div className="mb-1 h-1.5 w-full rounded bg-slate-100" />
                        <div className="h-1.5 w-2/3 rounded bg-slate-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Logo Marquee ───────────────────────────────── */

const platforms = [
  { name: "LinkedIn", logo: "/logos/linkedin.svg" },
  { name: "Indeed", logo: "/logos/indeed.svg" },
  { name: "Glassdoor", logo: "/logos/glassdoor.svg" },
  { name: "Monster", logo: "/logos/monster.svg" },
  { name: "Michael Page", logo: "/logos/michael-page.svg" },
  { name: "Randstad", logo: "/logos/randstad.svg" },
  { name: "Wellfound", logo: "/logos/wellfound.svg" },
  { name: "Built In", logo: "/logos/builtin.svg" },
  { name: "Kariyer.net", logo: "/logos/kariyer-net.svg" },
  { name: "We Work Remotely", logo: "/logos/we-work-remotely.svg" },
  { name: "Greenhouse", logo: "/logos/greenhouse.svg" },
  { name: "Hired", logo: "/logos/hired.svg" },
  { name: "CareerBuilder", logo: "/logos/career-builder.svg" },
  { name: "ZipRecruiter", logo: "/logos/zip-recruiter.svg" },
];

function LogoMarquee() {
  const renderLogos = (suffix) =>
    platforms.map((item, i) => (
      <img
        key={`${item.name}-${suffix}-${i}`}
        src={item.logo}
        alt={item.name}
        className="mx-6 h-5 w-auto opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 shrink-0"
        draggable={false}
      />
    ));

  return (
    <section className="py-16 overflow-hidden">
      <div className="mx-auto max-w-[976px]">
        <p
          className="text-left text-[#A0A0A0] mb-4 font-semibold"
          style={{ fontFamily: "Inter, 'Inter Fallback', sans-serif", fontSize: "16px" }}
        >
          Optimized for top job platforms
        </p>
      </div>

      <div
        className="relative marquee-wrapper overflow-hidden mx-auto max-w-[976px]"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex items-center animate-marquee w-max">
          {renderLogos("a")}
          {renderLogos("b")}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-slate-200 px-6 py-10">
      <div className="mx-auto flex items-center justify-between" style={{ maxWidth: "1204px" }}>
        <Logo />
        <div className="flex items-center gap-6">
          <span className="cursor-default text-sm text-slate-400 transition-colors duration-200 hover:text-slate-600">Privacy Policy</span>
          <span className="cursor-default text-sm text-slate-400 transition-colors duration-200 hover:text-slate-600">Terms & Conditions</span>
          <span className="cursor-default text-sm text-slate-400 transition-colors duration-200 hover:text-slate-600">Refund Policy</span>
          <span className="cursor-default text-sm text-slate-400 transition-colors duration-200 hover:text-slate-600">Pricing</span>
          <span className="cursor-default text-sm text-slate-400 transition-colors duration-200 hover:text-slate-600">Contact</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar>
        <NavbarContent />
      </Navbar>
      <Hero />
      <LogoMarquee />
      <Footer />
    </main>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import { RoughNotation } from "react-rough-notation";
import { brand, accent } from "@/config/brand";

/* ─── Scroll Reveal ──────────────────────────────── */

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
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const display = { fontFamily: "var(--font-montserrat), sans-serif" };
const body = { fontFamily: "var(--font-geist), sans-serif" };

/* ─── Navbar ─────────────────────────────────────── */

function NavbarContent() {
  return (
    <>
      <Logo />
      <div className="flex items-center gap-2.5" style={body}>
        <Link
          href="/login"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[15px] font-medium text-slate-900 transition-colors duration-200 hover:bg-slate-50"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-xl px-4 py-2 text-[15px] font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
          style={{ backgroundColor: accent.ink }}
        >
          Sign up
        </Link>
      </div>
    </>
  );
}

/* ─── Hero ───────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 pt-40 pb-16">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob-1 absolute -left-24 -top-24 h-[600px] w-[600px] rounded-full bg-blue-200/25 blur-[110px]" />
        <div className="blob-2 absolute -right-24 top-1/4 h-[500px] w-[500px] rounded-full bg-sky-200/20 blur-[110px]" />
        <div className="blob-3 absolute -bottom-24 left-1/4 h-[400px] w-[400px] rounded-full bg-slate-200/40 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <Reveal delay={120}>
          <h1
            className="mx-auto mb-6 max-w-3xl font-extrabold leading-[1.05] tracking-tight text-slate-900"
            style={{ ...display, fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            The resume builder that gets you{" "}
            <RoughNotation
              type="highlight"
              show={true}
              color={accent.signalSoft}
              animationDelay={600}
              animationDuration={800}
              multiline
            >
              read
            </RoughNotation>
            .
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p
            className="mx-auto mb-9 max-w-xl text-slate-600"
            style={{ ...body, fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)", lineHeight: 1.5 }}
          >
            Clean, ATS-parseable resumes with a live A4 preview and pixel-perfect PDF
            export. No Word wrestling, no paywall.
          </p>
        </Reveal>

        <Reveal delay={340}>
          <p className="mt-5 text-[13px] text-slate-400" style={body}>
            Free forever · No sign-up · Exports a real text-based PDF
          </p>
        </Reveal>

        {/* Signature: builder mockup with the ATS scan-and-pass moment */}
        <Reveal delay={420}>
          <div className="mt-16 sm:mt-20">
            <div className="relative mx-auto max-w-5xl">
              <FloatingBadges />

              <div className="rounded-xl border border-slate-200/80 bg-white/60 p-2 shadow-2xl backdrop-blur-sm">
                <div className="overflow-hidden rounded-lg border border-slate-200/60 bg-slate-100">
                  {/* window chrome */}
                  <div className="flex h-8 items-center gap-2 border-b border-slate-200/60 bg-white px-4">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    </div>
                    <div className="mx-auto h-4 w-48 rounded bg-slate-100" />
                  </div>

                  <div className="flex h-[420px] sm:h-[500px]">
                    {/* editor panel */}
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

                    {/* A4 preview + scan line */}
                    <div className="relative flex flex-1 items-start justify-center overflow-hidden bg-slate-50 p-6">
                      <div className="scan-line" />
                      <div className="relative w-full max-w-sm rounded border border-slate-200 bg-white p-6 shadow-sm">
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

                      {/* the pass moment */}
                      <div
                        className="chip-pop absolute bottom-5 right-5 flex items-center gap-1.5 rounded-lg px-3 py-2 shadow-lg"
                        style={{ backgroundColor: accent.signal }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <span className="text-xs font-bold text-white" style={body}>ATS parsed</span>
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

function FloatingBadges() {
  const badges = [
    { label: "PDF", color: "#dc2626", bg: "bg-red-50", ring: "ring-red-100/60", pos: { top: "-18px", left: "-60px" }, rot: "-6deg", anim: "float-slow", delay: "0s" },
    { label: "A4", color: "#2563eb", bg: "bg-blue-50", ring: "ring-blue-100/60", pos: { top: "34%", left: "-70px" }, rot: "-4deg", anim: "float-fast", delay: "1.5s" },
    { label: "Live preview", color: "#7c3aed", bg: "bg-violet-50", ring: "ring-violet-100/60", pos: { top: "40%", right: "-84px" }, rot: "4deg", anim: "float-slow", delay: "0.5s" },
    { label: "Free", color: "#1d4ed8", bg: "bg-blue-50", ring: "ring-blue-100/60", pos: { bottom: "34px", left: "-46px" }, rot: "6deg", anim: "float-medium", delay: "2s" },
  ];
  return (
    <>
      {badges.map((b) => (
        <div
          key={b.label}
          className={`floating-badge visible ${b.anim} hidden sm:block`}
          style={{ ...b.pos, "--badge-rotate": b.rot, animationDelay: b.delay }}
        >
          <div className={`rounded-xl ${b.bg} px-3.5 py-2 shadow-lg ring-1 ${b.ring}`} style={{ transform: `rotate(${b.rot})` }}>
            <span className="text-xs font-bold" style={{ color: b.color, fontFamily: "var(--font-geist), sans-serif" }}>{b.label}</span>
          </div>
        </div>
      ))}
    </>
  );
}

/* ─── Logo Marquee ───────────────────────────────── */

const platforms = [
  "linkedin", "indeed", "glassdoor", "monster", "michael-page", "randstad",
  "wellfound", "builtin", "kariyer-net", "we-work-remotely", "greenhouse",
  "hired", "career-builder", "zip-recruiter",
];

function LogoMarquee() {
  const renderLogos = (suffix) =>
    platforms.map((name, i) => (
      <img
        key={`${name}-${suffix}-${i}`}
        src={`/logos/${name}.svg`}
        alt={name}
        className="mx-6 h-5 w-auto shrink-0 opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
        draggable={false}
      />
    ));

  return (
    <section className="overflow-hidden py-16">
      <div className="mx-auto max-w-[976px] px-6">
        <p className="mb-5 text-left text-sm font-semibold text-slate-400" style={body}>
          Built to be read by the systems that screen you
        </p>
      </div>
      <div
        className="marquee-wrapper relative mx-auto max-w-[976px] overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="animate-marquee flex w-max items-center">
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
    <footer className="border-t border-slate-200 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-sm text-slate-400" style={body}>· {brand.tagline}</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ───────────────────────────────────────── */

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
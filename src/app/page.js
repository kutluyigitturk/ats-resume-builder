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
      <div className="hidden items-center gap-1 md:flex" style={body}>
        {brand.nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-lg px-3.5 py-2 text-[15px] font-medium text-slate-500 transition-colors duration-200 hover:text-slate-900"
          >
            {item.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3" style={body}>
        <a
          href={brand.links.github}
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-lg px-3 py-2 text-[15px] font-medium text-slate-500 transition-colors duration-200 hover:text-slate-900 sm:inline"
        >
          GitHub
        </a>
        <Link
          href={brand.primaryCta.href}
          className="btn-primary rounded-xl px-4 py-2 text-[15px] font-semibold text-white shadow-sm transition-transform duration-200 hover:scale-[1.02]"
          style={{ backgroundColor: accent.ink }}
        >
          Start free
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
        <div className="blob-1 absolute -left-24 -top-24 h-[600px] w-[600px] rounded-full bg-emerald-200/25 blur-[110px]" />
        <div className="blob-2 absolute -right-24 top-1/4 h-[500px] w-[500px] rounded-full bg-teal-200/20 blur-[110px]" />
        <div className="blob-3 absolute -bottom-24 left-1/4 h-[400px] w-[400px] rounded-full bg-slate-200/40 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <Reveal delay={50}>
          <span
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 backdrop-blur"
            style={body}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent.signal }} />
            ATS-friendly resume builder · Free
          </span>
        </Reveal>

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

        <Reveal delay={280}>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={brand.primaryCta.href}
              className="btn-primary group inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] sm:w-auto"
              style={{ backgroundColor: accent.signal, boxShadow: "0 10px 30px -8px rgba(14,169,104,0.5)" }}
            >
              {brand.primaryCta.label}
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#how"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-[15px] font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
              style={body}
            >
              See how it works
            </a>
          </div>
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
    { label: "Free", color: "#0ea968", bg: "bg-emerald-50", ring: "ring-emerald-100/60", pos: { bottom: "34px", left: "-46px" }, rot: "6deg", anim: "float-medium", delay: "2s" },
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

/* ─── Problem band ───────────────────────────────── */

function Problem() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400" style={body}>
            Why most resumes never get a reply
          </span>
          <h2 className="mb-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl" style={display}>
            Three out of four resumes are filtered out{" "}
            <span style={{ color: accent.signalDark }}>before a human sees them</span>.
          </h2>
          <p className="mx-auto max-w-xl text-lg text-slate-600" style={body}>
            Applicant tracking systems read your resume before any recruiter does. Fancy
            columns, tables and graphics that look nice in Word often come out as garbled
            text. This builder produces the clean, single-column format those systems read
            reliably — so your experience actually makes it through.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Features ───────────────────────────────────── */

const features = [
  { title: "Live A4 preview", desc: "Every keystroke lands on a real A4 page, paginated exactly like the final PDF.", icon: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z M12 9a3 3 0 100 6 3 3 0 000-6" },
  { title: "ATS-friendly templates", desc: "Single-column, text-based layouts — no tables or columns to confuse the scanner.", icon: "M9 12l2 2 4-4 M12 3l7 4v5c0 5-3 8-7 9-4-1-7-4-7-9V7l7-4z" },
  { title: "Pixel-perfect PDF", desc: "What you see is what exports. Selectable text, recruiter-ready, one click.", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M9 15l3 3 3-3" },
  { title: "Full style control", desc: "Fonts, sizes, margins, spacing and section order — tune every detail to fit one page.", icon: "M4 6h16 M4 12h10 M4 18h7 M18 15v6 M15 18h6" },
  { title: "Multiple resumes", desc: "Keep a tailored version for every role, organized in one dashboard.", icon: "M12 3l9 5-9 5-9-5 9-5z M3 13l9 5 9-5" },
  { title: "Completeness score", desc: "A live score shows what's missing and what to strengthen before you send.", icon: "M12 20V10 M18 20V4 M6 20v-4" },
];

function Features() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400" style={body}>
              Everything you need
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl" style={display}>
              A focused builder, not a bloated editor.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <div className="feature-card h-full rounded-2xl border border-slate-200 p-6">
                <div className="icon-box mb-4 flex h-11 w-11 items-center justify-center rounded-xl">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <h3 className="mb-1.5 text-lg font-bold text-slate-900" style={display}>{f.title}</h3>
                <p className="text-[15px] leading-relaxed text-slate-600" style={body}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How it works ───────────────────────────────── */

const steps = [
  { n: "01", title: "Pick a template", desc: "Start from Classic, Advanced or Professional — all ATS-ready out of the box." },
  { n: "02", title: "Fill in your sections", desc: "Guided forms with tips for each section. The A4 preview updates as you type." },
  { n: "03", title: "Export your PDF", desc: "Download a clean, text-based PDF that matches the preview exactly." },
];

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400" style={body}>
              How it works
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl" style={display}>
              From blank page to PDF in three steps.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div className="text-center md:text-left">
                <div
                  className="number-box mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-extrabold text-white"
                  style={{ ...display, backgroundColor: accent.ink }}
                >
                  {s.n}
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900" style={display}>{s.title}</h3>
                <p className="text-[15px] leading-relaxed text-slate-600" style={body}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Templates ──────────────────────────────────── */

const templateCards = [
  { name: "Classic", tag: "Single column", desc: "Clean and trusted. The safest bet for any ATS." },
  { name: "Advanced", tag: "Detailed", desc: "Icons, project links and description fields for depth." },
  { name: "Professional", tag: "Executive", desc: "Letter-spaced headings and a refined, senior feel." },
];

function TemplatePreview({ variant }) {
  return (
    <div className="template-preview flex h-56 items-start justify-center overflow-hidden rounded-t-2xl bg-slate-50 p-5">
      <div className="w-full max-w-[190px] rounded border border-slate-200 bg-white p-4 shadow-sm">
        <div className={`mb-3 flex ${variant === "professional" ? "justify-center" : "justify-center"}`}>
          <div className={`h-2.5 rounded bg-slate-800 ${variant === "professional" ? "w-28" : "w-24"}`} />
        </div>
        <div className="mb-3 flex justify-center">
          <div className="h-1 w-32 rounded bg-slate-200" />
        </div>
        <div className={`mb-3 w-full ${variant === "professional" ? "h-0.5 bg-slate-900" : "h-px bg-slate-300"}`} />
        <div className="mb-1.5 h-1.5 w-16 rounded bg-slate-300" />
        <div className="mb-1 h-1 w-full rounded bg-slate-100" />
        <div className="mb-1 h-1 w-full rounded bg-slate-100" />
        <div className="mb-3 h-1 w-2/3 rounded bg-slate-100" />
        <div className="mb-1.5 h-1.5 w-20 rounded bg-slate-300" />
        <div className="mb-1 flex justify-between">
          <div className="h-1 w-20 rounded bg-slate-200" />
          <div className="h-1 w-10 rounded bg-slate-200" />
        </div>
        <div className="mb-1 h-1 w-full rounded bg-slate-100" />
        <div className="h-1 w-4/5 rounded bg-slate-100" />
      </div>
    </div>
  );
}

function Templates() {
  return (
    <section id="templates" className="scroll-mt-24 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400" style={body}>
              Templates
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl" style={display}>
              Three layouts. All parseable.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {templateCards.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <div className="template-card overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <TemplatePreview variant={t.name.toLowerCase()} />
                <div className="border-t border-slate-100 p-5">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900" style={display}>{t.name}</h3>
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ backgroundColor: accent.signalSoft, color: accent.signalDark, ...body }}
                    >
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600" style={body}>{t.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────── */

const faqs = [
  { q: "Is it really free?", a: "Yes. You can build and export resumes without paying or creating an account." },
  { q: "Will my resume pass ATS?", a: "Templates are single-column and text-based — the format applicant tracking systems read most reliably. There is no such thing as a guaranteed pass, but this avoids the layout traps that break parsing." },
  { q: "Do I need to sign up?", a: "No. Your resumes are saved locally in your browser, so you can start right away." },
  { q: "Can I keep more than one resume?", a: "Yes. The dashboard holds as many versions as you need, so you can tailor one per role." },
  { q: "What does the export look like?", a: "A real, text-based PDF with selectable text — not a screenshot — that matches the on-screen preview exactly." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-[17px] font-semibold text-slate-900" style={display}>{q}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <div className={`faq-answer ${open ? "open" : ""}`}>
        <div>
          <p className="pb-5 pr-8 text-[15px] leading-relaxed text-slate-600" style={body}>{a}</p>
        </div>
      </div>
    </div>
  );
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400" style={body}>
              FAQ
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl" style={display}>
              Questions, answered.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div>
            {faqs.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Final CTA ──────────────────────────────────── */

function FinalCta() {
  return (
    <section className="px-6 py-20">
      <div className="cta-shimmer relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
        <Reveal>
          <h2 className="mx-auto mb-4 max-w-xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl" style={display}>
            Ready to get read?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-lg text-slate-600" style={body}>
            Build a resume that makes it past the filter — and onto a recruiter's screen.
          </p>
          <Link
            href={brand.primaryCta.href}
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.02]"
            style={{ backgroundColor: accent.signal, boxShadow: "0 10px 30px -8px rgba(14,169,104,0.5)" }}
          >
            {brand.primaryCta.label}
          </Link>
        </Reveal>
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
        <div className="flex items-center gap-6" style={body}>
          {brand.nav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
              {item.label}
            </a>
          ))}
          <a href={brand.links.github} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
            GitHub
          </a>
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
      <Problem />
      <Features />
      <HowItWorks />
      <Templates />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
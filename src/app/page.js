import Logo from "@/components/Logo";
import { getCurrentUserQuietly } from "@/lib/session";
import { SessionUserProvider } from "@/components/SessionUser";
import SiteNav from "@/components/SiteNav";
import Link from "next/link";
import { brand } from "@/config/brand";

const body = { fontFamily: "var(--font-geist), sans-serif" };

const platforms = [
  "linkedin",
  "indeed",
  "glassdoor",
  "monster",
  "michael-page",
  "randstad",
  "wellfound",
  "builtin",
  "kariyer-net",
  "we-work-remotely",
  "greenhouse",
  "hired",
  "career-builder",
  "zip-recruiter",
];

const Check = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ─── Scrolling logo marquee (kept — the strip you wanted) ─── */
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
    <section className="overflow-hidden py-14">
      <div className="mx-auto max-w-[976px] px-8">
        <p className="mb-5 text-center text-sm font-semibold text-slate-400" style={body}>
          Read cleanly by the systems that screen you
        </p>
      </div>
      <div
        className="marquee-wrapper relative mx-auto max-w-[976px] overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
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

function Hero() {
  return (
    <section className="tl-hero">
      <div className="tl-wrap">
        <span className="tl-eyebrow">ATS-ready resume builder</span>
        <h1 className="tl-h1">
          The simplest way to build a resume that <span className="tl-mark">gets read</span>.
        </h1>
        <p className="tl-sub">
          Clean, ATS-parseable resumes with a live A4 preview and a real, text-based PDF. No Word
          wrestling.
        </p>
        <Link href="/signup" className="tl-cta">
          Start building — it&apos;s free
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
        <div className="tl-note">Your first resume is free — no card required</div>

        <div className="tl-stage">
          <div className="tl-badge g">
            <span className="tl-dot" style={{ background: "#0e9f6e" }} /> ATS parsed
          </div>
          <div className="tl-badge b">
            <span className="tl-dot" style={{ background: "#1d4ed8" }} /> Live preview
          </div>
          <div className="tl-paper">
            <div className="tl-pname">Elena Voss</div>
            <div className="tl-prole">Senior Product Designer</div>
            <div className="tl-pcontact">Amsterdam · elena.voss@email.com</div>
            <div className="tl-prule" />
            <div className="tl-psec">Experience</div>
            <div className="tl-prow">
              <span className="tl-pstrong">Senior Product Designer</span>
              <span className="tl-pdate">2021—Now</span>
            </div>
            <div className="tl-pline" style={{ width: "100%", marginTop: "6px" }} />
            <div className="tl-pline" style={{ width: "88%" }} />
            <div className="tl-pline" style={{ width: "72%" }} />
            <div className="tl-psec">Education</div>
            <div className="tl-prow">
              <span className="tl-pstrong">MA, Interaction Design</span>
              <span className="tl-pdate">2016—2018</span>
            </div>
            <div className="tl-pline" style={{ width: "100%", marginTop: "6px" }} />
            <div className="tl-pline" style={{ width: "60%" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <div className="tl-wrap">
      <section className="tl-feat">
        <div className="tl-copy">
          <h2>
            Built to be <span className="tl-mark">read</span>.
          </h2>
          <p>
            Single-column, text-based layouts that applicant tracking systems parse without fail —
            so your experience reaches a human.
          </p>
          <ul className="tl-flist">
            <li>
              <Check /> No tables or columns to confuse the scanner
            </li>
            <li>
              <Check /> Selectable, text-based PDF — not an image
            </li>
          </ul>
        </div>
        <div className="tl-visual">
          <div className="tl-scanwrap">
            <div className="tl-scanline" />
            <div className="tl-mini-page" style={{ maxWidth: "100%", padding: "22px" }}>
              <div className="tl-pname" style={{ fontSize: "16px" }}>
                Elena Voss
              </div>
              <div className="tl-prule" style={{ margin: "10px 0" }} />
              <div className="tl-pline" style={{ width: "100%" }} />
              <div className="tl-pline" style={{ width: "92%" }} />
              <div className="tl-pline" style={{ width: "78%" }} />
              <div className="tl-pline" style={{ width: "100%", marginTop: "14px" }} />
              <div className="tl-pline" style={{ width: "64%" }} />
            </div>
            <div className="tl-checkchip">✓ Parsed</div>
          </div>
        </div>
      </section>

      <section className="tl-feat rev">
        <div className="tl-copy">
          <h2>
            See it <span className="tl-mark">as you build it</span>.
          </h2>
          <p>
            Every keystroke lands on a real A4 page, paginated exactly like the final PDF. What you
            see is what you export.
          </p>
          <ul className="tl-flist">
            <li>
              <Check /> Live preview, no surprises on export
            </li>
            <li>
              <Check /> Full control over fonts, spacing and order
            </li>
          </ul>
        </div>
        <div className="tl-visual">
          <div className="tl-miniapp">
            <div className="tl-minibar">
              <i />
              <i />
              <i />
            </div>
            <div className="tl-minibody">
              <div className="tl-mini-ed">
                <div className="tl-mini-field" />
                <div className="tl-mini-field" />
                <div className="tl-mini-field" style={{ height: "50px" }} />
              </div>
              <div className="tl-mini-prev">
                <div className="tl-mini-page">
                  <div
                    className="tl-pline"
                    style={{ width: "60%", height: "6px", background: "#334155" }}
                  />
                  <div className="tl-prule" style={{ margin: "8px 0" }} />
                  <div className="tl-pline" style={{ width: "100%" }} />
                  <div className="tl-pline" style={{ width: "85%" }} />
                  <div className="tl-pline" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FinalCta() {
  return (
    <div className="tl-wrap">
      <section className="tl-final">
        <div className="tl-final-card">
          <h2>
            Ready to get <span className="tl-mark-strong">read</span>?
          </h2>
          <p>Build a resume that makes it past the filter — and onto a recruiter&apos;s screen.</p>
          <Link href="/signup" className="tl-cta">
            Start building — it&apos;s free
          </Link>
        </div>
      </section>
    </div>
  );
}

function Footer() {
  return (
    <footer className="tl-footer">
      <div className="tl-wrap">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="tl-tag">· {brand.tagline}</span>
        </div>
      </div>
    </footer>
  );
}

// Reading the session here rather than in the root layout: this page and
// /pricing are the only public surfaces with a navbar, and putting cookies()
// in the root layout would opt every route out of static rendering.
export default async function LandingPage() {
  const user = await getCurrentUserQuietly();

  return (
    <SessionUserProvider user={user}>
      <main className="tl min-h-screen">
        <SiteNav />
        <Hero />
        <LogoMarquee />
        <Features />
        <FinalCta />
        <Footer />
      </main>
    </SessionUserProvider>
  );
}

// ─── Brand configuration ──────────────────────────────────────────────
// Single source of truth for the product name and marketing copy.
// The name is not final yet — when you pick one, change `name` here and it
// updates the logo, navbar, footer, page copy and <title> everywhere.
// TODO: `name` is a temporary placeholder ("Resuma"). Swap it when decided.

export const brand = {
  name: "Resuma",
  // Short label shown in the browser tab / SEO title.
  tagline: "The resume builder that gets you read",
  description:
    "Build clean, ATS-parseable resumes with a live A4 preview and pixel-perfect PDF export. Free, no sign-up.",

  // Primary call-to-action used across the page.
  primaryCta: { label: "Start building — free", href: "/dashboard" },

  // In-page navigation (anchors to sections on the landing page).
  nav: [
    { label: "Templates", href: "#templates" },
    { label: "How it works", href: "#how" },
    { label: "FAQ", href: "#faq" },
  ],

  // External / real links (honest — these actually exist).
  links: {
    github: "https://github.com/kutluyigitturk/ats-resume-builder",
  },
};

// Signature accent — the "passed the ATS scan" green. Kept in one place so
// the whole identity can be re-tinted later.
export const accent = {
  signal: "#0ea968",
  signalDark: "#065f46",
  signalSoft: "#d1fae5",
  ink: "#0b0f14",
};

export default brand;
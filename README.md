<h1 align="center">easyATS — ATS-Friendly Resume Builder</h1>

<p align="center">
  A free, open-source resume builder that helps you create ATS-optimized resumes with real-time preview and one-click PDF export.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## Overview

easyATS is a web-based resume builder designed for job seekers who want clean, professional, ATS-friendly resumes without the hassle of formatting in Word or paying for premium tools. Users fill structured forms on the left panel, see a real-time paginated A4 preview on the right, and export pixel-perfect PDFs.

**Live flow:** Landing Page → Dashboard (manage multiple resumes) → Builder (edit & export)

---

## Features

### Dashboard (`/dashboard`)
- **Multi-CV management**: Create, rename, duplicate, and delete multiple resumes
- **Real CV previews**: Each resume card shows a scaled-down live preview of your actual CV
- **Template selection on create**: Choose Classic, Advanced, or Professional template with live previews before creating
- **Empty resume cleanup**: Resumes with no content are automatically removed on dashboard load
- **Floating navbar**: Glassmorphism navbar consistent with landing page design
- **Gradient background**: Subtle blue/indigo blur effects for visual depth
- **Migration support**: Existing single-CV users automatically migrated to multi-CV system

### Resume Builder (`/builder`)
- **10 CV sections**: Personal Information, Professional Summary, Work Experience, Education, Technical Skills, Projects & Research, Volunteering & Leadership, Certifications, Languages, and References
- **Reorderable items**: Move entries up/down within each section
- **Auto-formatted date inputs**: Type `102024` → `10/2024`
- **Bullet point editor**: Add, remove, and reorder responsibilities
- **Collapsible sections**: Accordion-style with tips and recommendations
- **Resizable panel**: Drag divider to adjust editor/preview width ratio
- **URL guard**: Direct `/builder` access without valid ID redirects to dashboard

### Template System
- **Classic**: Clean single-column layout. Pipe-separated contact info. Inter font. Bullet-style skills.
- **Advanced**: SVG contact icons, project URLs, certification "View Credentials" links, description fields. Inter font.
- **Professional**: Executive-style with uppercase name/title (letter-spacing), single-line experience headers ("Position, Company" + "Date | Location"), inline skills without bullets, dual dividers around contact line. Times New Roman (headings) + Arial (body).
- **Auto font selection**: Switching templates automatically applies the template's default fonts
- **Template modal**: Visual picker with live mini CV previews — each card renders with its own template's fonts and styling. Empty CVs show sample data (MIT EECS grad profile).
- **Seamless switching**: All CV data preserved when switching between templates

### Layout & Style Panel
- **Formatting**: Primary font (headings) + secondary font (body) with self-rendering font dropdown
- **Size controls**: Heading (8–18pt), body (7–14pt), line spacing (1.0–2.0)
- **Margins**: Presets (Narrow, Normal, Moderate, Wide) + custom mm steppers
- **Spacing**: Between sections, between titles & content, between content blocks
- **Section reorder**: Drag-and-drop with @dnd-kit. Personal Info fixed at top. Empty sections shown with faded icon/text.
- **Page breaks**: "Keep items together" toggle — OFF (default): bullet points flow across pages with header+first bullet protected. ON: entire items stay on same page.

### Live Preview
- **Block-level pagination**: Each section header, item header, and bullet is a measured block distributed across fixed-height A4 pages
- **Smart page splitting**: Experience, Projects, Volunteering items with 2+ bullets split intelligently — header + first bullet stay together, remaining bullets flow freely
- **Section header orphan protection**: Section headers never left alone at page bottom
- **Zoom controls**: 40%–150%
- **Real-time**: Every keystroke reflected instantly

### PDF Export
- **Puppeteer-based**: Server-side generation with @sparticuz/chromium
- **Full parity**: PDF matches preview exactly — fonts, sizes, margins, spacing, section order, template differences
- **Smart page breaks in PDF**: Same split logic via CSS `break-inside` rules
- **Contact shortening**: LinkedIn and Website displayed as clickable "LinkedIn" / "Portfolio" labels instead of full URLs

### Landing Page
- **Animated hero**: Background gradient blobs with CSS keyframe animations (12–18s floating cycles)
- **Floating badges**: 6 decorative badges orbiting the builder mockup (PDF, ATS, A4, Live Preview, Free, LinkedIn)
- **Glassmorphism navbar**: Floating, scroll-aware, backdrop-blur
- **Logo animation**: easyATS → eATSy on hover with letter collapse/expand transitions
- **Logo marquee**: 14 job platform logos, infinite CSS animation (40s), mask fade edges, pause on hover
- **Features section**: 4 cards with gradient border hover effects and icon color transitions
- **How It Works**: 3 steps with dashed SVG connector lines and number box hover glow
- **Template previews**: Classic + Advanced cards with mini skeletons
- **FAQ**: Smooth CSS Grid expand/collapse animation
- **CTA**: Shimmer background + gradient text accent
- **Button effects**: Shine sweep on hover for primary buttons

### Data Persistence
- **localStorage**: CV data, style settings, template choice, PDF name, section states — all auto-saved with 500ms debounce
- **Per-resume storage**: Each resume has isolated localStorage keys (`cv-{id}-cvData`, `cv-{id}-styleSettings`, etc.)
- **Touch tracking**: `updatedAt` timestamp updated on every edit for accurate "last edited" display
- **Hydration-safe**: Loads after mount to prevent SSR mismatch

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Fonts | Google Fonts (Inter, Sora, Roboto, Open Sans, Lato, Carlito) + System (Times New Roman, Arial, Georgia) |
| PDF | Puppeteer-core, @sparticuz/chromium |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| Animations | react-rough-notation, CSS keyframes |
| State | React hooks + localStorage |

---

## Project Structure

```
src/
├── app/
│   ├── layout.js                  # Root layout with Google Fonts
│   ├── page.js                    # Landing page
│   ├── globals.css                # Global styles + animations
│   ├── dashboard/
│   │   └── page.js                # Dashboard — multi-CV management
│   ├── builder/
│   │   └── page.js                # Builder — CV editor + preview
│   └── api/generate-pdf/
│       └── route.js               # Puppeteer PDF generation API
│
├── components/
│   ├── Logo.js                    # Animated easyATS logo
│   ├── Navbar.js                  # Shared glassmorphism floating navbar
│   ├── builder/
│   │   ├── PdfNameEditor.js       # PDF filename editor header
│   │   ├── Toolbar.js             # Templates, Layout & Style, Download
│   │   ├── ZoomControls.js        # Zoom in/out
│   │   ├── ResizableDivider.js    # Panel divider
│   │   └── TemplateModal.js       # Template picker (switch + create modes)
│   ├── cv-sections/               # 10 form components
│   ├── cv-preview/
│   │   └── CVPreview.js           # Paginated A4 preview
│   ├── layout-style/              # Formatting, Reorder, Margins panels
│   └── ui/                        # Shared primitives
│
├── data/
│   ├── initialCV.js               # Empty CV structure
│   ├── sampleCV.js                # Demo CV for template previews
│   ├── sectionTips.js             # Tips per section
│   ├── styleDefaults.js           # Font options, controls, defaults
│   └── templates.js               # Template registry (3 templates)
│
├── hooks/
│   ├── useCVData.js               # CV state + localStorage (resumeId aware)
│   ├── useStyleSettings.js        # Style state + localStorage (resumeId aware)
│   ├── usePdfExport.js            # PDF generation (resumeId aware)
│   ├── useResizablePanel.js       # Panel resize
│   └── useLocalStorage.js         # Generic localStorage hook
│
├── icons/index.js                 # All SVG icon components
│
└── lib/
    ├── constants.js               # Shared styles, factories
    ├── createId.js                # Unique ID generator
    ├── cvHelpers.js               # Shared CV utilities (hasValue, formatDateRange, etc.)
    ├── htmlEscape.js              # XSS escape for PDF
    ├── pdfHtmlBuilder.js          # PDF HTML builder (template-aware)
    ├── resumeManager.js           # Multi-CV CRUD + migration
    └── resumeTextParser.js        # Resume text parser for paste import
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Google Chrome (for local PDF generation)

### Installation

```bash
git clone https://github.com/kutluyigitturk/ats-resume-builder.git
cd ats-resume-builder
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page, or go directly to [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

### PDF Generation

The PDF export uses Puppeteer with a local Chrome installation. Update the path in `src/app/api/generate-pdf/route.js` if needed:

```javascript
// Windows
executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
// macOS
executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
// Linux
executablePath: "/usr/bin/google-chrome"
```

---

## Design Philosophy

- **Inspired by**: tally.so (clean, minimal), linear.app (premium feel), amie.so (warm, modern), jobsuit.ai (builder UX)
- **"Calm confidence"**: Slate color palette, blue accent sparingly, typography-driven, generous whitespace
- **Not an admin panel**: Dashboard and builder feel like a product, not a CRUD interface
- **ATS-first**: Every template produces clean, parseable text — no columns, tables, or graphics that confuse ATS systems

---

## Roadmap

- [ ] Dark/light theme toggle
- [ ] Database + authentication (user accounts, cloud storage)
- [ ] AI-powered content suggestions
- [ ] Responsive mobile layout
- [ ] DOCX export format
- [ ] Additional templates
- [ ] Pricing page, blog, about page

---

## License

This project is licensed under the MIT License.

# ATS Resume Builder

A modern, professional resume builder web application designed to produce ATS (Applicant Tracking System) friendly, text-based resumes. Built with Next.js, React, and Tailwind CSS.

Users fill out structured forms on the left panel, see a real-time A4 preview on the right, and export pixel-perfect PDFs with one click.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

### Resume Editor
- **10 CV sections**: Personal Information, Professional Summary, Work Experience, Education, Technical Skills, Projects & Research, Volunteering & Leadership, Certifications, Languages, and References
- **Reorderable items**: Move entries up/down within each section
- **Auto-formatted date inputs**: Type `102024` and get `10/2024` automatically
- **Bullet point editor**: Add, remove, and reorder responsibilities and details
- **Collapsible sections**: Accordion-style sections with tips and recommendations

### Template System
- **Classic template**: Clean, single-column ATS-friendly layout with pipe-separated contact info
- **Advanced template**: Enhanced layout with contact SVG icons, project URLs, certification credential links with "View Credentials", and description fields
- **Template modal**: Visual template picker with live mini CV previews from real user data
- **Seamless switching**: All CV data preserved when switching between templates

### Layout & Style Panel
- **Formatting**: Primary font (headings) and secondary font (body) selection with self-rendering font previews. Options include Inter, Roboto, Open Sans, Lato, Carlito, Arial, Georgia, and Times New Roman
- **Size controls**: Heading size (8–18pt), body size (7–14pt), and line spacing (1.0–2.0)
- **Margins**: Word-style presets (Narrow, Normal, Moderate, Wide) plus custom mm controls
- **Spacing**: Between sections, between titles and content, between content blocks
- **Section reorder**: Drag-and-drop section ordering with @dnd-kit (Personal Information stays fixed at top)

### Live Preview
- **Word-like pagination**: Real page breaks with gap and shadow between pages, just like Microsoft Word's Print Layout view
- **Block-level pagination**: Content blocks never split mid-item; section headers protected from orphaning at page bottom
- **Zoom controls**: 40%–150% zoom with smooth scaling
- **Real-time updates**: Preview reflects every keystroke instantly

### PDF Export
- **Puppeteer-based**: Server-side PDF generation using Puppeteer and @sparticuz/chromium
- **Full style parity**: PDF output matches preview exactly — fonts, sizes, margins, spacing, and section order
- **Template-aware**: Classic and Advanced templates render differently in PDF
- **Custom filename**: Editable PDF filename with persistent storage

### Data Persistence
- **localStorage auto-save**: CV data, style settings, template choice, PDF name, and open section states saved automatically with debounced writes
- **Hydration-safe**: No SSR/client mismatch — loads from storage after mount
- **Cross-template persistence**: Data preserved when switching templates; fields hidden in one template remain stored for use in another

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Fonts | Google Fonts (Inter, Roboto, Open Sans, Lato, Carlito) |
| PDF Generation | Puppeteer-core, @sparticuz/chromium |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| State | React hooks + localStorage |
| Icons | Custom SVG components |

---

## Project Structure

```
src/
├── app/
│   ├── layout.js              # Root layout with Google Fonts
│   ├── page.js                # Landing page
│   ├── globals.css            # Global styles
│   ├── builder/
│   │   └── page.js            # Builder page orchestration
│   └── api/
│       └── generate-pdf/
│           └── route.js       # Puppeteer PDF generation API
│
├── components/
│   ├── builder/
│   │   ├── PdfNameEditor.js   # PDF filename editor
│   │   ├── Toolbar.js         # Templates, Layout & Style, Download buttons
│   │   ├── ZoomControls.js    # Zoom in/out controls
│   │   ├── ResizableDivider.js# Draggable panel divider
│   │   └── TemplateModal.js   # Template selection modal with live previews
│   │
│   ├── cv-sections/
│   │   ├── PersonalInfoForm.js
│   │   ├── SummaryForm.js
│   │   ├── ExperienceForm.js
│   │   ├── EducationForm.js
│   │   ├── SkillsForm.js
│   │   ├── ProjectsForm.js
│   │   ├── VolunteeringForm.js
│   │   ├── CertificationsForm.js
│   │   ├── LanguagesForm.js
│   │   └── ReferencesForm.js
│   │
│   ├── cv-preview/
│   │   └── CVPreview.js       # Paginated A4 preview with style resolution
│   │
│   ├── layout-style/
│   │   ├── LayoutStylePanel.js
│   │   ├── FormattingSection.js
│   │   ├── FontSelect.js
│   │   ├── StepperControl.js
│   │   ├── ReorderSections.js
│   │   └── MarginsSpacingSection.js
│   │
│   └── ui/
│       ├── Section.js         # Accordion section wrapper
│       ├── ReorderableCard.js # Card with move up/down/delete controls
│       ├── ItemControls.js    # Shared control buttons
│       ├── FormInput.js       # Standard text input
│       ├── DateInput.js       # Auto-formatting MM/YYYY input
│       ├── BulletListEditor.js# Bullet point add/remove/edit
│       └── AddButton.js       # "Add ..." buttons
│
├── data/
│   ├── initialCV.js           # Empty CV data structure
│   ├── sectionTips.js         # Tips for each section
│   ├── styleDefaults.js       # Fonts, controls, presets, defaults
│   └── templates.js           # Template registry
│
├── hooks/
│   ├── useCVData.js           # CV state management + localStorage
│   ├── useStyleSettings.js    # Style state + localStorage
│   ├── usePdfExport.js        # PDF generation + localStorage
│   ├── useResizablePanel.js   # Panel resize behavior
│   └── useLocalStorage.js     # Generic localStorage hook with debounce
│
├── icons/
│   └── index.js               # All SVG icon components
│
└── lib/
    ├── constants.js           # Shared styles, factories, constraints
    ├── createId.js            # Unique ID generator
    ├── htmlEscape.js          # XSS/HTML escape for PDF
    └── pdfHtmlBuilder.js      # PDF HTML document builder
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Google Chrome (for local PDF generation)

### Installation

```bash
git clone https://github.com/yourusername/cv-builder.git
cd cv-builder
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000/builder](http://localhost:3000/builder) to start building your resume.

### PDF Generation Setup

The PDF export uses Puppeteer with a local Chrome installation for development. Update the Chrome path in `src/app/api/generate-pdf/route.js` if needed:

```javascript
// Windows default
executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

// macOS default
executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

// Linux default
executablePath: "/usr/bin/google-chrome"
```

---

## Architecture Decisions

- **Modular component structure**: Each CV section is an independent form component with shared UI primitives
- **Template-agnostic data model**: CV data includes all possible fields; templates control which fields are visible
- **Style resolution pattern**: Base `cvStyles` merged with user `styleSettings` at render time — no mutation of defaults
- **Block-level pagination**: CV content split into atomic blocks, measured via offscreen DOM, distributed across fixed-height pages
- **localStorage persistence**: Debounced auto-save with hydration-safe loading pattern for Next.js SSR compatibility

---

## Roadmap

- [ ] Landing page
- [ ] Additional templates with distinct visual layouts
- [ ] Database + authentication for cloud storage
- [ ] Multi-CV support (create and manage multiple resumes)
- [ ] AI-powered content suggestions
- [ ] Responsive mobile layout
- [ ] Export to DOCX format

---

## License

This project is licensed under the MIT License.

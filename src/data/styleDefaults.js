// Font options available in the builder
// System fonts don't need loading, Google Fonts are loaded in layout.js
export const fontOptions = [
  { name: "Inter", family: "Inter, sans-serif", source: "google" },
  { name: "Roboto", family: "Roboto, sans-serif", source: "google" },
  { name: "Open Sans", family: "'Open Sans', sans-serif", source: "google" },
  { name: "Montserrat", family: "Montserrat, sans-serif", source: "google" },
  { name: "Carlito", family: "Carlito, Calibri, sans-serif", source: "google" },
  { name: "Arial", family: "Arial, sans-serif", source: "system" },
  { name: "Georgia", family: "Georgia, serif", source: "system" },
  { name: "Times New Roman", family: "'Times New Roman', serif", source: "system" },
];

// Stepper control definitions for font sizes and line spacing
export const styleControls = {
  headingSize: {
    label: "Heading Size",
    min: 8,
    max: 18,
    step: 1,
    unit: "pt",
  },
  bodySize: {
    label: "Body Size",
    min: 7,
    max: 14,
    step: 0.5,
    unit: "pt",
  },
  lineSpacing: {
    label: "Line Spacing",
    min: 1.0,
    max: 2.0,
    step: 0.05,
    unit: "",
  },
};

// Page margin presets (matching Word's standard presets)
export const marginPresets = [
  { id: "narrow", label: "Narrow", topBottom: 12.7, leftRight: 12.7 },
  { id: "normal", label: "Normal", topBottom: 25.4, leftRight: 25.4 },
  { id: "moderate", label: "Moderate", topBottom: 25.4, leftRight: 19.1 },
  { id: "wide", label: "Wide", topBottom: 25.4, leftRight: 50.8 },
];

// Spacing control definitions
export const spacingControls = {
  betweenSections: {
    label: "Between Sections",
    min: 0,
    max: 30,
    step: 1,
    unit: "pt",
  },
  betweenTitleContent: {
    label: "Between Titles & Content",
    min: 0,
    max: 20,
    step: 1,
    unit: "pt",
  },
  betweenContentBlocks: {
    label: "Between Content Blocks",
    min: 0,
    max: 20,
    step: 1,
    unit: "pt",
  },
};

// Section definitions for reorder panel
// "personal" is always fixed at top and not included in reorderable list
export const sectionDefinitions = [
  { id: "summary", label: "Professional Summary" },
  { id: "experience", label: "Work Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Technical Skills" },
  { id: "projects", label: "Projects and Research" },
  { id: "volunteering", label: "Volunteering & Leadership" },
  { id: "certifications", label: "Certifications" },
  { id: "languages", label: "Languages" },
  { id: "references", label: "References" },
];

export const defaultSectionOrder = sectionDefinitions.map((s) => s.id);

// The document's own language - not the interface language. A Turkish user
// writes an English resume and still wants their name cased with Turkish rules,
// because a name carries its own orthography: "Elif" uppercases to ELİF in
// Turkish and ELIF in English, and the wrong letter reaches the text layer an
// ATS reads. Today this decides two things and nothing else: how the
// professional template uppercases the name and title, and the lang attribute
// on the exported file. Section headings stay English until the interface is
// translatable.
export const documentLocales = [
  { id: "en", label: "English" },
  { id: "tr", label: "Türkçe" },
];

// localStorage is the user's to edit, so a stored locale is a request, not a
// fact - and this one lands in an HTML attribute.
export function resolveDocumentLocale(value) {
  return documentLocales.some((l) => l.id === value) ? value : "en";
}

// Only ever the starting value for a new resume. Once a resume carries a
// locale it keeps it, so a language switcher added later cannot rewrite a
// finished document.
export function preferredDocumentLocale() {
  if (typeof navigator === "undefined") return "en";

  const supported = documentLocales.map((l) => l.id);
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const tag of tags) {
    const base = String(tag || "")
      .toLowerCase()
      .split("-")[0];
    if (supported.includes(base)) return base;
  }

  return "en";
}

// Default style values matching current cvStyles base
export const defaultStyleSettings = {
  primaryFont: "Inter",
  secondaryFont: "Inter",
  headingSize: 12,
  bodySize: 10,
  lineSpacing: 1.5,
  sectionOrder: defaultSectionOrder,
  // Margins (mm)
  marginPreset: "narrow",
  marginTopBottom: 12.7,
  marginLeftRight: 12.7,
  // Spacing (pt)
  betweenSections: 14,
  betweenTitleContent: 6,
  betweenContentBlocks: 10,
  // Pagination
  keepItemsTogether: false,
  // Reconciled on read, so a resume saved before this existed renders exactly
  // as it did before.
  documentLocale: "en",
};

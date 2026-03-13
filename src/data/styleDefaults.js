// Font options available in the builder
// System fonts don't need loading, Google Fonts are loaded in layout.js
export const fontOptions = [
  { name: "Inter", family: "Inter, sans-serif", source: "google" },
  { name: "Roboto", family: "Roboto, sans-serif", source: "google" },
  { name: "Open Sans", family: "'Open Sans', sans-serif", source: "google" },
  { name: "Lato", family: "Lato, sans-serif", source: "google" },
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
};
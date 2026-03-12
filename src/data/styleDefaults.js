// Font options available in the builder
// System fonts don't need loading, Google Fonts are loaded in layout.js
export const fontOptions = [
  { name: "Inter", family: "Inter, sans-serif", source: "google" },
  { name: "Roboto", family: "Roboto, sans-serif", source: "google" },
  { name: "Open Sans", family: "'Open Sans', sans-serif", source: "google" },
  { name: "Lato", family: "Lato, sans-serif", source: "google" },
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

// Section definitions for reorder panel
// "personal" is always fixed at top and not included in reorderable list
export const sectionDefinitions = [
  { id: "summary", label: "Professional Summary" },
  { id: "experience", label: "Work Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Technical Skills" },
  { id: "projects", label: "Projects and Research" },
  { id: "references", label: "References" },
];

export const defaultSectionOrder = sectionDefinitions.map((s) => s.id);

// Default style values matching current cvStyles base
export const defaultStyleSettings = {
  primaryFont: "Inter",
  secondaryFont: "Inter",
  headingSize: 12,       // pt — matches cvStyles.sectionTitle.fontSize
  bodySize: 10,          // pt — matches cvStyles base body size
  lineSpacing: 1.5,      // matches cvStyles.page.lineHeight
  sectionOrder: defaultSectionOrder,
};
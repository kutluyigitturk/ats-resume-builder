// Template definitions registry
// Each template defines its id, display name, description, badges, and feature flags

export const templates = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column format trusted by recruiters worldwide.",
    badges: ["ATS-Friendly", "Single Column"],
    defaultPrimaryFont: "Inter",
    defaultSecondaryFont: "Inter",
    features: {
      projectUrl: false,
      certificationUrl: false,
    },
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Enhanced layout with additional detail fields for experienced professionals.",
    badges: ["ATS-Friendly", "Detailed"],
    defaultPrimaryFont: "Inter",
    defaultSecondaryFont: "Inter",
    features: {
      projectUrl: true,
      certificationUrl: true,
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "Executive-style layout with elegant formatting and letter-spaced headings.",
    badges: ["ATS-Friendly", "Executive"],
    defaultPrimaryFont: "Times New Roman",
    defaultSecondaryFont: "Arial",
    features: {
      projectUrl: true,
      certificationUrl: true,
    },
  },
];

export const defaultTemplateId = "classic";

export function getTemplate(id) {
  return templates.find((t) => t.id === id) || templates[0];
}
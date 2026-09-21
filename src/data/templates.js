// Template definitions registry
// Each template defines its id, display name, description, badges, and feature flags.
//
// The flags are not decoration: both renderers and both editor forms read them
// through templateSupports(), so this file is the single place that decides
// which fields a template prints. They describe the code as it is - only
// Advanced renders these three - rather than an intention. Turning one on makes
// every resume already using that template print new lines on its next export,
// which is a visible change to finished documents, not a bug fix.

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
      certificationDescription: false,
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
      certificationDescription: true,
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
      projectUrl: false,
      certificationUrl: false,
      certificationDescription: false,
    },
  },
];

export const defaultTemplateId = "classic";

export function getTemplate(id) {
  return templates.find((t) => t.id === id) || templates[0];
}

/** Whether a template prints a given optional field. */
export function templateSupports(templateId, feature) {
  return getTemplate(templateId).features?.[feature] === true;
}

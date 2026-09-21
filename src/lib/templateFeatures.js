import { hasValue } from "./cvHelpers";
import { templateSupports } from "@/data/templates";

// The optional fields a template may or may not print, and where their data
// lives. One table, so the editor, the renderers and the switch warning all
// agree on what "Advanced only" means - and so adding a fourth field is one
// entry rather than a search through six files.
export const FEATURE_FIELDS = [
  { feature: "projectUrl", section: "projects", field: "url", label: "Project URL" },
  { feature: "certificationUrl", section: "certifications", field: "url", label: "Credential URL" },
  {
    feature: "certificationDescription",
    section: "certifications",
    field: "description",
    label: "Certification description",
  },
];

/** A field the editor must keep showing: printed by this template, or holding data. */
export function fieldIsVisible(templateId, cv, feature) {
  if (templateSupports(templateId, feature)) return true;
  return countFilled(cv, feature) > 0;
}

function countFilled(cv, feature) {
  const spec = FEATURE_FIELDS.find((f) => f.feature === feature);
  if (!spec || !cv) return 0;

  const items = cv[spec.section];
  if (!Array.isArray(items)) return 0;

  return items.filter((item) => hasValue(item?.[spec.field])).length;
}

// What the user would stop seeing on the page by moving between two templates.
// Only fields that actually hold something are reported: a warning about an
// empty field is noise, and noise is how a real warning gets dismissed.
//
// Tolerates a missing cv - the modal also opens from the dashboard, where there
// is no resume yet.
export function droppedFields(cv, fromTemplateId, toTemplateId) {
  if (!cv) return [];

  return FEATURE_FIELDS.filter(
    (spec) =>
      templateSupports(fromTemplateId, spec.feature) &&
      !templateSupports(toTemplateId, spec.feature)
  )
    .map((spec) => ({ ...spec, count: countFilled(cv, spec.feature) }))
    .filter((spec) => spec.count > 0);
}

import { fontOptions } from "@/data/styleDefaults";

// ─── Shared CV Utilities ─────────────────────────
// Single source of truth for helpers used by both
// CVPreview (client-side) and pdfHtmlBuilder (server-side PDF).

/** Check if a value is a non-empty string */
export function hasValue(v) {
  return typeof v === "string" && v.trim() !== "";
}

/** Format a start–end date range, returning whichever parts exist */
export function formatDateRange(start, end) {
  if (hasValue(start) && hasValue(end)) return `${start} – ${end}`;
  return start || end || "";
}

/** Filter references to only those with at least one filled field */
export function getVisibleReferences(refs) {
  return refs.filter(
    (r) => hasValue(r.name) || hasValue(r.company) || hasValue(r.phone) || hasValue(r.email)
  );
}

/** Resolve a font display name to its CSS font-family string */
export function resolveFontFamily(fontName) {
  const font = fontOptions.find((f) => f.name === fontName);
  return font ? font.family : "Inter, sans-serif";
}
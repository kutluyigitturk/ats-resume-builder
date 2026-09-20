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

// Body Size is a document-wide control, so everything that is not a section
// heading or the name block scales with it. The offsets reproduce exactly the
// sizes the templates shipped with at the default 10pt, so a saved resume
// renders identically until its owner moves the stepper. One formula in one
// file, because the preview and the PDF pinning their own copies of 10.5pt is
// how they drifted apart in the first place.
const BODY_OFFSETS = {
  itemHeader: 0.5,
  referenceTitle: 0.5,
  contact: -1,
  meta: -0.5,
  credentialLink: -1,
};

export function bodyRelativeSize(bodySize, role) {
  const base = Number.isFinite(Number(bodySize)) ? Number(bodySize) : 10;
  // The stepper floor is 7pt, so the smallest derived size is 6pt.
  return `${Math.max(6, base + (BODY_OFFSETS[role] ?? 0))}pt`;
}

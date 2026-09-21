import { createId } from "@/lib/createId";
import initialCV from "@/data/initialCV";
import { defaultStyleSettings, preferredDocumentLocale } from "@/data/styleDefaults";
import { defaultTemplateId, getTemplate } from "@/data/templates";

const REGISTRY_KEY = "cv-builder-resumes";

// ─── Helpers ──────────────────────────────────────

export function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write [${key}]:`, e);
  }
}

// ─── Key builders ─────────────────────────────────

export function cvDataKey(id) {
  return `cv-${id}-cvData`;
}
export function styleKey(id) {
  return `cv-${id}-styleSettings`;
}
export function templateKey(id) {
  return `cv-${id}-templateId`;
}
export function pdfNameKey(id) {
  return `cv-${id}-pdfName`;
}
export function openSectionsKey(id) {
  return `cv-${id}-openSections`;
}
// The "Available upon request" switch was removed, but resumes saved while it
// existed still hold this row. Kept so deleting a resume still clears it; it is
// not copied on duplicate and nothing writes it any more.
export function hideReferencesKey(id) {
  return `cv-${id}-hideReferences`;
}

// ─── Registry ─────────────────────────────────────

// The raw list, trash included. Anything that positions or rewrites rows has
// to work from this: the visible list is a filtered view, and an index taken
// from it would point at the wrong row once something is in the trash.
function allResumes() {
  return readJSON(REGISTRY_KEY) || [];
}

export function getResumes() {
  return allResumes().filter((r) => !r.deletedAt);
}

// ─── Trash ────────────────────────────────────────
//
// Deleting used to be immediate and permanent, and a resume exists nowhere
// else - so the only protection was a dialog asking the same question every
// time, which people answer by reflex. A resume now leaves the list but stays
// on disk, which is what makes an undo honest: the row carries deletedAt, so a
// reload during the undo window cannot turn it into either a phantom delete or
// a dead button.

const TRASH_DAYS = 30;

// A browser's storage is not a disk. Past this the oldest go for good, so a
// habit of deleting cannot quietly eat the quota a resume needs.
const TRASH_LIMIT = 10;

export function getTrashedResumes() {
  return allResumes()
    .filter((r) => r.deletedAt)
    .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
}

export function restoreResume(id) {
  // updatedAt is left alone: restoring is not editing, and the card should go
  // back saying when it was last worked on.
  saveResumes(
    allResumes().map((r) => {
      if (r.id !== id) return r;
      const { deletedAt, ...rest } = r;
      return rest;
    })
  );
}

// Empties the trash of anything past its window, and of anything beyond the
// cap. Runs where cleanupEmptyResumes runs.
export function purgeExpiredTrash() {
  const cutoff = Date.now() - TRASH_DAYS * 24 * 60 * 60 * 1000;
  const trashed = getTrashedResumes();

  const doomed = trashed.filter(
    (r, i) => new Date(r.deletedAt).getTime() < cutoff || i >= TRASH_LIMIT
  );

  doomed.forEach((r) => purgeResume(r.id));

  return doomed.length;
}

function saveResumes(list) {
  writeJSON(REGISTRY_KEY, list);
}

// ─── CRUD ─────────────────────────────────────────

export function createResume(name = "Untitled Resume", chosenTemplateId) {
  const id = createId("resume");
  const now = new Date().toISOString();
  const template = chosenTemplateId || defaultTemplateId;

  // Add to registry (store templateId for display on cards)
  const list = allResumes();
  list.unshift({ id, name, templateId: template, createdAt: now, updatedAt: now });
  saveResumes(list);

  // Initialize resume data
  const tpl = getTemplate(template);
  const initialStyle = {
    ...defaultStyleSettings,
    primaryFont: tpl.defaultPrimaryFont,
    secondaryFont: tpl.defaultSecondaryFont,
    // Only the starting value. A language switcher added later changes what new
    // resumes start with, never what a finished one already carries.
    documentLocale: preferredDocumentLocale(),
  };
  writeJSON(cvDataKey(id), initialCV);
  writeJSON(styleKey(id), initialStyle);
  writeJSON(templateKey(id), template);
  writeJSON(pdfNameKey(id), name);

  return id;
}

/** Create a resume pre-filled with custom CV data (for sample or paste import) */
export function createResumeWithData(name = "Untitled Resume", chosenTemplateId, cvData) {
  const id = createId("resume");
  const now = new Date().toISOString();
  const template = chosenTemplateId || defaultTemplateId;

  const list = allResumes();
  list.unshift({ id, name, templateId: template, createdAt: now, updatedAt: now });
  saveResumes(list);

  const tpl = getTemplate(template);
  const initialStyle = {
    ...defaultStyleSettings,
    primaryFont: tpl.defaultPrimaryFont,
    secondaryFont: tpl.defaultSecondaryFont,
    // Only the starting value. A language switcher added later changes what new
    // resumes start with, never what a finished one already carries.
    documentLocale: preferredDocumentLocale(),
  };

  // Merge provided data with initialCV to ensure all fields exist
  writeJSON(cvDataKey(id), { ...initialCV, ...cvData });
  writeJSON(styleKey(id), initialStyle);
  writeJSON(templateKey(id), template);
  writeJSON(pdfNameKey(id), name);

  return id;
}

// Takes a resume out of the list without touching its data, so it can come
// back. This is what the Delete button on a card does.
export function deleteResume(id) {
  saveResumes(
    allResumes().map((r) => (r.id === id ? { ...r, deletedAt: new Date().toISOString() } : r))
  );
}

// The one that cannot be undone: the registry row and every key belonging to
// the resume.
export function purgeResume(id) {
  saveResumes(allResumes().filter((r) => r.id !== id));

  [cvDataKey, styleKey, templateKey, pdfNameKey, openSectionsKey, hideReferencesKey].forEach(
    (keyFn) => {
      try {
        localStorage.removeItem(keyFn(id));
      } catch {}
    }
  );
}

export function renameResume(id, newName) {
  const list = allResumes().map((r) =>
    r.id === id ? { ...r, name: newName, updatedAt: new Date().toISOString() } : r
  );
  saveResumes(list);

  // Also update pdfName to match
  writeJSON(pdfNameKey(id), newName);
}

export function touchResume(id) {
  const list = allResumes().map((r) =>
    r.id === id ? { ...r, updatedAt: new Date().toISOString() } : r
  );
  saveResumes(list);
}

export function updateResumeTemplateId(id, templateId) {
  const list = allResumes().map((r) =>
    r.id === id ? { ...r, templateId, updatedAt: new Date().toISOString() } : r
  );
  saveResumes(list);
}

export function duplicateResume(id) {
  const source = allResumes().find((r) => r.id === id);
  if (!source) return null;

  const newId = createId("resume");
  const now = new Date().toISOString();
  const newName = `${source.name} (Copy)`;

  // Positioned against the raw list on purpose: an index from the visible one
  // would land in the wrong place as soon as anything sits in the trash.
  const list = allResumes();
  const sourceIndex = list.findIndex((r) => r.id === id);
  list.splice(sourceIndex + 1, 0, {
    id: newId,
    name: newName,
    templateId: source.templateId,
    createdAt: now,
    updatedAt: now,
  });
  saveResumes(list);

  // Copy all data
  [cvDataKey, styleKey, templateKey, pdfNameKey, openSectionsKey].forEach((keyFn) => {
    const data = readJSON(keyFn(id));
    if (data !== null) writeJSON(keyFn(newId), data);
  });

  // Set the new name for pdfName
  writeJSON(pdfNameKey(newId), newName);

  return newId;
}

// ─── Migration from old single-CV format ──────────

const OLD_KEYS = {
  cvData: "cv-builder-cvData",
  style: "cv-builder-styleSettings",
  template: "cv-builder-templateId",
  pdfName: "cv-builder-pdfName",
  openSections: "cv-builder-openSections",
};

export function migrateIfNeeded() {
  // Already migrated or fresh user
  const existing = getResumes();
  if (existing.length > 0) return false;

  // Check if old data exists
  const oldCvData = readJSON(OLD_KEYS.cvData);
  if (!oldCvData) return false;

  // Check if old data has any content (not just empty initial)
  const hasContent = oldCvData.name || oldCvData.email || oldCvData.experiences?.length > 0;
  if (!hasContent) return false;

  // Create a resume entry from old data
  const id = createId("resume");
  const now = new Date().toISOString();
  const oldPdfName = readJSON(OLD_KEYS.pdfName) || "My Resume";

  saveResumes([{ id, name: oldPdfName, createdAt: now, updatedAt: now }]);

  // Copy old data to new keys
  writeJSON(cvDataKey(id), oldCvData);

  const oldStyle = readJSON(OLD_KEYS.style);
  if (oldStyle) writeJSON(styleKey(id), oldStyle);

  const oldTemplate = readJSON(OLD_KEYS.template);
  if (oldTemplate) writeJSON(templateKey(id), oldTemplate);

  writeJSON(pdfNameKey(id), oldPdfName);

  const oldSections = readJSON(OLD_KEYS.openSections);
  if (oldSections) writeJSON(openSectionsKey(id), oldSections);

  return true;
}

// ─── Empty Resume Detection ───────────────────────

function isEmptyCV(cvData) {
  if (!cvData) return true;

  // Check if any text field has content
  const textFields = [
    "name",
    "title",
    "phone",
    "email",
    "location",
    "linkedin",
    "website",
    "summary",
  ];
  const hasText = textFields.some((f) => cvData[f] && cvData[f].trim().length > 0);
  if (hasText) return false;

  // Check if any array section has items
  const arraySections = [
    "experiences",
    "education",
    "skills",
    "projects",
    "volunteering",
    "certifications",
    "languages",
    "references",
  ];
  const hasItems = arraySections.some((s) => Array.isArray(cvData[s]) && cvData[s].length > 0);
  if (hasItems) return false;

  return true;
}

// Deleting without asking is only defensible for a resume the user provably
// never worked on, so the bar is deliberately high: still empty, never edited
// since it was created, and left alone for a day. Sixty seconds and an empty
// check alone used to be enough, which threw away the work of anyone who
// picked a template and then stopped to think.
const ABANDONED_AFTER_MS = 24 * 60 * 60 * 1000;

export function cleanupEmptyResumes() {
  // The visible list only: a resume already in the trash has its own clock,
  // and sweeping it here would empty the bin early.
  const list = getResumes();
  const toDelete = [];
  const now = Date.now();

  for (const resume of list) {
    const createdAt = new Date(resume.createdAt).getTime();
    if (now - createdAt < ABANDONED_AFTER_MS) continue;

    // touchResume moves updatedAt on every edit, so an untouched resume is
    // the only one where the two timestamps still match.
    if (resume.updatedAt !== resume.createdAt) continue;

    const cvData = readJSON(cvDataKey(resume.id));
    if (isEmptyCV(cvData)) {
      toDelete.push(resume.id);
    }
  }

  if (toDelete.length === 0) return false;

  // These never existed as far as the user is concerned, so they go straight
  // out rather than into the trash.
  toDelete.forEach((id) => purgeResume(id));

  return true;
}

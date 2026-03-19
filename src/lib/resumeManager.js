import { createId } from "@/lib/createId";
import initialCV from "@/data/initialCV";
import { defaultStyleSettings } from "@/data/styleDefaults";
import { defaultTemplateId } from "@/data/templates";

const REGISTRY_KEY = "cv-builder-resumes";

// ─── Helpers ──────────────────────────────────────

function readJSON(key) {
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

export function cvDataKey(id) { return `cv-${id}-cvData`; }
export function styleKey(id) { return `cv-${id}-styleSettings`; }
export function templateKey(id) { return `cv-${id}-templateId`; }
export function pdfNameKey(id) { return `cv-${id}-pdfName`; }
export function openSectionsKey(id) { return `cv-${id}-openSections`; }

// ─── Registry ─────────────────────────────────────

export function getResumes() {
  return readJSON(REGISTRY_KEY) || [];
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
  const list = getResumes();
  list.unshift({ id, name, templateId: template, createdAt: now, updatedAt: now });
  saveResumes(list);

  // Initialize resume data
  writeJSON(cvDataKey(id), initialCV);
  writeJSON(styleKey(id), defaultStyleSettings);
  writeJSON(templateKey(id), template);
  writeJSON(pdfNameKey(id), name);

  return id;
}

export function deleteResume(id) {
  // Remove from registry
  const list = getResumes().filter((r) => r.id !== id);
  saveResumes(list);

  // Remove resume data
  [cvDataKey, styleKey, templateKey, pdfNameKey, openSectionsKey].forEach((keyFn) => {
    try { localStorage.removeItem(keyFn(id)); } catch {}
  });
}

export function renameResume(id, newName) {
  const list = getResumes().map((r) =>
    r.id === id ? { ...r, name: newName, updatedAt: new Date().toISOString() } : r
  );
  saveResumes(list);

  // Also update pdfName to match
  writeJSON(pdfNameKey(id), newName);
}

export function touchResume(id) {
  const list = getResumes().map((r) =>
    r.id === id ? { ...r, updatedAt: new Date().toISOString() } : r
  );
  saveResumes(list);
}

export function duplicateResume(id) {
  const source = getResumes().find((r) => r.id === id);
  if (!source) return null;

  const newId = createId("resume");
  const now = new Date().toISOString();
  const newName = `${source.name} (Copy)`;

  // Add to registry
  const list = getResumes();
  const sourceIndex = list.findIndex((r) => r.id === id);
  list.splice(sourceIndex + 1, 0, { id: newId, name: newName, createdAt: now, updatedAt: now });
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
  const textFields = ["name", "title", "phone", "email", "location", "linkedin", "website", "summary"];
  const hasText = textFields.some((f) => cvData[f] && cvData[f].trim().length > 0);
  if (hasText) return false;

  // Check if any array section has items
  const arraySections = ["experiences", "education", "skills", "projects", "volunteering", "certifications", "languages", "references"];
  const hasItems = arraySections.some((s) => Array.isArray(cvData[s]) && cvData[s].length > 0);
  if (hasItems) return false;

  return true;
}

export function cleanupEmptyResumes() {
  const list = getResumes();
  const toDelete = [];

  for (const resume of list) {
    const cvData = readJSON(cvDataKey(resume.id));
    if (isEmptyCV(cvData)) {
      toDelete.push(resume.id);
    }
  }

  if (toDelete.length === 0) return false;

  toDelete.forEach((id) => {
    [cvDataKey, styleKey, templateKey, pdfNameKey, openSectionsKey].forEach((keyFn) => {
      try { localStorage.removeItem(keyFn(id)); } catch {}
    });
  });

  const cleaned = list.filter((r) => !toDelete.includes(r.id));
  saveResumes(cleaned);

  return true;
}
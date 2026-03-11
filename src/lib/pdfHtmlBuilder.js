// Builds the full HTML document that gets sent to Puppeteer for PDF generation
// This is the single source of truth for PDF output styling

import { escapeHtml } from "./htmlEscape";

// Helper: joins non-empty contact fields with separator
function joinContact(fields, separator = " | ") {
  return fields
    .filter((v) => v && v.trim() !== "")
    .map(escapeHtml)
    .join(separator);
}

// Helper: formats date range string
function formatDateRange(start, end) {
  const s = escapeHtml(start || "");
  const e = escapeHtml(end || "");
  if (s && e) return `${s} – ${e}`;
  return s || e;
}

export function buildPdfHtml(cv, hideReferences) {
  const name = escapeHtml(cv.name);
  const title = escapeHtml(cv.title);
  const contact = joinContact([cv.phone, cv.email, cv.location, cv.linkedin]);
  const summary = escapeHtml(cv.summary);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Inter, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #333;
    }
    .cv-page { width: 100%; min-height: 297mm; }
    .cv-name {
      font-size: 22pt; font-weight: bold;
      text-align: center; margin-bottom: 2px; color: #000;
    }
    .cv-title {
      text-align: center; font-size: 11pt;
      color: #444; margin-bottom: 8px;
    }
    .cv-contact {
      text-align: center; font-size: 9pt;
      color: #555; margin-bottom: 16px;
    }
    .cv-divider {
      border: none; border-top: 1.5px solid #000;
      margin-bottom: 12px;
    }
    .cv-section-title {
      font-size: 12pt; font-weight: bold; text-transform: uppercase;
      border-bottom: 1px solid #999;
      padding-bottom: 2px; margin-bottom: 6px; margin-top: 14px;
    }
    .cv-section-title:first-of-type { margin-top: 0; }
    .cv-summary { font-size: 10pt; margin-bottom: 14px; }
    .exp-header {
      display: flex; justify-content: space-between;
      font-weight: bold; font-size: 10.5pt;
    }
    .exp-date { font-weight: normal; color: #555; }
    .exp-position {
      font-style: italic; font-size: 10pt; margin-bottom: 4px;
    }
    .exp-bullets { padding-left: 18px; font-size: 10pt; }
    .exp-bullets li { margin-bottom: 2px; }
    .edu-header {
      display: flex; justify-content: space-between;
      font-weight: bold; font-size: 10.5pt;
    }
    .edu-date { font-weight: normal; color: #555; }
    .edu-school { font-size: 10pt; font-style: italic; }
    .skills-list { padding-left: 18px; font-size: 10pt; }
    .skills-list li { margin-bottom: 2px; }
    .project-name { font-weight: bold; font-size: 10.5pt; }
    .project-desc { font-size: 10pt; padding-left: 18px; }
    .mb-12 { margin-bottom: 12px; }
    .mb-8 { margin-bottom: 8px; }

    .exp-header, .edu-header, .project-name, .cv-section-title {
      break-after: avoid;
    }
    .mb-12, .mb-8 { break-inside: avoid; }

    @page { size: A4; margin: 12.7mm; }
  </style>
</head>
<body>
  <div class="cv-page">
    ${name ? `<div class="cv-name">${name}</div>` : ""}
    ${title ? `<div class="cv-title">${title}</div>` : ""}
    ${contact ? `
      <div class="cv-contact">${contact}</div>
      <hr class="cv-divider" />
    ` : ""}

    ${summary ? `
      <div class="cv-section-title">Professional Summary</div>
      <div class="cv-summary">${summary}</div>
    ` : ""}

    ${buildExperienceHtml(cv.experiences)}
    ${buildEducationHtml(cv.education)}
    ${buildSkillsHtml(cv.skills)}
    ${buildProjectsHtml(cv.projects)}
    ${buildReferencesHtml(cv.references, hideReferences)}
  </div>
</body>
</html>`;
}

// ─── Section Builders ────────────────────────────────────────

function buildExperienceHtml(experiences) {
  const filtered = experiences.filter((exp) => exp.company || exp.position);
  if (filtered.length === 0) return "";

  const items = filtered.map((exp) => `
    <div class="mb-12">
      <div class="exp-header">
        <span>${escapeHtml(exp.company)}</span>
        <span class="exp-date">${formatDateRange(exp.startDate, exp.endDate)}</span>
      </div>
      ${exp.position ? `<div class="exp-position">${escapeHtml(exp.position)}</div>` : ""}
      <ul class="exp-bullets" style="list-style-type: disc;">
        ${exp.bullets
          .filter((b) => b.trim() !== "")
          .map((b) => `<li>${escapeHtml(b)}</li>`)
          .join("")}
      </ul>
    </div>
  `).join("");

  return `<div class="cv-section-title">Experience</div>${items}`;
}

function buildEducationHtml(education) {
  const filtered = education.filter((edu) => edu.school || edu.degree);
  if (filtered.length === 0) return "";

  const items = filtered.map((edu) => `
    <div class="mb-8">
      <div class="edu-header">
        <span>${escapeHtml(edu.degree)}</span>
        <span class="edu-date">${escapeHtml(edu.date || "")}</span>
      </div>
      <div class="edu-school">${escapeHtml(edu.school)}</div>
    </div>
  `).join("");

  return `<div class="cv-section-title">Education</div>${items}`;
}

function buildSkillsHtml(skills) {
  const filtered = skills.filter((s) => s.category || s.items);
  if (filtered.length === 0) return "";

  const items = filtered
    .map((s) => `<li><strong>${escapeHtml(s.category)}:</strong> ${escapeHtml(s.items)}</li>`)
    .join("");

  return `
    <div class="cv-section-title">Technical Skills</div>
    <ul class="skills-list" style="list-style-type: disc;">${items}</ul>
  `;
}

function buildProjectsHtml(projects) {
  const filtered = projects.filter((p) => p.name);
  if (filtered.length === 0) return "";

  const items = filtered.map((p) => `
    <div class="mb-8">
      <div class="exp-header">
        <span class="project-name">${escapeHtml(p.name)}</span>
        <span class="exp-date">${formatDateRange(p.startDate, p.endDate)}</span>
      </div>
      <ul class="exp-bullets" style="list-style-type: disc;">
        ${p.bullets
          .filter((b) => b.trim() !== "")
          .map((b) => `<li>${escapeHtml(b)}</li>`)
          .join("")}
      </ul>
    </div>
  `).join("");

  return `<div class="cv-section-title">Technical Projects and Research</div>${items}`;
}

function buildReferencesHtml(references, hideReferences) {
  if (references.length === 0 && !hideReferences) return "";

  const content = hideReferences
    ? `<p style="font-size: 10pt; font-style: italic;">Available upon request</p>`
    : references
        .filter((r) => r.name)
        .map((r) => `
          <div class="mb-8">
            <div style="font-weight: bold; font-size: 10.5pt;">
              ${escapeHtml(r.name)}${r.company ? ` — ${escapeHtml(r.company)}` : ""}
            </div>
            <div style="font-size: 10pt; color: #555;">
              ${escapeHtml(r.phone)}${r.phone && r.email ? " | " : ""}${escapeHtml(r.email)}
            </div>
          </div>
        `).join("");

  return `<div class="cv-section-title">References</div>${content}`;
}
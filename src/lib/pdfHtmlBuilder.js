import { escapeHtml } from "./htmlEscape";
import { defaultStyleSettings, fontOptions } from "@/data/styleDefaults";

function hasValue(value) {
  return typeof value === "string" && value.trim() !== "";
}

function joinContact(fields, separator = " | ") {
  return fields.filter(hasValue).map(escapeHtml).join(separator);
}

function formatDateRange(start, end) {
  const s = escapeHtml(start || "");
  const e = escapeHtml(end || "");

  if (s && e) return `${s} – ${e}`;
  return s || e;
}

function getVisibleReferences(references) {
  return references.filter(
    (ref) =>
      hasValue(ref.name) ||
      hasValue(ref.company) ||
      hasValue(ref.phone) ||
      hasValue(ref.email)
  );
}

/* ─── Resolve font name to CSS font-family ───────── */

function resolveFontFamily(fontName) {
  const font = fontOptions.find((f) => f.name === fontName);
  return font ? font.family : "Inter, sans-serif";
}

/* ─── Build dynamic CSS from styleSettings ───────── */

function buildDynamicCss(settings) {
  const headingFont = resolveFontFamily(settings.primaryFont);
  const bodyFont = resolveFontFamily(settings.secondaryFont);
  const headingSize = `${settings.headingSize}pt`;
  const bodySize = `${settings.bodySize}pt`;
  const lineHeight = settings.lineSpacing;
  const marginTB = `${settings.marginTopBottom}mm`;
  const marginLR = `${settings.marginLeftRight}mm`;
  const sectionGap = `${settings.betweenSections}pt`;
  const titleGap = `${settings.betweenTitleContent}pt`;
  const blockGap = `${settings.betweenContentBlocks}pt`;

  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: ${bodyFont};
      font-size: ${bodySize};
      line-height: ${lineHeight};
      color: #333;
    }

    .cv-page {
      width: 100%;
      min-height: auto;
    }

    .cv-name {
      font-size: 22pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: 2px;
      color: #000;
      font-family: ${headingFont};
    }

    .cv-title {
      text-align: center;
      font-size: 11pt;
      color: #444;
      margin-bottom: 8px;
      font-family: ${bodyFont};
    }

    .cv-contact {
      text-align: center;
      font-size: 9pt;
      color: #555;
      margin-bottom: 16px;
      word-break: break-word;
      font-family: ${bodyFont};
    }

    .cv-divider {
      border: none;
      border-top: 1.5px solid #000;
      margin-bottom: 12px;
    }

    .cv-section-title {
      font-size: ${headingSize};
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1px solid #999;
      padding-bottom: 2px;
      margin-bottom: ${titleGap};
      margin-top: ${sectionGap};
      font-family: ${headingFont};
    }

    .cv-section-title:first-of-type {
      margin-top: 0;
    }

    .cv-summary {
      font-size: ${bodySize};
      margin-bottom: 14px;
      font-family: ${bodyFont};
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 10.5pt;
      gap: 12px;
      font-family: ${headingFont};
    }

    .item-date {
      font-weight: normal;
      color: #555;
      white-space: nowrap;
      font-family: ${bodyFont};
    }

    .item-subtitle {
      font-style: italic;
      font-size: ${bodySize};
      margin-bottom: 4px;
      font-family: ${bodyFont};
    }

    .item-meta {
      font-size: 9.5pt;
      color: #555;
      margin-bottom: 4px;
      word-break: break-word;
      font-family: ${bodyFont};
    }

    .edu-school {
      font-size: ${bodySize};
      font-style: italic;
      margin-bottom: 2px;
      font-family: ${bodyFont};
    }

    .bullets {
      padding-left: 18px;
      font-size: ${bodySize};
      list-style-type: disc;
      font-family: ${bodyFont};
    }

    .bullets li {
      margin-bottom: 2px;
    }

    .skills-list {
      padding-left: 18px;
      font-size: ${bodySize};
      list-style-type: disc;
      font-family: ${bodyFont};
    }

    .skills-list li {
      margin-bottom: 2px;
    }

    .reference-title {
      font-weight: bold;
      font-size: 10.5pt;
      font-family: ${headingFont};
    }

    .reference-contact {
      font-size: ${bodySize};
      color: #555;
      font-family: ${bodyFont};
    }

    .mb-block { margin-bottom: ${blockGap}; }
    .mb-10 { margin-bottom: 10px; }
    .mb-8 { margin-bottom: 8px; }

    .cv-section-title,
    .item-header,
    .reference-title {
      break-after: avoid;
    }

    .mb-block,
    .mb-10,
    .mb-8 {
      break-inside: avoid;
    }

    @page {
      size: A4;
      margin: ${marginTB} ${marginLR};
    }
  `;
}

export function buildPdfHtml(cv, hideReferences, styleSettings = null) {
  const settings = styleSettings || defaultStyleSettings;
  const dynamicCss = buildDynamicCss(settings);

  const name = escapeHtml(cv.name || "");
  const title = escapeHtml(cv.title || "");
  const contact = joinContact([
    cv.phone,
    cv.email,
    cv.location,
    cv.linkedin,
    cv.website,
  ]);
  const summary = escapeHtml(cv.summary || "");
  const visibleReferences = getVisibleReferences(cv.references || []);
  const sectionOrder =
    settings.sectionOrder || defaultStyleSettings.sectionOrder;

  const sectionBuilders = {
    summary: () =>
      summary
        ? `
          <div class="cv-section-title">Professional Summary</div>
          <div class="cv-summary">${summary}</div>
        `
        : "",
    experience: () => buildExperienceHtml(cv.experiences || []),
    education: () => buildEducationHtml(cv.education || []),
    skills: () => buildSkillsHtml(cv.skills || []),
    projects: () => buildProjectsHtml(cv.projects || []),
    volunteering: () => buildVolunteeringHtml(cv.volunteering || []),
    certifications: () => buildCertificationsHtml(cv.certifications || []),
    languages: () => buildLanguagesHtml(cv.languages || []),
    references: () => buildReferencesHtml(visibleReferences, hideReferences),
  };

  const orderedSections = sectionOrder
    .map((sectionId) => sectionBuilders[sectionId]?.() || "")
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${dynamicCss}</style>
</head>
<body>
  <div class="cv-page">
    ${name ? `<div class="cv-name">${name}</div>` : ""}
    ${title ? `<div class="cv-title">${title}</div>` : ""}
    ${contact ? `
      <div class="cv-contact">${contact}</div>
      <hr class="cv-divider" />
    ` : ""}

    ${orderedSections}
  </div>
</body>
</html>`;
}

// ─── Section Builders ────────────────────────────────────────

function buildExperienceHtml(experiences) {
  const filtered = experiences.filter(
    (exp) => hasValue(exp.company) || hasValue(exp.position)
  );

  if (filtered.length === 0) return "";

  const items = filtered
    .map((exp) => {
      const subtitle = [exp.position, exp.location]
        .filter(hasValue)
        .map(escapeHtml)
        .join(" | ");

      const bullets = (exp.bullets || [])
        .filter(hasValue)
        .map((b) => `<li>${escapeHtml(b)}</li>`)
        .join("");

      return `
        <div class="mb-block">
          <div class="item-header">
            <span>${escapeHtml(exp.company || "")}</span>
            <span class="item-date">${formatDateRange(exp.startDate, exp.endDate)}</span>
          </div>
          ${subtitle ? `<div class="item-subtitle">${subtitle}</div>` : ""}
          ${bullets ? `<ul class="bullets">${bullets}</ul>` : ""}
        </div>
      `;
    })
    .join("");

  return `<div class="cv-section-title">Experience</div>${items}`;
}

function buildEducationHtml(education) {
  const filtered = education.filter(
    (edu) => hasValue(edu.school) || hasValue(edu.degree)
  );

  if (filtered.length === 0) return "";

  const items = filtered
    .map((edu) => {
      const schoolLine = [edu.school, edu.location]
        .filter(hasValue)
        .map(escapeHtml)
        .join(" | ");

      return `
        <div class="mb-block">
          <div class="item-header">
            <span>${escapeHtml(edu.degree || "")}</span>
            <span class="item-date">${formatDateRange(edu.startDate, edu.endDate)}</span>
          </div>
          ${schoolLine ? `<div class="edu-school">${schoolLine}</div>` : ""}
          ${
            hasValue(edu.additionalInfo)
              ? `<div class="item-meta">${escapeHtml(edu.additionalInfo)}</div>`
              : ""
          }
        </div>
      `;
    })
    .join("");

  return `<div class="cv-section-title">Education</div>${items}`;
}

function buildSkillsHtml(skills) {
  const filtered = skills.filter(
    (skill) => hasValue(skill.category) || hasValue(skill.items)
  );

  if (filtered.length === 0) return "";

  const items = filtered
    .map((skill) => {
      const category = escapeHtml(skill.category || "");
      const skillItems = escapeHtml(skill.items || "");

      return `<li>${
        category ? `<strong>${category}</strong>` : ""
      }${category && skillItems ? ": " : ""}${skillItems}</li>`;
    })
    .join("");

  return `
    <div class="cv-section-title">Technical Skills</div>
    <ul class="skills-list mb-10">${items}</ul>
  `;
}

function buildProjectsHtml(projects) {
  const filtered = projects.filter((project) => hasValue(project.name));

  if (filtered.length === 0) return "";

  const items = filtered
    .map((project) => {
      const bullets = (project.bullets || [])
        .filter(hasValue)
        .map((b) => `<li>${escapeHtml(b)}</li>`)
        .join("");

      return `
        <div class="mb-block">
          <div class="item-header">
            <span>${escapeHtml(project.name || "")}</span>
            <span class="item-date">${formatDateRange(project.startDate, project.endDate)}</span>
          </div>
          ${bullets ? `<ul class="bullets">${bullets}</ul>` : ""}
        </div>
      `;
    })
    .join("");

  return `<div class="cv-section-title">Technical Projects and Research</div>${items}`;
}

function buildVolunteeringHtml(volunteering) {
  const filtered = volunteering.filter(
    (item) => hasValue(item.organization) || hasValue(item.role)
  );

  if (filtered.length === 0) return "";

  const items = filtered
    .map((item) => {
      const subtitle = [item.role, item.location]
        .filter(hasValue)
        .map(escapeHtml)
        .join(" | ");

      const bullets = (item.bullets || [])
        .filter(hasValue)
        .map((b) => `<li>${escapeHtml(b)}</li>`)
        .join("");

      return `
        <div class="mb-block">
          <div class="item-header">
            <span>${escapeHtml(item.organization || "")}</span>
            <span class="item-date">${formatDateRange(item.startDate, item.endDate)}</span>
          </div>
          ${subtitle ? `<div class="item-subtitle">${subtitle}</div>` : ""}
          ${bullets ? `<ul class="bullets">${bullets}</ul>` : ""}
        </div>
      `;
    })
    .join("");

  return `<div class="cv-section-title">Volunteering & Leadership</div>${items}`;
}

function buildCertificationsHtml(certifications) {
  const filtered = certifications.filter(
    (item) => hasValue(item.name) || hasValue(item.institution)
  );

  if (filtered.length === 0) return "";

  const items = filtered
    .map((item) => {
      return `
        <div class="mb-block">
          <div class="item-header">
            <span>${escapeHtml(item.name || "")}</span>
            <span class="item-date">${formatDateRange(item.dateAcquired, item.expirationDate)}</span>
          </div>
          ${
            hasValue(item.institution)
              ? `<div class="item-subtitle">${escapeHtml(item.institution)}</div>`
              : ""
          }
        </div>
      `;
    })
    .join("");

  return `<div class="cv-section-title">Certifications</div>${items}`;
}

function buildLanguagesHtml(languages) {
  const filtered = languages.filter(
    (item) => hasValue(item.language) || hasValue(item.fluencyLevel)
  );

  if (filtered.length === 0) return "";

  const items = filtered
    .map((item) => {
      const language = escapeHtml(item.language || "");
      const fluency = escapeHtml(item.fluencyLevel || "");

      return `<li>${
        language ? `<strong>${language}</strong>` : ""
      }${language && fluency ? ": " : ""}${fluency}</li>`;
    })
    .join("");

  return `
    <div class="cv-section-title">Languages</div>
    <ul class="skills-list mb-10">${items}</ul>
  `;
}

function buildReferencesHtml(visibleReferences, hideReferences) {
  if (!hideReferences && visibleReferences.length === 0) return "";

  if (hideReferences) {
    return `
      <div class="cv-section-title">References</div>
      <div class="mb-10"><em>Available upon request</em></div>
    `;
  }

  const items = visibleReferences
    .map((ref) => {
      const contact = [ref.phone, ref.email]
        .filter(hasValue)
        .map(escapeHtml)
        .join(" | ");

      return `
        <div class="mb-8">
          <div class="reference-title">
            ${escapeHtml(ref.name || "")}${hasValue(ref.company) ? ` — ${escapeHtml(ref.company)}` : ""}
          </div>
          ${contact ? `<div class="reference-contact">${contact}</div>` : ""}
        </div>
      `;
    })
    .join("");

  return `<div class="cv-section-title">References</div>${items}`;
}
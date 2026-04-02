import { escapeHtml } from "./htmlEscape";
import { hasValue, formatDateRange as _formatDateRange, getVisibleReferences, resolveFontFamily } from "./cvHelpers";
import { defaultStyleSettings } from "@/data/styleDefaults";

function joinContact(fields, separator = " | ") {
  return fields.filter(hasValue).map(escapeHtml).join(separator);
}

/** PDF-safe date range — escapes HTML entities before output */
function formatDateRange(start, end) {
  return escapeHtml(_formatDateRange(start, end));
}

/* ─── Contact SVG icons for Advanced template ────── */

const contactIcons = {
  email: '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 3px;"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>',
  phone: '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 3px;"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>',
  location: '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 3px;"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
  linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 3px;"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
  website: '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 3px;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
};

function buildAdvancedContactHtml(cv, t) {
  const items = [];
  if (hasValue(cv.email)) items.push(`<span>${contactIcons.email}${escapeHtml(cv.email)}</span>`);
  if (hasValue(cv.phone)) items.push(`<span>${contactIcons.phone}${escapeHtml(cv.phone)}</span>`);
  if (hasValue(cv.location)) items.push(`<span>${contactIcons.location}${escapeHtml(cv.location)}</span>`);
  if (hasValue(cv.linkedin)) {
    const linkedinHref = cv.linkedin.startsWith("http") ? escapeHtml(cv.linkedin) : `https://${escapeHtml(cv.linkedin)}`;
    items.push(`<a href="${linkedinHref}" target="_blank" style="color:#555;text-decoration:none;">${contactIcons.linkedin}${escapeHtml(t.linkedinLabel || "LinkedIn")}</a>`);
  }
  if (hasValue(cv.website)) {
    const websiteHref = cv.website.startsWith("http") ? escapeHtml(cv.website) : `https://${escapeHtml(cv.website)}`;
    items.push(`<a href="${websiteHref}" target="_blank" style="color:#555;text-decoration:none;">${contactIcons.website}${escapeHtml(t.portfolioLabel || "Portfolio")}</a>`);
  }
  return items.join('&nbsp;&nbsp;&nbsp;');
}

/* ─── Build dynamic CSS from styleSettings ───────── */

function buildDynamicCss(settings, templateId) {
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
  const isProfessional = templateId === "professional";

  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: ${bodyFont};
      font-size: ${bodySize};
      line-height: ${lineHeight};
      color: #333;
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .cv-page {
      width: 100%;
      min-height: auto;
    }

    .cv-name {
      font-size: ${isProfessional ? "20pt" : "22pt"};
      font-weight: bold;
      text-align: center;
      margin-bottom: 2px;
      color: #000;
      font-family: ${headingFont};
      ${isProfessional ? "text-transform: uppercase; letter-spacing: 3px;" : ""}
    }

    .cv-title {
      text-align: center;
      font-size: ${isProfessional ? "10pt" : "11pt"};
      color: #444;
      margin-bottom: 8px;
      font-family: ${bodyFont};
      ${isProfessional ? "text-transform: uppercase; letter-spacing: 1.5px;" : ""}
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
      border-bottom: 1px solid #999;
      padding-bottom: 2px;
      margin-bottom: ${titleGap};
      margin-top: ${sectionGap};
      font-family: ${headingFont};
      ${isProfessional ? "letter-spacing: 2px;" : ""}
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
      padding-left: ${isProfessional ? "30px" : "18px"};
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

    .credential-link {
      font-size: 9pt;
      color: #2563eb;
      text-decoration: none;
      margin-top: 2px;
      display: inline-block;
      font-style: normal;
    }

    .credential-link:hover {
      text-decoration: underline;
    }

    .cert-description {
      font-size: 9.5pt;
      color: #555;
      margin-top: 2px;
    }

    .cv-section-title,
    .item-header,
    .reference-title {
      break-after: avoid;
    }

    ${settings.keepItemsTogether ? `
    .mb-block,
    .mb-10,
    .mb-8 {
      break-inside: avoid;
    }
    ` : `
    .item-start-block {
      break-inside: avoid;
    }
    `}

    @page {
      size: A4;
      margin: ${marginTB} ${marginLR};
    }
  `;
}

export function buildPdfHtml(cv, hideReferences, styleSettings = null, templateId = "classic", pdfName = "Resume") {
  const settings = styleSettings || defaultStyleSettings;
  const dynamicCss = buildDynamicCss(settings, templateId);
  const t = cv.sectionTitles || {};

  const name = escapeHtml(cv.name || "");
  const title = escapeHtml(cv.title || "");
  const contactParts = [cv.phone, cv.email, cv.location].filter(hasValue).map(escapeHtml);
  if (hasValue(cv.linkedin)) contactParts.push(`<a href="${escapeHtml(cv.linkedin.startsWith('http') ? cv.linkedin : 'https://' + cv.linkedin)}" style="color:#333;text-decoration:none;">${escapeHtml(t.linkedinLabel || "LinkedIn")}</a>`);
  if (hasValue(cv.website)) contactParts.push(`<a href="${escapeHtml(cv.website.startsWith('http') ? cv.website : 'https://' + cv.website)}" style="color:#333;text-decoration:none;">${escapeHtml(t.portfolioLabel || "Portfolio")}</a>`);
  const contact = contactParts.join(" | ");
  const hasContact = hasValue(cv.email) || hasValue(cv.phone) || hasValue(cv.location) || hasValue(cv.linkedin) || hasValue(cv.website);
  const summary = escapeHtml(cv.summary || "");
  const visibleReferences = getVisibleReferences(cv.references || []);
  const sectionOrder =
    settings.sectionOrder || defaultStyleSettings.sectionOrder;

  const keepTogether = settings.keepItemsTogether === true;

  const sectionBuilders = {
    summary: () =>
      summary
        ? `
          <div class="cv-section-title">${escapeHtml(t.summary || "Professional Summary")}</div>
          <div class="cv-summary">${summary}</div>
        `
        : "",
    experience: () => buildExperienceHtml(cv.experiences || [], keepTogether, templateId, t),
    education: () => buildEducationHtml(cv.education || [], t),
    skills: () => buildSkillsHtml(cv.skills || [], templateId, t),
    projects: () => buildProjectsHtml(cv.projects || [], templateId, keepTogether, t),
    volunteering: () => buildVolunteeringHtml(cv.volunteering || [], keepTogether, t),
    certifications: () => buildCertificationsHtml(cv.certifications || [], templateId, t),
    languages: () => buildLanguagesHtml(cv.languages || [], t),
    references: () => buildReferencesHtml(visibleReferences, hideReferences, t),
  };

  const orderedSections = sectionOrder
    .map((sectionId) => sectionBuilders[sectionId]?.() || "")
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${pdfName}</title>
  <style>${dynamicCss}</style>
</head>
<body>
  <div class="cv-page">
    ${name ? `<div class="cv-name">${name}</div>` : ""}
    ${title ? `<div class="cv-title">${title}</div>` : ""}
    ${hasContact ? `
      ${templateId === "professional" ? '<hr class="cv-divider" />' : ""}
      <div class="cv-contact">${templateId === "advanced" ? buildAdvancedContactHtml(cv, t) : contact}</div>
      <hr class="cv-divider" />
    ` : ""}

    ${orderedSections}
  </div>
</body>
</html>`;
}

// ─── Section Builders ────────────────────────────────────────

function buildExperienceHtml(experiences, keepTogether, templateId, t = {}) {
  const filtered = experiences.filter(
    (exp) => hasValue(exp.company) || hasValue(exp.position)
  );

  if (filtered.length === 0) return "";

  const isProfessional = templateId === "professional";

  const items = filtered
    .map((exp) => {
      const bulletItems = (exp.bullets || []).filter(hasValue);

      let headerHtml;
      if (isProfessional) {
        const leftParts = [exp.position, exp.company].filter(hasValue).map(escapeHtml);
        const rightParts = [formatDateRange(exp.startDate, exp.endDate), exp.location].filter(hasValue).map(escapeHtml);
        headerHtml = `
          <div class="item-header">
            <span>${leftParts.join(", ")}</span>
            <span class="item-date">${rightParts.join(" | ")}</span>
          </div>
        `;
      } else {
        const subtitle = [exp.position, exp.location].filter(hasValue).map(escapeHtml).join(" | ");
        headerHtml = `
          <div class="item-header">
            <span>${escapeHtml(exp.company || "")}</span>
            <span class="item-date">${formatDateRange(exp.startDate, exp.endDate)}</span>
          </div>
          ${subtitle ? `<div class="item-subtitle">${subtitle}</div>` : ""}
        `;
      }

      if (keepTogether || bulletItems.length <= 1) {
        const bullets = bulletItems.map((b) => `<li>${escapeHtml(b)}</li>`).join("");
        return `
          <div class="mb-block">
            ${headerHtml}
            ${bullets ? `<ul class="bullets">${bullets}</ul>` : ""}
          </div>
        `;
      } else {
        const firstBullet = `<li>${escapeHtml(bulletItems[0])}</li>`;
        const remainingBullets = bulletItems.slice(1).map((b, j) => {
          const isLast = j === bulletItems.length - 2;
          return `<div${isLast ? ' class="mb-block"' : ''}><ul class="bullets" style="margin-top:0">${`<li>${escapeHtml(b)}</li>`}</ul></div>`;
        }).join("");

        return `
          <div class="item-start-block">
            ${headerHtml}
            <ul class="bullets">${firstBullet}</ul>
          </div>
          ${remainingBullets}
        `;
      }
    })
    .join("");

  return `<div class="cv-section-title">${escapeHtml(t.experience || "Work Experience")}</div>${items}`;
}

function buildEducationHtml(education, t = {}) {
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

  return `<div class="cv-section-title">${escapeHtml(t.education || "Education")}</div>${items}`;
}

function buildSkillsHtml(skills, templateId, t = {}) {
  const filtered = skills.filter(
    (skill) => hasValue(skill.category) || hasValue(skill.items)
  );

  if (filtered.length === 0) return "";

  const sectionTitle = `<div class="cv-section-title">${escapeHtml(t.skills || "Technical Skills")}</div>`;

  if (templateId === "professional") {
    const items = filtered
      .map((skill) => {
        const category = escapeHtml(skill.category || "");
        const skillItems = escapeHtml(skill.items || "");
        return `<div style="margin-bottom:4px">${
          category ? `<strong>${category}</strong>` : ""
        }${category && skillItems ? ": " : ""}${skillItems}</div>`;
      })
      .join("");

    return `
      ${sectionTitle}
      <div class="mb-10">${items}</div>
    `;
  }

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
    ${sectionTitle}
    <ul class="skills-list mb-10">${items}</ul>
  `;
}

function buildProjectsHtml(projects, templateId, keepTogether, t = {}) {
  const filtered = projects.filter((project) => hasValue(project.name));

  if (filtered.length === 0) return "";

  const items = filtered
    .map((project) => {
      const bulletItems = (project.bullets || []).filter(hasValue);

      if (keepTogether || bulletItems.length <= 1) {
        const bullets = bulletItems.map((b) => `<li>${escapeHtml(b)}</li>`).join("");
        return `
          <div class="mb-block">
            <div class="item-header">
              <span>${escapeHtml(project.name || "")}</span>
              <span class="item-date">${formatDateRange(project.startDate, project.endDate)}</span>
            </div>
            ${templateId === "advanced" && hasValue(project.url)
              ? `<div class="item-meta">${escapeHtml(project.url)}</div>`
              : ""}
            ${bullets ? `<ul class="bullets">${bullets}</ul>` : ""}
          </div>
        `;
      } else {
        const firstBullet = `<li>${escapeHtml(bulletItems[0])}</li>`;
        const remainingBullets = bulletItems.slice(1).map((b, j) => {
          const isLast = j === bulletItems.length - 2;
          return `<div${isLast ? ' class="mb-block"' : ''}><ul class="bullets" style="margin-top:0">${`<li>${escapeHtml(b)}</li>`}</ul></div>`;
        }).join("");

        return `
          <div class="item-start-block">
            <div class="item-header">
              <span>${escapeHtml(project.name || "")}</span>
              <span class="item-date">${formatDateRange(project.startDate, project.endDate)}</span>
            </div>
            ${templateId === "advanced" && hasValue(project.url)
              ? `<div class="item-meta">${escapeHtml(project.url)}</div>`
              : ""}
            <ul class="bullets">${firstBullet}</ul>
          </div>
          ${remainingBullets}
        `;
      }
    })
    .join("");

  return `<div class="cv-section-title">${escapeHtml(t.projects || "Technical Projects and Research")}</div>${items}`;
}

function buildVolunteeringHtml(volunteering, keepTogether, t = {}) {
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

      const bulletItems = (item.bullets || []).filter(hasValue);

      if (keepTogether || bulletItems.length <= 1) {
        const bullets = bulletItems.map((b) => `<li>${escapeHtml(b)}</li>`).join("");
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
      } else {
        const firstBullet = `<li>${escapeHtml(bulletItems[0])}</li>`;
        const remainingBullets = bulletItems.slice(1).map((b, j) => {
          const isLast = j === bulletItems.length - 2;
          return `<div${isLast ? ' class="mb-block"' : ''}><ul class="bullets" style="margin-top:0">${`<li>${escapeHtml(b)}</li>`}</ul></div>`;
        }).join("");

        return `
          <div class="item-start-block">
            <div class="item-header">
              <span>${escapeHtml(item.organization || "")}</span>
              <span class="item-date">${formatDateRange(item.startDate, item.endDate)}</span>
            </div>
            ${subtitle ? `<div class="item-subtitle">${subtitle}</div>` : ""}
            <ul class="bullets">${firstBullet}</ul>
          </div>
          ${remainingBullets}
        `;
      }
    })
    .join("");

  return `<div class="cv-section-title">${escapeHtml(t.volunteering || "Volunteering & Leadership")}</div>${items}`;
}

function buildCertificationsHtml(certifications, templateId, t = {}) {
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
          ${hasValue(item.institution) || (templateId === "advanced" && hasValue(item.url))
            ? `<div class="item-subtitle">${escapeHtml(item.institution || "")}${
                hasValue(item.institution) && templateId === "advanced" && hasValue(item.url) ? " – " : ""
              }${
                templateId === "advanced" && hasValue(item.url)
                  ? `<a class="credential-link" href="${escapeHtml(item.url)}" target="_blank">View Credentials</a>`
                  : ""
              }</div>`
            : ""}
          ${templateId === "advanced" && hasValue(item.description)
            ? `<div class="cert-description">${escapeHtml(item.description)}</div>`
            : ""}
        </div>
      `;
    })
    .join("");

  return `<div class="cv-section-title">${escapeHtml(t.certifications || "Certifications")}</div>${items}`;
}

function buildLanguagesHtml(languages, t = {}) {
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
    <div class="cv-section-title">${escapeHtml(t.languages || "Languages")}</div>
    <ul class="skills-list mb-10">${items}</ul>
  `;
}

function buildReferencesHtml(visibleReferences, hideReferences, t = {}) {
  if (!hideReferences && visibleReferences.length === 0) return "";

  const sectionTitle = `<div class="cv-section-title">${escapeHtml(t.references || "References")}</div>`;

  if (hideReferences) {
    return `
      ${sectionTitle}
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

  return `${sectionTitle}${items}`;
}
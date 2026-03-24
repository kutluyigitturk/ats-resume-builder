"use client";

import { useRef, useState, useLayoutEffect, useMemo } from "react";
import { cvStyles } from "@/lib/constants";
import { fontOptions, defaultStyleSettings } from "@/data/styleDefaults";
import { MailIcon, PhoneIcon, MapPinIcon, LinkedInIcon, LinkIcon } from "@/icons";

/* ─── Helpers ────────────────────────────────────── */

function hasValue(v) {
  return typeof v === "string" && v.trim() !== "";
}

function hasContactInfo(cv) {
  return [cv.phone, cv.email, cv.location, cv.linkedin, cv.website].some(hasValue);
}

function formatContact(cv) {
  return [cv.phone, cv.email, cv.location, cv.linkedin, cv.website]
    .filter(hasValue)
    .join(" | ");
}

function getVisibleReferences(refs) {
  return refs.filter(
    (r) => hasValue(r.name) || hasValue(r.company) || hasValue(r.phone) || hasValue(r.email)
  );
}

function formatDateRange(start, end) {
  if (hasValue(start) && hasValue(end)) return `${start} – ${end}`;
  return start || end || "";
}

/* ─── Resolve font name to CSS font-family ───────── */

function resolveFontFamily(fontName) {
  const font = fontOptions.find((f) => f.name === fontName);
  return font ? font.family : "Inter, sans-serif";
}

/* ─── Build resolved styles from base + settings ─── */

function buildResolvedStyles(settings) {
  const headingFont = resolveFontFamily(settings.primaryFont);
  const bodyFont = resolveFontFamily(settings.secondaryFont);
  const headingSize = `${settings.headingSize}pt`;
  const bodySize = `${settings.bodySize}pt`;
  const lineHeight = `${settings.lineSpacing}`;
  const sectionGap = `${settings.betweenSections}pt`;
  const titleGap = `${settings.betweenTitleContent}pt`;
  const blockGap = `${settings.betweenContentBlocks}pt`;

  return {
    page: {
      ...cvStyles.page,
      fontFamily: bodyFont,
      fontSize: bodySize,
      lineHeight,
      padding: `${settings.marginTopBottom}mm ${settings.marginLeftRight}mm`,
    },
    name: { ...cvStyles.name, fontFamily: headingFont },
    title: { ...cvStyles.title, fontFamily: bodyFont },
    contact: { ...cvStyles.contact, fontFamily: bodyFont },
    divider: cvStyles.divider,
    sectionTitle: {
      ...cvStyles.sectionTitle,
      fontFamily: headingFont,
      fontSize: headingSize,
      marginTop: sectionGap,
      marginBottom: titleGap,
    },
    sectionTitleFirst: {
      ...cvStyles.sectionTitleFirst,
      fontFamily: headingFont,
      fontSize: headingSize,
      marginBottom: titleGap,
    },
    summary: { ...cvStyles.summary, fontFamily: bodyFont, fontSize: bodySize },
    itemHeader: { ...cvStyles.itemHeader, fontFamily: headingFont },
    itemDate: { ...cvStyles.itemDate, fontFamily: bodyFont },
    itemSubtitle: { ...cvStyles.itemSubtitle, fontFamily: bodyFont },
    bulletList: { ...cvStyles.bulletList, fontFamily: bodyFont, fontSize: bodySize },
    bulletItem: cvStyles.bulletItem,
    referenceTitle: { ...cvStyles.referenceTitle, fontFamily: headingFont },
    referenceContact: { ...cvStyles.referenceContact, fontFamily: bodyFont },
    blockGap,
  };
}

/* ─── Constants ──────────────────────────────────── */

const PAGE_GAP_PX = 30;
const PAGE_HEIGHT_BUFFER = 10;

/* ─── Section block builders ─────────────────────── */

function buildSummaryBlocks(cv, styles, isFirst) {
  if (!hasValue(cv.summary)) return [];
  const titleStyle = isFirst ? styles.sectionTitleFirst : styles.sectionTitle;

  return [
    {
      key: "summary-header",
      type: "section-header",
      element: <h2 style={titleStyle}>Professional Summary</h2>,
    },
    {
      key: "summary-content",
      type: "content",
      element: <p style={styles.summary}>{cv.summary}</p>,
    },
  ];
}

function buildExperienceBlocks(cv, styles, isFirst, templateId, keepTogether) {
  const visible = (cv.experiences || []).filter(
    (e) => hasValue(e.company) || hasValue(e.position)
  );
  if (visible.length === 0) return [];

  const titleStyle = isFirst ? styles.sectionTitleFirst : styles.sectionTitle;
  const blocks = [
    {
      key: "exp-header",
      type: "section-header",
      element: <h2 style={titleStyle}>Experience</h2>,
    },
  ];

  visible.forEach((exp, i) => {
    const visibleBullets = (exp.bullets || []).filter((b) => hasValue(b));

    if (keepTogether || visibleBullets.length <= 1) {
      // Keep entire item as one block (original behavior)
      blocks.push({
        key: `exp-${exp.id ?? i}`,
        type: "item",
        element: (
          <div style={{ marginBottom: styles.blockGap }}>
            <div style={styles.itemHeader}>
              <span>{exp.company}</span>
              <span style={styles.itemDate}>
                {formatDateRange(exp.startDate, exp.endDate)}
              </span>
            </div>

            {(hasValue(exp.position) || hasValue(exp.location)) && (
              <p style={styles.itemSubtitle}>
                {exp.position}
                {hasValue(exp.position) && hasValue(exp.location) ? " | " : ""}
                {exp.location}
              </p>
            )}

            {visibleBullets.length > 0 && (
              <ul style={styles.bulletList}>
                {visibleBullets.map((bullet, j) => (
                  <li key={j} style={styles.bulletItem}>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ),
      });
    } else {
      // Split: header + first bullet together, remaining bullets separate
      blocks.push({
        key: `exp-${exp.id ?? i}-start`,
        type: "item-start",
        element: (
          <div>
            <div style={styles.itemHeader}>
              <span>{exp.company}</span>
              <span style={styles.itemDate}>
                {formatDateRange(exp.startDate, exp.endDate)}
              </span>
            </div>

            {(hasValue(exp.position) || hasValue(exp.location)) && (
              <p style={styles.itemSubtitle}>
                {exp.position}
                {hasValue(exp.position) && hasValue(exp.location) ? " | " : ""}
                {exp.location}
              </p>
            )}

            <ul style={styles.bulletList}>
              <li style={styles.bulletItem}>{visibleBullets[0]}</li>
            </ul>
          </div>
        ),
      });

      visibleBullets.slice(1).forEach((bullet, j) => {
        const isLast = j === visibleBullets.length - 2;
        blocks.push({
          key: `exp-${exp.id ?? i}-bullet-${j + 1}`,
          type: "item-bullet",
          element: (
            <div style={isLast ? { marginBottom: styles.blockGap } : undefined}>
              <ul style={{ ...styles.bulletList, marginTop: 0 }}>
                <li style={styles.bulletItem}>{bullet}</li>
              </ul>
            </div>
          ),
        });
      });
    }
  });

  return blocks;
}

function buildEducationBlocks(cv, styles, isFirst) {
  const visible = (cv.education || []).filter(
    (e) => hasValue(e.school) || hasValue(e.degree)
  );
  if (visible.length === 0) return [];

  const titleStyle = isFirst ? styles.sectionTitleFirst : styles.sectionTitle;
  const blocks = [
    {
      key: "edu-header",
      type: "section-header",
      element: <h2 style={titleStyle}>Education</h2>,
    },
  ];

  visible.forEach((edu, i) => {
    blocks.push({
      key: `edu-${edu.id ?? i}`,
      type: "item",
      element: (
        <div style={{ marginBottom: styles.blockGap }}>
          <div style={styles.itemHeader}>
            <span>{edu.degree}</span>
            <span style={styles.itemDate}>
              {formatDateRange(edu.startDate, edu.endDate)}
            </span>
          </div>

          {(hasValue(edu.school) || hasValue(edu.location)) && (
            <p
              style={{
                fontFamily: styles.page.fontFamily,
                fontSize: styles.page.fontSize,
                fontStyle: "italic",
                marginBottom: "2px",
              }}
            >
              {edu.school}
              {hasValue(edu.school) && hasValue(edu.location) ? " | " : ""}
              {edu.location}
            </p>
          )}

          {hasValue(edu.additionalInfo) && (
            <p
              style={{
                fontFamily: styles.page.fontFamily,
                fontSize: "9.5pt",
                color: "#555",
              }}
            >
              {edu.additionalInfo}
            </p>
          )}
        </div>
      ),
    });
  });

  return blocks;
}

function buildSkillsBlocks(cv, styles, isFirst) {
  const visible = (cv.skills || []).filter(
    (s) => hasValue(s.category) || hasValue(s.items)
  );
  if (visible.length === 0) return [];

  const titleStyle = isFirst ? styles.sectionTitleFirst : styles.sectionTitle;
  const blocks = [
    {
      key: "skills-header",
      type: "section-header",
      element: <h2 style={titleStyle}>Technical Skills</h2>,
    },
  ];

  visible.forEach((skill, i) => {
    blocks.push({
      key: `skill-${skill.id ?? i}`,
      type: "item",
      element: (
        <div
          style={{
            paddingLeft: "18px",
            fontFamily: styles.page.fontFamily,
            fontSize: styles.page.fontSize,
            position: "relative",
            marginBottom: "4px",
          }}
        >
          <span style={{ position: "absolute", left: "4px" }}>•</span>
          {hasValue(skill.category) && <strong>{skill.category}</strong>}
          {hasValue(skill.category) && hasValue(skill.items) ? ": " : ""}
          {skill.items}
        </div>
      ),
    });
  });

  return blocks;
}

function buildProjectsBlocks(cv, styles, isFirst, templateId, keepTogether) {
  const visible = (cv.projects || []).filter((p) => hasValue(p.name));
  if (visible.length === 0) return [];

  const titleStyle = isFirst ? styles.sectionTitleFirst : styles.sectionTitle;
  const blocks = [
    {
      key: "projects-header",
      type: "section-header",
      element: <h2 style={titleStyle}>Technical Projects and Research</h2>,
    },
  ];

  visible.forEach((project, i) => {
    const visibleBullets = (project.bullets || []).filter((b) => hasValue(b));

    if (keepTogether || visibleBullets.length <= 1) {
      blocks.push({
        key: `project-${project.id ?? i}`,
        type: "item",
        element: (
          <div style={{ marginBottom: styles.blockGap }}>
            <div style={styles.itemHeader}>
              <span>{project.name}</span>
              <span style={styles.itemDate}>
                {formatDateRange(project.startDate, project.endDate)}
              </span>
            </div>

            {templateId === "advanced" && hasValue(project.url) && (
              <p
                style={{
                  fontFamily: styles.page.fontFamily,
                  fontSize: "9.5pt",
                  color: "#555",
                  marginBottom: "4px",
                }}
              >
                {project.url}
              </p>
            )}

            {visibleBullets.length > 0 && (
              <ul style={styles.bulletList}>
                {visibleBullets.map((bullet, j) => (
                  <li key={j} style={styles.bulletItem}>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ),
      });
    } else {
      blocks.push({
        key: `project-${project.id ?? i}-start`,
        type: "item-start",
        element: (
          <div>
            <div style={styles.itemHeader}>
              <span>{project.name}</span>
              <span style={styles.itemDate}>
                {formatDateRange(project.startDate, project.endDate)}
              </span>
            </div>

            {templateId === "advanced" && hasValue(project.url) && (
              <p
                style={{
                  fontFamily: styles.page.fontFamily,
                  fontSize: "9.5pt",
                  color: "#555",
                  marginBottom: "4px",
                }}
              >
                {project.url}
              </p>
            )}

            <ul style={styles.bulletList}>
              <li style={styles.bulletItem}>{visibleBullets[0]}</li>
            </ul>
          </div>
        ),
      });

      visibleBullets.slice(1).forEach((bullet, j) => {
        const isLast = j === visibleBullets.length - 2;
        blocks.push({
          key: `project-${project.id ?? i}-bullet-${j + 1}`,
          type: "item-bullet",
          element: (
            <div style={isLast ? { marginBottom: styles.blockGap } : undefined}>
              <ul style={{ ...styles.bulletList, marginTop: 0 }}>
                <li style={styles.bulletItem}>{bullet}</li>
              </ul>
            </div>
          ),
        });
      });
    }
  });

  return blocks;
}

function buildVolunteeringBlocks(cv, styles, isFirst, keepTogether) {
  const visible = (cv.volunteering || []).filter(
    (item) => hasValue(item.organization) || hasValue(item.role)
  );
  if (visible.length === 0) return [];

  const titleStyle = isFirst ? styles.sectionTitleFirst : styles.sectionTitle;
  const blocks = [
    {
      key: "volunteering-header",
      type: "section-header",
      element: <h2 style={titleStyle}>Volunteering & Leadership</h2>,
    },
  ];

  visible.forEach((item, i) => {
    const visibleBullets = (item.bullets || []).filter((b) => hasValue(b));

    if (keepTogether || visibleBullets.length <= 1) {
      blocks.push({
        key: `vol-${item.id ?? i}`,
        type: "item",
        element: (
          <div style={{ marginBottom: styles.blockGap }}>
            <div style={styles.itemHeader}>
              <span>{item.organization}</span>
              <span style={styles.itemDate}>
                {formatDateRange(item.startDate, item.endDate)}
              </span>
            </div>

            {(hasValue(item.role) || hasValue(item.location)) && (
              <p style={styles.itemSubtitle}>
                {item.role}
                {hasValue(item.role) && hasValue(item.location) ? " | " : ""}
                {item.location}
              </p>
            )}

            {visibleBullets.length > 0 && (
              <ul style={styles.bulletList}>
                {visibleBullets.map((bullet, j) => (
                  <li key={j} style={styles.bulletItem}>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ),
      });
    } else {
      blocks.push({
        key: `vol-${item.id ?? i}-start`,
        type: "item-start",
        element: (
          <div>
            <div style={styles.itemHeader}>
              <span>{item.organization}</span>
              <span style={styles.itemDate}>
                {formatDateRange(item.startDate, item.endDate)}
              </span>
            </div>

            {(hasValue(item.role) || hasValue(item.location)) && (
              <p style={styles.itemSubtitle}>
                {item.role}
                {hasValue(item.role) && hasValue(item.location) ? " | " : ""}
                {item.location}
              </p>
            )}

            <ul style={styles.bulletList}>
              <li style={styles.bulletItem}>{visibleBullets[0]}</li>
            </ul>
          </div>
        ),
      });

      visibleBullets.slice(1).forEach((bullet, j) => {
        const isLast = j === visibleBullets.length - 2;
        blocks.push({
          key: `vol-${item.id ?? i}-bullet-${j + 1}`,
          type: "item-bullet",
          element: (
            <div style={isLast ? { marginBottom: styles.blockGap } : undefined}>
              <ul style={{ ...styles.bulletList, marginTop: 0 }}>
                <li style={styles.bulletItem}>{bullet}</li>
              </ul>
            </div>
          ),
        });
      });
    }
  });

  return blocks;
}

function buildCertificationsBlocks(cv, styles, isFirst, templateId) {
  const visible = (cv.certifications || []).filter(
    (item) => hasValue(item.name) || hasValue(item.institution)
  );
  if (visible.length === 0) return [];

  const titleStyle = isFirst ? styles.sectionTitleFirst : styles.sectionTitle;
  const blocks = [
    {
      key: "certifications-header",
      type: "section-header",
      element: <h2 style={titleStyle}>Certifications</h2>,
    },
  ];

  visible.forEach((item, i) => {
    blocks.push({
      key: `cert-${item.id ?? i}`,
      type: "item",
      element: (
        <div style={{ marginBottom: styles.blockGap }}>
          <div style={styles.itemHeader}>
            <span>{item.name}</span>
            <span style={styles.itemDate}>
              {formatDateRange(item.dateAcquired, item.expirationDate)}
            </span>
          </div>

          {(hasValue(item.institution) || (templateId === "advanced" && hasValue(item.url))) && (
            <p style={styles.itemSubtitle}>
              {item.institution}
              {hasValue(item.institution) && templateId === "advanced" && hasValue(item.url) && " – "}
              {templateId === "advanced" && hasValue(item.url) && (<a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "9pt", color: "#2563eb", textDecoration: "none", fontStyle: "normal" }}>View Credentials</a>)}
            </p>
          )}

          {templateId === "advanced" && hasValue(item.description) && (
            <p
              style={{
                fontFamily: styles.page.fontFamily,
                fontSize: "9.5pt",
                color: "#555",
                marginTop: "2px",
              }}
            >
              {item.description}
            </p>
          )}
        </div>
      ),
    });
  });

  return blocks;
}

function buildLanguagesBlocks(cv, styles, isFirst) {
  const visible = (cv.languages || []).filter(
    (item) => hasValue(item.language) || hasValue(item.fluencyLevel)
  );
  if (visible.length === 0) return [];

  const titleStyle = isFirst ? styles.sectionTitleFirst : styles.sectionTitle;
  const blocks = [
    {
      key: "languages-header",
      type: "section-header",
      element: <h2 style={titleStyle}>Languages</h2>,
    },
  ];

  visible.forEach((item, i) => {
    blocks.push({
      key: `lang-${item.id ?? i}`,
      type: "item",
      element: (
        <div
          style={{
            paddingLeft: "18px",
            fontFamily: styles.page.fontFamily,
            fontSize: styles.page.fontSize,
            position: "relative",
            marginBottom: "4px",
          }}
        >
          <span style={{ position: "absolute", left: "4px" }}>•</span>
          {hasValue(item.language) && <strong>{item.language}</strong>}
          {hasValue(item.language) && hasValue(item.fluencyLevel) ? ": " : ""}
          {item.fluencyLevel}
        </div>
      ),
    });
  });

  return blocks;
}

function buildReferencesBlocks(cv, styles, isFirst, hideReferences) {
  const visibleRefs = getVisibleReferences(cv.references || []);
  if (!hideReferences && visibleRefs.length === 0) return [];

  const titleStyle = isFirst ? styles.sectionTitleFirst : styles.sectionTitle;
  const blocks = [
    {
      key: "ref-header",
      type: "section-header",
      element: <h2 style={titleStyle}>References</h2>,
    },
  ];

  if (hideReferences) {
    blocks.push({
      key: "ref-upon-request",
      type: "content",
      element: (
        <p
          style={{
            fontFamily: styles.page.fontFamily,
            fontSize: styles.page.fontSize,
            fontStyle: "italic",
          }}
        >
          Available upon request
        </p>
      ),
    });
  } else {
    visibleRefs.forEach((ref, i) => {
      blocks.push({
        key: `ref-${ref.id ?? i}`,
        type: "item",
        element: (
          <div style={{ marginBottom: "8px" }}>
            <div style={styles.referenceTitle}>
              {ref.name}
              {hasValue(ref.company) ? ` — ${ref.company}` : ""}
            </div>
            <div style={styles.referenceContact}>
              {ref.phone}
              {hasValue(ref.phone) && hasValue(ref.email) ? " | " : ""}
              {ref.email}
            </div>
          </div>
        ),
      });
    });
  }

  return blocks;
}

/* ─── Section builder registry ───────────────────── */

const sectionBuilders = {
  summary: (cv, styles, isFirst) => buildSummaryBlocks(cv, styles, isFirst),
  experience: (cv, styles, isFirst, hideReferences, templateId, keepTogether) => buildExperienceBlocks(cv, styles, isFirst, templateId, keepTogether),
  education: (cv, styles, isFirst) => buildEducationBlocks(cv, styles, isFirst),
  skills: (cv, styles, isFirst) => buildSkillsBlocks(cv, styles, isFirst),
  projects: (cv, styles, isFirst, hideReferences, templateId, keepTogether) => buildProjectsBlocks(cv, styles, isFirst, templateId, keepTogether),
  volunteering: (cv, styles, isFirst, hideReferences, templateId, keepTogether) => buildVolunteeringBlocks(cv, styles, isFirst, keepTogether),
  certifications: (cv, styles, isFirst, hideReferences, templateId) => buildCertificationsBlocks(cv, styles, isFirst, templateId),
  languages: (cv, styles, isFirst) => buildLanguagesBlocks(cv, styles, isFirst),
  references: (cv, styles, isFirst, hideReferences) =>
    buildReferencesBlocks(cv, styles, isFirst, hideReferences),
};

/* ─── Block builder (order-aware) ────────────────── */

function buildBlocks(cv, hideReferences, styles, sectionOrder, templateId = "classic", keepTogether = false) {
  const blocks = [];

  if (hasValue(cv.name) || hasValue(cv.title) || hasContactInfo(cv)) {
    blocks.push({
      key: "personal",
      type: "personal",
      element: (
        <>
          {hasValue(cv.name) && <h1 style={styles.name}>{cv.name}</h1>}
          {hasValue(cv.title) && <p style={styles.title}>{cv.title}</p>}
          {hasContactInfo(cv) && (
            <>
              {templateId === "advanced" ? (
                <div style={{ ...styles.contact, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", alignItems: "center" }}>
                  {hasValue(cv.email) && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <MailIcon size={13} /> {cv.email}
                    </span>
                  )}
                  {hasValue(cv.phone) && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <PhoneIcon size={13} /> {cv.phone}
                    </span>
                  )}
                  {hasValue(cv.location) && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <MapPinIcon size={13} /> {cv.location}
                    </span>
                  )}
                  {hasValue(cv.linkedin) && (
                    <a href={cv.linkedin.startsWith("http") ? cv.linkedin : `https://${cv.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#555", textDecoration: "none" }}>
                      <LinkedInIcon size={13} /> LinkedIn
                    </a>
                  )}
                  {hasValue(cv.website) && (
                    <a href={cv.website.startsWith("http") ? cv.website : `https://${cv.website}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#555", textDecoration: "none" }}>
                      <LinkIcon size={13} /> Portfolio
                    </a>
                  )}
                </div>
              ) : (
                <p style={styles.contact}>{formatContact(cv)}</p>
              )}
              <hr style={styles.divider} />
            </>
          )}
        </>
      ),
    });
  }

  let isFirstSection = true;

  for (const sectionId of sectionOrder) {
    const builder = sectionBuilders[sectionId];
    if (!builder) continue;

    const sectionBlocks = builder(cv, styles, isFirstSection, hideReferences, templateId, keepTogether);
    if (sectionBlocks.length > 0) {
      blocks.push(...sectionBlocks);
      isFirstSection = false;
    }
  }

  return blocks;
}

/* ─── Pagination algorithm ───────────────────────── */

function paginateBlocks(heights, types, maxPageHeight) {
  const pages = [];
  let currentPage = [];
  let currentHeight = 0;

  for (let i = 0; i < heights.length; i++) {
    const h = heights[i];

    if (currentHeight + h <= maxPageHeight) {
      currentPage.push(i);
      currentHeight += h;
      continue;
    }

    if (currentPage.length > 0) {
      const lastIdx = currentPage[currentPage.length - 1];
      const lastType = types[lastIdx];

      // Only protect section-header from being alone at page bottom
      // item-start already has content (header + first bullet) so it's fine to stay
      if (lastType === "section-header") {
        currentPage.pop();

        if (currentPage.length > 0) pages.push([...currentPage]);

        currentPage = [lastIdx, i];
        currentHeight = heights[lastIdx] + h;
      } else {
        pages.push([...currentPage]);
        currentPage = [i];
        currentHeight = h;
      }
    } else {
      currentPage = [i];
      currentHeight = h;
    }
  }

  if (currentPage.length > 0) pages.push(currentPage);
  return pages;
}

/* ─── Main component ─────────────────────────────── */

export default function CVPreview({ cv, hideReferences, styleSettings, templateId = "classic" }) {
  const measureRef = useRef(null);
  const rulerRef = useRef(null);
  const [pageGroups, setPageGroups] = useState(null);

  const settings = styleSettings || defaultStyleSettings;
  const resolvedStyles = useMemo(() => buildResolvedStyles(settings), [settings]);

  const pageBaseStyle = useMemo(
    () => ({
      width: "210mm",
      padding: resolvedStyles.page.padding,
      fontFamily: resolvedStyles.page.fontFamily,
      fontSize: resolvedStyles.page.fontSize,
      lineHeight: resolvedStyles.page.lineHeight,
      color: "#333",
      boxSizing: "border-box",
    }),
    [resolvedStyles]
  );

  const rulerHeight = `${297 - 2 * settings.marginTopBottom}mm`;

  const blocks = useMemo(
    () => buildBlocks(cv, hideReferences, resolvedStyles, settings.sectionOrder, templateId, settings.keepItemsTogether),
    [cv, hideReferences, resolvedStyles, settings.sectionOrder, templateId, settings.keepItemsTogether]
  );

  useLayoutEffect(() => {
    if (!measureRef.current || !rulerRef.current) return;

    const pageContentHeight = rulerRef.current.offsetHeight;
    const blockEls = Array.from(measureRef.current.querySelectorAll("[data-cv-block]"));
    const sentinel = measureRef.current.querySelector("[data-cv-sentinel]");

    if (blockEls.length === 0 || !sentinel) {
      setPageGroups([]);
      return;
    }

    const heights = [];
    const types = [];

    for (let i = 0; i < blockEls.length; i++) {
      const nextTop = i < blockEls.length - 1 ? blockEls[i + 1].offsetTop : sentinel.offsetTop;
      heights.push(nextTop - blockEls[i].offsetTop);
      types.push(blockEls[i].dataset.blockType || "content");
    }

    setPageGroups(
      paginateBlocks(heights, types, pageContentHeight - PAGE_HEIGHT_BUFFER)
    );
  }, [blocks, pageBaseStyle, rulerHeight]);

  return (
    <>
      <div
        ref={rulerRef}
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1mm",
          height: rulerHeight,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      />

      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          ...pageBaseStyle,
          position: "absolute",
          left: "-9999px",
          height: "auto",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        {blocks.map((b) => (
          <div key={b.key} data-cv-block data-block-type={b.type}>
            {b.element}
          </div>
        ))}
        <div data-cv-sentinel style={{ height: "1px" }} />
      </div>

      {pageGroups !== null && pageGroups.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${PAGE_GAP_PX}px`,
          }}
        >
          {pageGroups.map((group, pageIndex) => (
            <div
              key={pageIndex}
              className="bg-white"
              style={{
                ...pageBaseStyle,
                height: "297mm",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
              }}
            >
              {group.map((idx) => {
                const block = blocks[idx];
                if (!block) return null;

                return <div key={block.key}>{block.element}</div>;
              })}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="bg-white"
          style={{
            ...pageBaseStyle,
            minHeight: "297mm",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
          }}
        />
      )}
    </>
  );
}
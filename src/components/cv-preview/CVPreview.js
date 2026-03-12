"use client";

import { useRef, useState, useLayoutEffect, useMemo } from "react";
import { cvStyles } from "@/lib/constants";
import { fontOptions, defaultStyleSettings } from "@/data/styleDefaults";

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

  return {
    page: {
      ...cvStyles.page,
      fontFamily: bodyFont,
      fontSize: bodySize,
      lineHeight,
    },
    name: {
      ...cvStyles.name,
      fontFamily: headingFont,
    },
    title: {
      ...cvStyles.title,
      fontFamily: bodyFont,
    },
    contact: {
      ...cvStyles.contact,
      fontFamily: bodyFont,
    },
    divider: cvStyles.divider,
    sectionTitle: {
      ...cvStyles.sectionTitle,
      fontFamily: headingFont,
      fontSize: headingSize,
    },
    sectionTitleFirst: {
      ...cvStyles.sectionTitleFirst,
      fontFamily: headingFont,
      fontSize: headingSize,
    },
    summary: {
      ...cvStyles.summary,
      fontFamily: bodyFont,
      fontSize: bodySize,
    },
    itemHeader: {
      ...cvStyles.itemHeader,
      fontFamily: headingFont,
    },
    itemDate: {
      ...cvStyles.itemDate,
      fontFamily: bodyFont,
    },
    itemSubtitle: {
      ...cvStyles.itemSubtitle,
      fontFamily: bodyFont,
    },
    bulletList: {
      ...cvStyles.bulletList,
      fontFamily: bodyFont,
      fontSize: bodySize,
    },
    bulletItem: cvStyles.bulletItem,
    referenceTitle: {
      ...cvStyles.referenceTitle,
      fontFamily: headingFont,
    },
    referenceContact: {
      ...cvStyles.referenceContact,
      fontFamily: bodyFont,
    },
  };
}

/* ─── Constants ──────────────────────────────────── */

const PAGE_GAP_PX = 30;
const PAGE_HEIGHT_BUFFER = 10;

/* ─── Block builder (template-specific) ──────────── */

function buildBlocks(cv, hideReferences, styles) {
  const blocks = [];

  // --- Personal info ---
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
              <p style={styles.contact}>{formatContact(cv)}</p>
              <hr style={styles.divider} />
            </>
          )}
        </>
      ),
    });
  }

  // --- Professional Summary ---
  if (hasValue(cv.summary)) {
    blocks.push({
      key: "summary-header",
      type: "section-header",
      element: <h2 style={styles.sectionTitleFirst}>Professional Summary</h2>,
    });
    blocks.push({
      key: "summary-content",
      type: "content",
      element: <p style={styles.summary}>{cv.summary}</p>,
    });
  }

  // --- Experience ---
  const visibleExps = cv.experiences.filter(
    (e) => hasValue(e.company) || hasValue(e.position)
  );
  if (visibleExps.length > 0) {
    blocks.push({
      key: "exp-header",
      type: "section-header",
      element: <h2 style={styles.sectionTitle}>Experience</h2>,
    });
    visibleExps.forEach((exp, i) => {
      blocks.push({
        key: `exp-${exp.id ?? i}`,
        type: "item",
        element: (
          <div style={{ marginBottom: "12px" }}>
            <div style={styles.itemHeader}>
              <span>{exp.company}</span>
              <span style={styles.itemDate}>
                {exp.startDate}
                {hasValue(exp.startDate) && hasValue(exp.endDate) ? " – " : ""}
                {exp.endDate}
              </span>
            </div>
            {(hasValue(exp.position) || hasValue(exp.location)) && (
              <p style={styles.itemSubtitle}>
                {exp.position}
                {hasValue(exp.position) && hasValue(exp.location) ? " | " : ""}
                {exp.location}
              </p>
            )}
            {exp.bullets.some((b) => hasValue(b)) && (
              <ul style={styles.bulletList}>
                {exp.bullets
                  .filter((b) => hasValue(b))
                  .map((bullet, j) => (
                    <li key={j} style={styles.bulletItem}>
                      {bullet}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ),
      });
    });
  }

  // --- Education ---
  const visibleEdus = cv.education.filter(
    (e) => hasValue(e.school) || hasValue(e.degree)
  );
  if (visibleEdus.length > 0) {
    blocks.push({
      key: "edu-header",
      type: "section-header",
      element: <h2 style={styles.sectionTitle}>Education</h2>,
    });
    visibleEdus.forEach((edu, i) => {
      blocks.push({
        key: `edu-${edu.id ?? i}`,
        type: "item",
        element: (
          <div style={{ marginBottom: "10px" }}>
            <div style={styles.itemHeader}>
              <span>{edu.degree}</span>
              <span style={styles.itemDate}>
                {edu.startDate}
                {hasValue(edu.startDate) && hasValue(edu.endDate) ? " – " : ""}
                {edu.endDate}
              </span>
            </div>
            {(hasValue(edu.school) || hasValue(edu.location)) && (
              <p style={{ fontFamily: styles.page.fontFamily, fontSize: styles.page.fontSize, fontStyle: "italic", marginBottom: "2px" }}>
                {edu.school}
                {hasValue(edu.school) && hasValue(edu.location) ? " | " : ""}
                {edu.location}
              </p>
            )}
            {hasValue(edu.additionalInfo) && (
              <p style={{ fontFamily: styles.page.fontFamily, fontSize: "9.5pt", color: "#555" }}>
                {edu.additionalInfo}
              </p>
            )}
          </div>
        ),
      });
    });
  }

  // --- Skills ---
  const visibleSkills = cv.skills.filter(
    (s) => hasValue(s.category) || hasValue(s.items)
  );
  if (visibleSkills.length > 0) {
    blocks.push({
      key: "skills-header",
      type: "section-header",
      element: <h2 style={styles.sectionTitle}>Technical Skills</h2>,
    });
    visibleSkills.forEach((skill, i) => {
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
  }

  // --- Projects ---
  const visibleProjects = cv.projects.filter((p) => hasValue(p.name));
  if (visibleProjects.length > 0) {
    blocks.push({
      key: "projects-header",
      type: "section-header",
      element: <h2 style={styles.sectionTitle}>Technical Projects and Research</h2>,
    });
    visibleProjects.forEach((project, i) => {
      blocks.push({
        key: `project-${project.id ?? i}`,
        type: "item",
        element: (
          <div style={{ marginBottom: "10px" }}>
            <div style={styles.itemHeader}>
              <span>{project.name}</span>
              <span style={styles.itemDate}>
                {project.startDate}
                {hasValue(project.startDate) && hasValue(project.endDate) ? " – " : ""}
                {project.endDate}
              </span>
            </div>
            {hasValue(project.url) && (
              <p style={{ fontFamily: styles.page.fontFamily, fontSize: "9.5pt", color: "#555", marginBottom: "4px" }}>
                {project.url}
              </p>
            )}
            {project.bullets.some((b) => hasValue(b)) && (
              <ul style={styles.bulletList}>
                {project.bullets
                  .filter((b) => hasValue(b))
                  .map((bullet, j) => (
                    <li key={j} style={styles.bulletItem}>
                      {bullet}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ),
      });
    });
  }

  // --- References ---
  const visibleRefs = getVisibleReferences(cv.references);
  if (hideReferences || visibleRefs.length > 0) {
    blocks.push({
      key: "ref-header",
      type: "section-header",
      element: <h2 style={styles.sectionTitle}>References</h2>,
    });
    if (hideReferences) {
      blocks.push({
        key: "ref-upon-request",
        type: "content",
        element: (
          <p style={{ fontFamily: styles.page.fontFamily, fontSize: styles.page.fontSize, fontStyle: "italic" }}>
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
      if (types[lastIdx] === "section-header") {
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

export default function CVPreview({ cv, hideReferences, styleSettings }) {
  const measureRef = useRef(null);
  const rulerRef = useRef(null);
  const [pageGroups, setPageGroups] = useState(null);

  const settings = styleSettings || defaultStyleSettings;
  const resolvedStyles = useMemo(() => buildResolvedStyles(settings), [settings]);

  const pageBaseStyle = useMemo(() => ({
    width: "210mm",
    padding: "12.7mm",
    fontFamily: resolvedStyles.page.fontFamily,
    fontSize: resolvedStyles.page.fontSize,
    lineHeight: resolvedStyles.page.lineHeight,
    color: "#333",
    boxSizing: "border-box",
  }), [resolvedStyles]);

  const blocks = useMemo(
    () => buildBlocks(cv, hideReferences, resolvedStyles),
    [cv, hideReferences, resolvedStyles]
  );

  useLayoutEffect(() => {
    if (!measureRef.current || !rulerRef.current) return;

    const pageContentHeight = rulerRef.current.offsetHeight;
    const blockEls = Array.from(
      measureRef.current.querySelectorAll("[data-cv-block]")
    );
    const sentinel = measureRef.current.querySelector("[data-cv-sentinel]");

    if (blockEls.length === 0 || !sentinel) {
      setPageGroups([]);
      return;
    }

    const heights = [];
    const types = [];
    for (let i = 0; i < blockEls.length; i++) {
      const nextTop =
        i < blockEls.length - 1
          ? blockEls[i + 1].offsetTop
          : sentinel.offsetTop;
      heights.push(nextTop - blockEls[i].offsetTop);
      types.push(blockEls[i].dataset.blockType || "content");
    }

    setPageGroups(
      paginateBlocks(heights, types, pageContentHeight - PAGE_HEIGHT_BUFFER)
    );
  }, [blocks, pageBaseStyle]);

  return (
    <>
      {/* Ruler: exact A4 content-area height in CSS pixels */}
      <div
        ref={rulerRef}
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1mm",
          height: `${297 - 2 * 12.7}mm`,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      />

      {/* Measurement container (always rendered offscreen) */}
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

      {/* Paginated display */}
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
              {group.map((idx) => (
                <div key={blocks[idx].key}>{blocks[idx].element}</div>
              ))}
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
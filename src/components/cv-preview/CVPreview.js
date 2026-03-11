"use client";

import { useRef, useState, useLayoutEffect, useMemo } from "react";
import { cvStyles } from "@/lib/constants";

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

/* ─── Constants ──────────────────────────────────── */

// Gap between pages (~8mm, matching Word's print layout)
const PAGE_GAP_PX = 30;

// Safety buffer for margin collapsing differences at page boundaries
const PAGE_HEIGHT_BUFFER = 10;

// Shared base style for both measurement and display
const pageBaseStyle = {
  width: "210mm",
  padding: "12.7mm",
  fontFamily: "Inter, sans-serif",
  fontSize: "11pt",
  lineHeight: "1.5",
  color: "#333",
  boxSizing: "border-box",
};

/* ─── Block builder (template-specific) ──────────── */

function buildBlocks(cv, hideReferences) {
  const blocks = [];

  // --- Personal info ---
  if (hasValue(cv.name) || hasValue(cv.title) || hasContactInfo(cv)) {
    blocks.push({
      key: "personal",
      type: "personal",
      element: (
        <>
          {hasValue(cv.name) && <h1 style={cvStyles.name}>{cv.name}</h1>}
          {hasValue(cv.title) && <p style={cvStyles.title}>{cv.title}</p>}
          {hasContactInfo(cv) && (
            <>
              <p style={cvStyles.contact}>{formatContact(cv)}</p>
              <hr style={cvStyles.divider} />
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
      element: <h2 style={cvStyles.sectionTitleFirst}>Professional Summary</h2>,
    });
    blocks.push({
      key: "summary-content",
      type: "content",
      element: <p style={cvStyles.summary}>{cv.summary}</p>,
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
      element: <h2 style={cvStyles.sectionTitle}>Experience</h2>,
    });
    visibleExps.forEach((exp, i) => {
      blocks.push({
        key: `exp-${exp.id ?? i}`,
        type: "item",
        element: (
          <div style={{ marginBottom: "12px" }}>
            <div style={cvStyles.itemHeader}>
              <span>{exp.company}</span>
              <span style={cvStyles.itemDate}>
                {exp.startDate}
                {hasValue(exp.startDate) && hasValue(exp.endDate) ? " – " : ""}
                {exp.endDate}
              </span>
            </div>
            {(hasValue(exp.position) || hasValue(exp.location)) && (
              <p style={cvStyles.itemSubtitle}>
                {exp.position}
                {hasValue(exp.position) && hasValue(exp.location) ? " | " : ""}
                {exp.location}
              </p>
            )}
            {exp.bullets.some((b) => hasValue(b)) && (
              <ul style={cvStyles.bulletList}>
                {exp.bullets
                  .filter((b) => hasValue(b))
                  .map((bullet, j) => (
                    <li key={j} style={cvStyles.bulletItem}>
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
      element: <h2 style={cvStyles.sectionTitle}>Education</h2>,
    });
    visibleEdus.forEach((edu, i) => {
      blocks.push({
        key: `edu-${edu.id ?? i}`,
        type: "item",
        element: (
          <div style={{ marginBottom: "10px" }}>
            <div style={cvStyles.itemHeader}>
              <span>{edu.degree}</span>
              <span style={cvStyles.itemDate}>
                {edu.startDate}
                {hasValue(edu.startDate) && hasValue(edu.endDate) ? " – " : ""}
                {edu.endDate}
              </span>
            </div>
            {(hasValue(edu.school) || hasValue(edu.location)) && (
              <p style={{ fontSize: "10pt", fontStyle: "italic", marginBottom: "2px" }}>
                {edu.school}
                {hasValue(edu.school) && hasValue(edu.location) ? " | " : ""}
                {edu.location}
              </p>
            )}
            {hasValue(edu.additionalInfo) && (
              <p style={{ fontSize: "9.5pt", color: "#555" }}>{edu.additionalInfo}</p>
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
      element: <h2 style={cvStyles.sectionTitle}>Technical Skills</h2>,
    });
    visibleSkills.forEach((skill, i) => {
      blocks.push({
        key: `skill-${skill.id ?? i}`,
        type: "item",
        element: (
          <div
            style={{
              paddingLeft: "18px",
              fontSize: "10pt",
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
      element: <h2 style={cvStyles.sectionTitle}>Technical Projects and Research</h2>,
    });
    visibleProjects.forEach((project, i) => {
      blocks.push({
        key: `project-${project.id ?? i}`,
        type: "item",
        element: (
          <div style={{ marginBottom: "10px" }}>
            <div style={cvStyles.itemHeader}>
              <span>{project.name}</span>
              <span style={cvStyles.itemDate}>
                {project.startDate}
                {hasValue(project.startDate) && hasValue(project.endDate) ? " – " : ""}
                {project.endDate}
              </span>
            </div>
            {hasValue(project.url) && (
              <p style={{ fontSize: "9.5pt", color: "#555", marginBottom: "4px" }}>
                {project.url}
              </p>
            )}
            {project.bullets.some((b) => hasValue(b)) && (
              <ul style={cvStyles.bulletList}>
                {project.bullets
                  .filter((b) => hasValue(b))
                  .map((bullet, j) => (
                    <li key={j} style={cvStyles.bulletItem}>
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
      element: <h2 style={cvStyles.sectionTitle}>References</h2>,
    });
    if (hideReferences) {
      blocks.push({
        key: "ref-upon-request",
        type: "content",
        element: (
          <p style={{ fontSize: "10pt", fontStyle: "italic" }}>Available upon request</p>
        ),
      });
    } else {
      visibleRefs.forEach((ref, i) => {
        blocks.push({
          key: `ref-${ref.id ?? i}`,
          type: "item",
          element: (
            <div style={{ marginBottom: "8px" }}>
              <div style={cvStyles.referenceTitle}>
                {ref.name}
                {hasValue(ref.company) ? ` — ${ref.company}` : ""}
              </div>
              <div style={cvStyles.referenceContact}>
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

    // Block fits on current page
    if (currentHeight + h <= maxPageHeight) {
      currentPage.push(i);
      currentHeight += h;
      continue;
    }

    // Block doesn't fit — start a new page
    if (currentPage.length > 0) {
      // Section-header protection: don't leave a header alone at page bottom
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
      // Edge case: single block taller than a full page — give it its own page
      currentPage = [i];
      currentHeight = h;
    }
  }

  if (currentPage.length > 0) pages.push(currentPage);
  return pages;
}

/* ─── Main component ─────────────────────────────── */

export default function CVPreview({ cv, hideReferences }) {
  const measureRef = useRef(null);
  const rulerRef = useRef(null);
  const [pageGroups, setPageGroups] = useState(null);

  const blocks = useMemo(
    () => buildBlocks(cv, hideReferences),
    [cv, hideReferences]
  );

  // Measure block heights and compute page distribution
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

    // Use offsetTop differences for accurate height including margins
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
  }, [blocks]);

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
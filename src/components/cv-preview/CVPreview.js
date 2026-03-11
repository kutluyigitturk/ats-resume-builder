"use client";

import { cvStyles } from "@/lib/constants";

// Helper: checks if any contact field has content
function hasContactInfo(cv) {
  return [cv.phone, cv.email, cv.location, cv.linkedin].some(
    (v) => v && v.trim() !== ""
  );
}

// Helper: joins non-empty contact fields
function formatContact(cv) {
  return [cv.phone, cv.email, cv.location, cv.linkedin]
    .filter((v) => v && v.trim() !== "")
    .join(" | ");
}

export default function CVPreview({ cv, hideReferences }) {
  return (
    <div className="bg-white shadow-lg" style={cvStyles.page}>
      {/* Header - Name */}
      {cv.name.trim() !== "" && (
        <h1 style={cvStyles.name}>{cv.name}</h1>
      )}

      {/* Header - Title */}
      {cv.title.trim() !== "" && (
        <p style={cvStyles.title}>{cv.title}</p>
      )}

      {/* Header - Contact Info */}
      {hasContactInfo(cv) && (
        <>
          <p style={cvStyles.contact}>{formatContact(cv)}</p>
          <hr style={cvStyles.divider} />
        </>
      )}

      {/* Professional Summary */}
      {cv.summary && cv.summary.trim() !== "" && (
        <>
          <h2 style={cvStyles.sectionTitleFirst}>Professional Summary</h2>
          <p style={cvStyles.summary}>{cv.summary}</p>
        </>
      )}

      {/* Experience */}
      {cv.experiences.length > 0 &&
        cv.experiences.some((exp) => exp.company || exp.position) && (
          <>
            <h2 style={cvStyles.sectionTitle}>Experience</h2>
            {cv.experiences
              .filter((exp) => exp.company || exp.position)
              .map((exp, index) => (
                <div key={index} style={{ marginBottom: "12px" }}>
                  <div style={cvStyles.itemHeader}>
                    <span>{exp.company}</span>
                    <span style={cvStyles.itemDate}>
                      {exp.startDate}
                      {exp.startDate && exp.endDate ? " – " : ""}
                      {exp.endDate}
                    </span>
                  </div>
                  {exp.position && (
                    <p style={cvStyles.itemSubtitle}>{exp.position}</p>
                  )}
                  <ul style={cvStyles.bulletList}>
                    {exp.bullets
                      .filter((b) => b.trim() !== "")
                      .map((bullet, i) => (
                        <li key={i} style={cvStyles.bulletItem}>
                          {bullet}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </>
        )}

      {/* Education */}
      {cv.education.length > 0 &&
        cv.education.some((edu) => edu.school || edu.degree) && (
          <>
            <h2 style={cvStyles.sectionTitle}>Education</h2>
            {cv.education
              .filter((edu) => edu.school || edu.degree)
              .map((edu, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  <div style={cvStyles.itemHeader}>
                    <span>{edu.degree}</span>
                    <span style={cvStyles.itemDate}>{edu.date}</span>
                  </div>
                  <p style={{ fontSize: "10pt", fontStyle: "italic" }}>
                    {edu.school}
                  </p>
                </div>
              ))}
          </>
        )}

      {/* Technical Skills */}
      {cv.skills.length > 0 &&
        cv.skills.some((s) => s.category || s.items) && (
          <>
            <h2 style={cvStyles.sectionTitle}>Technical Skills</h2>
            <ul style={cvStyles.bulletList}>
              {cv.skills
                .filter((s) => s.category || s.items)
                .map((skill, index) => (
                  <li key={index} style={{ marginBottom: "4px" }}>
                    {skill.category && <strong>{skill.category}: </strong>}
                    {skill.items}
                  </li>
                ))}
            </ul>
          </>
        )}

      {/* Projects and Research */}
      {cv.projects.length > 0 &&
        cv.projects.some((p) => p.name) && (
          <>
            <h2 style={cvStyles.sectionTitle}>
              Technical Projects and Research
            </h2>
            {cv.projects
              .filter((p) => p.name)
              .map((project, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  <div style={cvStyles.itemHeader}>
                    <span>{project.name}</span>
                    <span style={cvStyles.itemDate}>
                      {project.startDate}
                      {project.startDate && project.endDate ? " – " : ""}
                      {project.endDate}
                    </span>
                  </div>
                  <ul style={cvStyles.bulletList}>
                    {project.bullets
                      .filter((b) => b.trim() !== "")
                      .map((bullet, i) => (
                        <li key={i} style={cvStyles.bulletItem}>
                          {bullet}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </>
        )}

      {/* References */}
      {(cv.references.length > 0 || hideReferences) && (
        <>
          <h2 style={cvStyles.sectionTitle}>References</h2>
          {hideReferences ? (
            <p style={{ fontSize: "10pt", fontStyle: "italic" }}>
              Available upon request
            </p>
          ) : (
            cv.references
              .filter((r) => r.name)
              .map((ref, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  <div style={cvStyles.referenceTitle}>
                    {ref.name}
                    {ref.company ? ` — ${ref.company}` : ""}
                  </div>
                  <div style={cvStyles.referenceContact}>
                    {ref.phone}
                    {ref.phone && ref.email ? " | " : ""}
                    {ref.email}
                  </div>
                </div>
              ))
          )}
        </>
      )}
    </div>
  );
}
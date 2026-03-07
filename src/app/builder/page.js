"use client";

import { useState, useRef } from "react";

// CV data - placeholder texts for user guidance
const initialCV = {
  name: "Ad Soyad",
  title: "Ünvan | Pozisyon",
  phone: "+90 5XX XXX XX XX",
  email: "email@example.com",
  location: "Şehir, Ülke",
  linkedin: "linkedin.com/in/profiliniz",

  summary:
    "Kendinizi kısaca tanıtın. Kaç yıllık deneyiminiz olduğunu, uzmanlık alanlarınızı ve kariyer hedefinizi buraya yazın.",

  experiences: [
    {
      company: "Şirket Adı",
      date: "AA/YYYY – AA/YYYY",
      position: "Pozisyon / Ünvan",
      bullets: [
        "Bu pozisyondaki en önemli başarınızı veya sorumluluğunuzu yazın.",
        "Somut rakamlarla desteklenmiş bir başarınızı ekleyin.",
      ],
    },
  ],

  education: [
    {
      school: "Üniversite Adı",
      degree: "Lisans / Yüksek Lisans, Bölüm Adı",
      date: "AA/YYYY – AA/YYYY",
    },
  ],

  skills: [
    "Kategori: Beceri 1, Beceri 2, Beceri 3, Beceri 4",
    "Kategori: Beceri 1, Beceri 2, Beceri 3",
  ],

  projects: [
    {
      name: "Proje Adı",
      description:
        "Projede ne yaptığınızı, hangi teknolojileri kullandığınızı ve sonuçlarını kısaca açıklayın.",
    },
  ],
};

// Reusable accordion section component
function Section({ title, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-3 px-4 hover:bg-gray-50 text-left"
      >
        <span className="font-semibold text-gray-700">{title}</span>
        <span className="text-gray-400 text-lg">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default function Builder() {
  // CV data state
  const [cv, setCv] = useState(initialCV);

  // Reference to CV preview element
  const cvRef = useRef(null);

  // PDF download state
  const [downloading, setDownloading] = useState(false);

  // Generate and download PDF
  const handleDownloadPDF = async () => {
    setDownloading(true);

    try {
      // Build full HTML document with inline styles
      const cvHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.5;
              color: #333;
            }
            .cv-page {
              width: 210mm;
              min-height: 297mm;
              padding: 20mm 25mm;
            }
            .cv-name {
              font-size: 22pt;
              font-weight: bold;
              text-align: center;
              margin-bottom: 2px;
              color: #000;
            }
            .cv-title {
              text-align: center;
              font-size: 11pt;
              color: #444;
              margin-bottom: 8px;
            }
            .cv-contact {
              text-align: center;
              font-size: 9pt;
              color: #555;
              margin-bottom: 16px;
            }
            .cv-divider {
              border: none;
              border-top: 1.5px solid #000;
              margin-bottom: 12px;
            }
            .cv-section-title {
              font-size: 12pt;
              font-weight: bold;
              text-transform: uppercase;
              border-bottom: 1px solid #999;
              padding-bottom: 2px;
              margin-bottom: 6px;
              margin-top: 14px;
            }
            .cv-section-title:first-of-type {
              margin-top: 0;
            }
            .cv-summary {
              font-size: 10pt;
              margin-bottom: 14px;
            }
            .exp-header {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              font-size: 10.5pt;
            }
            .exp-date {
              font-weight: normal;
              color: #555;
            }
            .exp-position {
              font-style: italic;
              font-size: 10pt;
              margin-bottom: 4px;
            }
            .exp-bullets {
              padding-left: 18px;
              font-size: 10pt;
            }
            .exp-bullets li {
              margin-bottom: 2px;
            }
            .edu-header {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              font-size: 10.5pt;
            }
            .edu-date {
              font-weight: normal;
              color: #555;
            }
            .edu-school {
              font-size: 10pt;
              font-style: italic;
            }
            .skills-list {
              padding-left: 18px;
              font-size: 10pt;
            }
            .skills-list li {
              margin-bottom: 2px;
            }
            .project-name {
              font-weight: bold;
              font-size: 10.5pt;
            }
            .project-desc {
              font-size: 10pt;
              padding-left: 18px;
            }
            .mb-12 { margin-bottom: 12px; }
            .mb-8 { margin-bottom: 8px; }
          </style>
        </head>
        <body>
          <div class="cv-page">
            <div class="cv-name">${cv.name}</div>
            <div class="cv-title">${cv.title}</div>
            <div class="cv-contact">${cv.phone} | ${cv.email} | ${cv.location} | ${cv.linkedin}</div>
            <hr class="cv-divider" />

            <div class="cv-section-title">Professional Summary</div>
            <div class="cv-summary">${cv.summary}</div>

            <div class="cv-section-title">Experience</div>
            ${cv.experiences
              .map(
                (exp) => `
              <div class="mb-12">
                <div class="exp-header">
                  <span>${exp.company}</span>
                  <span class="exp-date">${exp.date}</span>
                </div>
                <div class="exp-position">${exp.position}</div>
                <ul class="exp-bullets">
                  ${exp.bullets.map((b) => `<li>${b}</li>`).join("")}
                </ul>
              </div>
            `
              )
              .join("")}

            <div class="cv-section-title">Education</div>
            ${cv.education
              .map(
                (edu) => `
              <div class="mb-8">
                <div class="edu-header">
                  <span>${edu.degree}</span>
                  <span class="edu-date">${edu.date}</span>
                </div>
                <div class="edu-school">${edu.school}</div>
              </div>
            `
              )
              .join("")}

            <div class="cv-section-title">Technical Skills</div>
            <ul class="skills-list">
              ${cv.skills.map((s) => `<li>${s}</li>`).join("")}
            </ul>

            <div class="cv-section-title">Technical Projects and Research</div>
            ${cv.projects
              .map(
                (p) => `
              <div class="mb-8">
                <div class="project-name">${p.name}</div>
                <div class="project-desc">• ${p.description}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </body>
        </html>
      `;

      // Send HTML to API endpoint
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: cvHTML }),
      });

      if (!response.ok) throw new Error("PDF generation failed");

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cv.name.replace(/\s+/g, "_")}_CV.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error);
      alert("PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setDownloading(false);
    }
  };

  // Accordion open/close states
  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: false,
    experience: false,
    education: false,
    skills: false,
    projects: false,
  });

  // Toggle accordion section
  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Update simple fields (name, email, etc.)
  const updateField = (field, value) => {
    setCv((prev) => ({ ...prev, [field]: value }));
  };

  // Update experience fields
  const updateExperience = (index, field, value) => {
    const updated = [...cv.experiences];
    updated[index] = { ...updated[index], [field]: value };
    setCv((prev) => ({ ...prev, experiences: updated }));
  };

  // Update experience bullet points
  const updateBullet = (expIndex, bulletIndex, value) => {
    const updated = [...cv.experiences];
    updated[expIndex].bullets[bulletIndex] = value;
    setCv((prev) => ({ ...prev, experiences: updated }));
  };

  // Add new experience
  const addExperience = () => {
    setCv((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          company: "Şirket Adı",
          date: "AA/YYYY – AA/YYYY",
          position: "Pozisyon / Ünvan",
          bullets: ["Başarınızı veya sorumluluğunuzu yazın."],
        },
      ],
    }));
  };

  // Remove experience
  const removeExperience = (index) => {
    if (cv.experiences.length <= 1) return;
    setCv((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  // Add bullet to experience
  const addBullet = (expIndex) => {
    const updated = [...cv.experiences];
    updated[expIndex].bullets.push("Yeni madde ekleyin.");
    setCv((prev) => ({ ...prev, experiences: updated }));
  };

  // Remove bullet from experience
  const removeBullet = (expIndex, bulletIndex) => {
    const updated = [...cv.experiences];
    if (updated[expIndex].bullets.length <= 1) return;
    updated[expIndex].bullets = updated[expIndex].bullets.filter(
      (_, i) => i !== bulletIndex
    );
    setCv((prev) => ({ ...prev, experiences: updated }));
  };

  // Update education fields
  const updateEducation = (index, field, value) => {
    const updated = [...cv.education];
    updated[index] = { ...updated[index], [field]: value };
    setCv((prev) => ({ ...prev, education: updated }));
  };

  // Add new education
  const addEducation = () => {
    setCv((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: "Üniversite Adı",
          degree: "Bölüm Adı",
          date: "AA/YYYY – AA/YYYY",
        },
      ],
    }));
  };

  // Remove education
  const removeEducation = (index) => {
    if (cv.education.length <= 1) return;
    setCv((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Update skills
  const updateSkill = (index, value) => {
    const updated = [...cv.skills];
    updated[index] = value;
    setCv((prev) => ({ ...prev, skills: updated }));
  };

  // Add skill
  const addSkill = () => {
    setCv((prev) => ({
      ...prev,
      skills: [...prev.skills, "Kategori: Beceri 1, Beceri 2"],
    }));
  };

  // Remove skill
  const removeSkill = (index) => {
    if (cv.skills.length <= 1) return;
    setCv((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Update project fields
  const updateProject = (index, field, value) => {
    const updated = [...cv.projects];
    updated[index] = { ...updated[index], [field]: value };
    setCv((prev) => ({ ...prev, projects: updated }));
  };

  // Add project
  const addProject = () => {
    setCv((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "Proje Adı", description: "Proje açıklaması." },
      ],
    }));
  };

  // Remove project
  const removeProject = (index) => {
    if (cv.projects.length <= 1) return;
    setCv((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // Shared input style
  const inputStyle =
    "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500";
  const labelStyle = "block text-xs font-medium text-gray-500 mb-1";

  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* ==================== LEFT PANEL - FORM ==================== */}
      <div className="w-96 bg-white border-r border-gray-300 overflow-y-auto h-screen sticky top-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold text-gray-800">CV Builder</h1>
              <p className="text-xs text-gray-500 mt-1">
                Bilgilerinizi doldurun, sağ tarafta canlı önizleyin.
              </p>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400"
            >
              {downloading ? "Oluşturuluyor..." : "PDF İndir"}
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <Section
          title="Personal Information"
          isOpen={openSections.personal}
          onToggle={() => toggleSection("personal")}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelStyle}>Name</label>
              <input
                className={inputStyle}
                value={cv.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>Job Title</label>
              <input
                className={inputStyle}
                value={cv.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>Email</label>
              <input
                className={inputStyle}
                value={cv.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>Phone</label>
              <input
                className={inputStyle}
                value={cv.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>City</label>
              <input
                className={inputStyle}
                value={cv.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>LinkedIn</label>
              <input
                className={inputStyle}
                value={cv.linkedin}
                onChange={(e) => updateField("linkedin", e.target.value)}
              />
            </div>
          </div>
        </Section>

        {/* Professional Summary */}
        <Section
          title="Professional Summary"
          isOpen={openSections.summary}
          onToggle={() => toggleSection("summary")}
        >
          <textarea
            className={inputStyle + " h-28 resize-none"}
            value={cv.summary}
            onChange={(e) => updateField("summary", e.target.value)}
          />
        </Section>

        {/* Work Experience */}
        <Section
          title="Work Experience"
          isOpen={openSections.experience}
          onToggle={() => toggleSection("experience")}
        >
          {cv.experiences.map((exp, expIndex) => (
            <div
              key={expIndex}
              className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 relative"
            >
              {/* Remove experience button */}
              {cv.experiences.length > 1 && (
                <button
                  onClick={() => removeExperience(expIndex)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-sm"
                >
                  ✕
                </button>
              )}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className={labelStyle}>Company</label>
                  <input
                    className={inputStyle}
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(expIndex, "company", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={labelStyle}>Date</label>
                  <input
                    className={inputStyle}
                    value={exp.date}
                    onChange={(e) =>
                      updateExperience(expIndex, "date", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className={labelStyle}>Position</label>
                <input
                  className={inputStyle}
                  value={exp.position}
                  onChange={(e) =>
                    updateExperience(expIndex, "position", e.target.value)
                  }
                />
              </div>
              {/* Bullet points */}
              <label className={labelStyle}>Bullet Points</label>
              {exp.bullets.map((bullet, bIndex) => (
                <div key={bIndex} className="flex gap-1 mb-1">
                  <input
                    className={inputStyle + " flex-1"}
                    value={bullet}
                    onChange={(e) =>
                      updateBullet(expIndex, bIndex, e.target.value)
                    }
                  />
                  {exp.bullets.length > 1 && (
                    <button
                      onClick={() => removeBullet(expIndex, bIndex)}
                      className="text-red-400 hover:text-red-600 px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addBullet(expIndex)}
                className="text-blue-600 text-xs mt-1 hover:underline"
              >
                + Add Bullet Point
              </button>
            </div>
          ))}
          <button
            onClick={addExperience}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600"
          >
            + Add Work Experience
          </button>
        </Section>

        {/* Education */}
        <Section
          title="Education"
          isOpen={openSections.education}
          onToggle={() => toggleSection("education")}
        >
          {cv.education.map((edu, index) => (
            <div
              key={index}
              className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 relative"
            >
              {cv.education.length > 1 && (
                <button
                  onClick={() => removeEducation(index)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-sm"
                >
                  ✕
                </button>
              )}
              <div className="mb-2">
                <label className={labelStyle}>School</label>
                <input
                  className={inputStyle}
                  value={edu.school}
                  onChange={(e) =>
                    updateEducation(index, "school", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelStyle}>Degree</label>
                  <input
                    className={inputStyle}
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={labelStyle}>Date</label>
                  <input
                    className={inputStyle}
                    value={edu.date}
                    onChange={(e) =>
                      updateEducation(index, "date", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addEducation}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600"
          >
            + Add Education
          </button>
        </Section>

        {/* Technical Skills */}
        <Section
          title="Technical Skills"
          isOpen={openSections.skills}
          onToggle={() => toggleSection("skills")}
        >
          {cv.skills.map((skill, index) => (
            <div key={index} className="flex gap-1 mb-2">
              <input
                className={inputStyle + " flex-1"}
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
              />
              {cv.skills.length > 1 && (
                <button
                  onClick={() => removeSkill(index)}
                  className="text-red-400 hover:text-red-600 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addSkill}
            className="text-blue-600 text-xs mt-1 hover:underline"
          >
            + Add Skill Category
          </button>
        </Section>

        {/* Technical Projects */}
        <Section
          title="Technical Projects and Research"
          isOpen={openSections.projects}
          onToggle={() => toggleSection("projects")}
        >
          {cv.projects.map((project, index) => (
            <div
              key={index}
              className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 relative"
            >
              {cv.projects.length > 1 && (
                <button
                  onClick={() => removeProject(index)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-sm"
                >
                  ✕
                </button>
              )}
              <div className="mb-2">
                <label className={labelStyle}>Project Name</label>
                <input
                  className={inputStyle}
                  value={project.name}
                  onChange={(e) =>
                    updateProject(index, "name", e.target.value)
                  }
                />
              </div>
              <div>
                <label className={labelStyle}>Description</label>
                <textarea
                  className={inputStyle + " h-16 resize-none"}
                  value={project.description}
                  onChange={(e) =>
                    updateProject(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <button
            onClick={addProject}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600"
          >
            + Add Project
          </button>
        </Section>
      </div>

      {/* ==================== RIGHT PANEL - LIVE PREVIEW ==================== */}
      <div className="flex-1 flex justify-center items-start p-8 overflow-auto">
        <div
          className="bg-white shadow-lg"
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "20mm 25mm",
            fontFamily: "Arial, sans-serif",
            fontSize: "11pt",
            lineHeight: "1.5",
            color: "#333",
          }}
        >
          {/* Header - Name */}
          <h1
            style={{
              fontSize: "22pt",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "2px",
              color: "#000",
            }}
          >
            {cv.name}
          </h1>

          {/* Header - Title */}
          <p
            style={{
              textAlign: "center",
              fontSize: "11pt",
              color: "#444",
              marginBottom: "8px",
            }}
          >
            {cv.title}
          </p>

          {/* Header - Contact Info */}
          <p
            style={{
              textAlign: "center",
              fontSize: "9pt",
              color: "#555",
              marginBottom: "16px",
            }}
          >
            {cv.phone} | {cv.email} | {cv.location} | {cv.linkedin}
          </p>

          {/* Divider */}
          <hr style={{ borderTop: "1.5px solid #000", marginBottom: "12px" }} />

          {/* PROFESSIONAL SUMMARY */}
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "bold",
              textTransform: "uppercase",
              borderBottom: "1px solid #999",
              paddingBottom: "2px",
              marginBottom: "6px",
            }}
          >
            Professional Summary
          </h2>
          <p style={{ fontSize: "10pt", marginBottom: "14px" }}>{cv.summary}</p>

          {/* EXPERIENCE */}
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "bold",
              textTransform: "uppercase",
              borderBottom: "1px solid #999",
              paddingBottom: "2px",
              marginBottom: "6px",
            }}
          >
            Experience
          </h2>
          {cv.experiences.map((exp, index) => (
            <div key={index} style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  fontSize: "10.5pt",
                }}
              >
                <span>{exp.company}</span>
                <span style={{ fontWeight: "normal", color: "#555" }}>
                  {exp.date}
                </span>
              </div>
              <p
                style={{
                  fontStyle: "italic",
                  fontSize: "10pt",
                  marginBottom: "4px",
                }}
              >
                {exp.position}
              </p>
              <ul style={{ paddingLeft: "18px", fontSize: "10pt" }}>
                {exp.bullets.map((bullet, i) => (
                  <li key={i} style={{ marginBottom: "2px" }}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* EDUCATION */}
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "bold",
              textTransform: "uppercase",
              borderBottom: "1px solid #999",
              paddingBottom: "2px",
              marginBottom: "6px",
            }}
          >
            Education
          </h2>
          {cv.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  fontSize: "10.5pt",
                }}
              >
                <span>{edu.degree}</span>
                <span style={{ fontWeight: "normal", color: "#555" }}>
                  {edu.date}
                </span>
              </div>
              <p style={{ fontSize: "10pt", fontStyle: "italic" }}>
                {edu.school}
              </p>
            </div>
          ))}

          {/* TECHNICAL SKILLS */}
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "bold",
              textTransform: "uppercase",
              borderBottom: "1px solid #999",
              paddingBottom: "2px",
              marginBottom: "6px",
              marginTop: "14px",
            }}
          >
            Technical Skills
          </h2>
          <ul style={{ paddingLeft: "18px", fontSize: "10pt" }}>
            {cv.skills.map((skill, index) => (
              <li key={index} style={{ marginBottom: "2px" }}>
                {skill}
              </li>
            ))}
          </ul>

          {/* TECHNICAL PROJECTS AND RESEARCH */}
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "bold",
              textTransform: "uppercase",
              borderBottom: "1px solid #999",
              paddingBottom: "2px",
              marginBottom: "6px",
              marginTop: "14px",
            }}
          >
            Technical Projects and Research
          </h2>
          {cv.projects.map((project, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              <p style={{ fontWeight: "bold", fontSize: "10.5pt" }}>
                {project.name}
              </p>
              <p style={{ fontSize: "10pt", paddingLeft: "18px" }}>
                • {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
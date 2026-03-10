"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// CV data - placeholder texts for user guidance
const initialCV = {
  name: "",
  title: "",
  phone: "",
  email: "",
  location: "",
  linkedin: "",
  website: "",

  experiences: [],

  education: [],

  skills: [],

  projects: [],

  references: [],
};

// Reusable accordion section component
function Section({ title, icon, isOpen, onToggle, tips, children }) {
  const [tipsOpen, setTipsOpen] = useState(false);

  return (
    <div className="mx-4 my-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-4 px-5 hover:bg-gray-50 text-left transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <span style={{ color: "rgb(37, 99, 235)" }}>{icon}</span>}
          <span className="font-semibold text-gray-800 text-base">{title}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 border-t border-gray-100">
          {/* Tips and Recommendations */}
          {tips && (
            <div className="mt-4 mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setTipsOpen(!tipsOpen)}
                className="w-full flex justify-between items-center px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">Tips and Recommendations</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`text-gray-400 transition-transform duration-200 ${tipsOpen ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              {tipsOpen && (
                <div className="px-4 pb-3 border-t border-gray-100">
                  <ul className="mt-2 space-y-1.5">
                    {tips.map((tip, i) => (
                      <li key={i} className="text-xs text-gray-600 flex gap-2">
                        <span className="text-gray-400">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {children}
        </div>
      )}
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

  // Zoom level state (percentage)
  const [zoom, setZoom] = useState(100);

    // Zoom controls
  const zoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 10, 40));

  // PDF file name state
  const [pdfName, setPdfName] = useState("Untitled_CV");
  const [editingName, setEditingName] = useState(false);

  // Resizable panel state
  const [panelWidth, setPanelWidth] = useState(384);
  const [isDragging, setIsDragging] = useState(false);

  // Handle mouse drag for resizable panel
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const minWidth = window.innerWidth / 5;
      const maxWidth = window.innerWidth / 2;
      const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

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
              font-family: Inter, sans-serif;
              font-size: 11pt;
              line-height: 1.5;
              color: #333;
            }
            .cv-page {
              width: 100%;
              min-height: 297mm;
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

            .exp-header, .edu-header, .project-name, .cv-section-title {
              break-after: avoid;
            }
            .mb-12, .mb-8 {
              break-inside: avoid;
            }
            @page {
              size: A4;
              margin: 12.7mm;
            }
          </style>
        </head>
        <body>
          <div class="cv-page">
            ${cv.name.trim() !== "" ? `<div class="cv-name">${cv.name}</div>` : ""}
            ${cv.title.trim() !== "" ? `<div class="cv-title">${cv.title}</div>` : ""}
            ${[cv.phone, cv.email, cv.location, cv.linkedin].filter(v => v && v.trim() !== "").length > 0 ? `
              <div class="cv-contact">${[cv.phone, cv.email, cv.location, cv.linkedin].filter(v => v && v.trim() !== "").join(" | ")}</div>
              <hr class="cv-divider" />
            ` : ""}

            ${cv.summary && cv.summary.trim() !== "" ? `
              <div class="cv-section-title">Professional Summary</div>
              <div class="cv-summary">${cv.summary}</div>
            ` : ""}

            ${cv.experiences.length > 0 && cv.experiences.some(exp => exp.company || exp.position) ? `
              <div class="cv-section-title">Experience</div>
              ${cv.experiences.filter(exp => exp.company || exp.position).map(exp => `
                <div class="mb-12">
                  <div class="exp-header">
                    <span>${exp.company}</span>
                    <span class="exp-date">${exp.startDate || ""}${exp.startDate && exp.endDate ? " – " : ""}${exp.endDate || ""}</span>
                  </div>
                  <div class="exp-position">${exp.position}</div>
                  <ul class="exp-bullets" style="list-style-type: disc;">
                    ${exp.bullets.filter(b => b.trim() !== "").map(b => `<li>${b}</li>`).join("")}
                  </ul>
                </div>
              `).join("")}
            ` : ""}

            ${cv.education.length > 0 && cv.education.some(edu => edu.school || edu.degree) ? `
              <div class="cv-section-title">Education</div>
              ${cv.education.filter(edu => edu.school || edu.degree).map(edu => `
                <div class="mb-8">
                  <div class="edu-header">
                    <span>${edu.degree}</span>
                    <span class="edu-date">${edu.date || ""}</span>
                  </div>
                  <div class="edu-school">${edu.school}</div>
                </div>
              `).join("")}
            ` : ""}

            ${cv.skills.length > 0 && cv.skills.some(s => s.category || s.items) ? `
              <div class="cv-section-title">Technical Skills</div>
              <ul class="skills-list" style="list-style-type: disc;">
                ${cv.skills.filter(s => s.category || s.items).map(s => `<li><strong>${s.category}:</strong> ${s.items}</li>`).join("")}
              </ul>
            ` : ""}

            ${cv.projects.length > 0 && cv.projects.some(p => p.name) ? `
              <div class="cv-section-title">Technical Projects and Research</div>
              ${cv.projects.filter(p => p.name).map(p => `
                <div class="mb-8">
                  <div class="exp-header">
                    <span class="project-name">${p.name}</span>
                    <span class="exp-date">${p.startDate || ""}${p.startDate && p.endDate ? " – " : ""}${p.endDate || ""}</span>
                  </div>
                  <ul class="exp-bullets" style="list-style-type: disc;">
                    ${p.bullets.filter(b => b.trim() !== "").map(b => `<li>${b}</li>`).join("")}
                  </ul>
                </div>
              `).join("")}
            ` : ""}

            ${(cv.references.length > 0 || hideReferences) ? `
              <div class="cv-section-title">References</div>
              ${hideReferences
                ? `<p style="font-size: 10pt; font-style: italic;">Available upon request</p>`
                : cv.references.filter(r => r.name).map(r => `
                    <div class="mb-8">
                      <div style="font-weight: bold; font-size: 10.5pt;">${r.name}${r.company ? " — " + r.company : ""}</div>
                      <div style="font-size: 10pt; color: #555;">${r.phone}${r.phone && r.email ? " | " : ""}${r.email}</div>
                    </div>
                  `).join("")
              }
            ` : ""}
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
      a.download = `${pdfName.replace(/\s+/g, "_")}.pdf`;
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
    personal: false,
    summary: false,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    references: false,
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
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          bullets: [""],
        },
      ],
    }));
  };

  // Remove experience
  const removeExperience = (index) => {
    setCv((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  // Move experience up
  const moveExperienceUp = (index) => {
    if (index === 0) return;
    const updated = [...cv.experiences];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setCv((prev) => ({ ...prev, experiences: updated }));
  };

  // Move experience down
  const moveExperienceDown = (index) => {
    if (index === cv.experiences.length - 1) return;
    const updated = [...cv.experiences];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setCv((prev) => ({ ...prev, experiences: updated }));
  };

  // Add bullet to experience
  const addBullet = (expIndex) => {
    const updated = [...cv.experiences];
    updated[expIndex].bullets.push("");
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
          school: "",
          location: "",
          degree: "",
          date: "",
          additionalInfo: "",
        },
      ],
    }));
  };

  // Remove education
  const removeEducation = (index) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Move education up
  const moveEducationUp = (index) => {
    if (index === 0) return;
    const updated = [...cv.education];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setCv((prev) => ({ ...prev, education: updated }));
  };

  // Move education down
  const moveEducationDown = (index) => {
    if (index === cv.education.length - 1) return;
    const updated = [...cv.education];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setCv((prev) => ({ ...prev, education: updated }));
  };

  // Update skill category
  const updateSkillCategory = (index, value) => {
    const updated = [...cv.skills];
    updated[index] = { ...updated[index], category: value };
    setCv((prev) => ({ ...prev, skills: updated }));
  };

  // Update skill items
  const updateSkillItems = (index, value) => {
    const updated = [...cv.skills];
    updated[index] = { ...updated[index], items: value };
    setCv((prev) => ({ ...prev, skills: updated }));
  };

  // Add skill category
  const addSkillCategory = () => {
    setCv((prev) => ({
      ...prev,
      skills: [...prev.skills, { category: "", items: "" }],
    }));
  };

  // Remove skill category
  const removeSkillCategory = (index) => {
    setCv((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Move skill category up
  const moveSkillUp = (index) => {
    if (index === 0) return;
    const updated = [...cv.skills];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setCv((prev) => ({ ...prev, skills: updated }));
  };

  // Move skill category down
  const moveSkillDown = (index) => {
    if (index === cv.skills.length - 1) return;
    const updated = [...cv.skills];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setCv((prev) => ({ ...prev, skills: updated }));
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
        { name: "", startDate: "", endDate: "", url: "", bullets: [""] },
      ],
    }));
  };

  // Remove project
  const removeProject = (index) => {
    setCv((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // Add project bullet
  const addProjectBullet = (projIndex) => {
    const updated = [...cv.projects];
    updated[projIndex].bullets.push("");
    setCv((prev) => ({ ...prev, projects: updated }));
  };

  // Update project bullet
  const updateProjectBullet = (projIndex, bulletIndex, value) => {
    const updated = [...cv.projects];
    updated[projIndex].bullets[bulletIndex] = value;
    setCv((prev) => ({ ...prev, projects: updated }));
  };

  // Remove project bullet
  const removeProjectBullet = (projIndex, bulletIndex) => {
    const updated = [...cv.projects];
    if (updated[projIndex].bullets.length <= 1) return;
    updated[projIndex].bullets = updated[projIndex].bullets.filter(
      (_, i) => i !== bulletIndex
    );
    setCv((prev) => ({ ...prev, projects: updated }));
  };

  // Move project up
  const moveProjectUp = (index) => {
    if (index === 0) return;
    const updated = [...cv.projects];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setCv((prev) => ({ ...prev, projects: updated }));
  };

  // Move project down
  const moveProjectDown = (index) => {
    if (index === cv.projects.length - 1) return;
    const updated = [...cv.projects];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setCv((prev) => ({ ...prev, projects: updated }));
  };

  // Add reference
  const addReference = () => {
    setCv((prev) => ({
      ...prev,
      references: [
        ...prev.references,
        { name: "", company: "", phone: "", email: "" },
      ],
    }));
  };

  // Remove reference
  const removeReference = (index) => {
    setCv((prev) => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index),
    }));
  };

  // Update reference
  const updateReference = (index, field, value) => {
    const updated = [...cv.references];
    updated[index] = { ...updated[index], [field]: value };
    setCv((prev) => ({ ...prev, references: updated }));
  };

  // Show "Available upon request" toggle
  const [hideReferences, setHideReferences] = useState(false);

  // Shared input style
  const inputStyle =
    "w-full border border-gray-200 rounded-md bg-gray-50 px-3 py-2.5 text-sm text-gray-400 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-all";
  const labelStyle = "block text-sm font-medium text-gray-500 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* ==================== LEFT PANEL - FORM ==================== */}
      <div
        className="bg-gray-100 border-r border-gray-300 overflow-y-auto h-screen sticky top-0"
        style={{ width: `${panelWidth}px` }}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
              </svg>
            </button>

            {/* PDF Name */}
            <div className="flex items-center gap-2">
              {editingName ? (
                <input
                  autoFocus
                  value={pdfName}
                  onChange={(e) => setPdfName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
                  className="text-sm font-semibold text-gray-800 border-b border-gray-400 outline-none text-center px-1 py-0.5 bg-transparent"
                />
              ) : (
                <span
                  className="text-sm font-semibold text-gray-800 cursor-pointer"
                  onClick={() => setEditingName(true)}
                >
                  {pdfName}
                </span>
              )}
              <button
                onClick={() => setEditingName(true)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </button>
            </div>

            {/* Spacer for symmetry */}
            <div className="w-8"></div>
          </div>
        </div>

        {/* Personal Information */}
        <Section
          title="Personal Information"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          }
          tips={[
            "Use city, country only; skip full street address.",
            "Use one professional email address (e.g., firstname.lastname@...).",
            "Provide a phone number with the correct country code.",
            "Use relevant professional link (LinkedIn, GitHub, portfolio).",
          ]}
          isOpen={openSections.personal}
          onToggle={() => toggleSection("personal")}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelStyle}>Name</label>
              <input
                className={inputStyle}
                placeholder="Full Name"
                value={cv.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>Job Title</label>
              <input
                className={inputStyle}
                placeholder="Job Title | Position"
                value={cv.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>Email</label>
              <input
                className={inputStyle}
                placeholder="email@example.com"
                value={cv.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>Phone</label>
              <input
                className={inputStyle}
                placeholder="+90 5XX XXX XX XX"
                value={cv.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>City</label>
              <input
                className={inputStyle}
                placeholder="City, Country"
                value={cv.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>LinkedIn</label>
              <input
                className={inputStyle}
                placeholder="linkedin.com/in/yourprofile"
                value={cv.linkedin}
                onChange={(e) => updateField("linkedin", e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>Website/Portfolio</label>
              <input
                className={inputStyle}
                value={cv.website}
                placeholder="Your portfolio or personal website URL"
                onChange={(e) => updateField("website", e.target.value)}
              />
            </div>
          </div>
        </Section>

        {/* Professional Summary */}
        <Section
          title="Professional Summary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
            </svg>
          }
          tips={[
            "Limit to 2–3 sentences (~40–60 words).",
            "State current/target title and years of relevant experience.",
            "Highlight 1–2 core competencies or technical strengths.",
            "Reference one notable metric-based achievement.",
            "Tailor wording to the specific role or industry.",
          ]}
          isOpen={openSections.summary}
          onToggle={() => toggleSection("summary")}
        >
          <textarea
            className={inputStyle + " h-28 resize-none"}
            placeholder="Briefly introduce yourself. Mention your years of experience, areas of expertise, and career objectives."
            value={cv.summary}
            onChange={(e) => updateField("summary", e.target.value)}
          />
        </Section>

        {/* Work Experience */}
        <Section
          title="Work Experience"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5 2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2h3.5A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5H14a.5.5 0 0 1-1 0H3a.5.5 0 0 1-1 0h-.5A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2zm1 0h4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1M1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H3V3zM15 12.5v-9a.5.5 0 0 0-.5-.5H13v10h1.5a.5.5 0 0 0 .5-.5m-3 .5V3H4v10z"/>
            </svg>
          }
          tips={[
            "List experiences in reverse chronological order (most recent first).",
            "Use strong action verbs: Led, Developed, Implemented, Optimized.",
            "Quantify achievements with numbers, percentages, or metrics.",
            "Focus on impact and results, not just duties.",
            "Keep each bullet point to 1–2 lines maximum.",
          ]}
          isOpen={openSections.experience}
          onToggle={() => toggleSection("experience")}
        >
          {/* Add Work Experience Button */}
          <button
            onClick={addExperience}
            className="flex items-center gap-2 mb-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Add Work Experience
          </button>

          {/* Experience Cards */}
          {cv.experiences.map((exp, expIndex) => (
            <div
              key={expIndex}
              className="mb-5 p-5 bg-white border border-gray-200 rounded-xl relative"
            >
              {/* Company - Full Width with Reorder and Trash */}
              <div className="mb-3">
                <label className={labelStyle}>Company</label>
                <div className="flex items-center gap-1">
                  <input
                    className={inputStyle + " flex-1"}
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(expIndex, "company", e.target.value)
                    }
                  />
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveExperienceUp(expIndex)}
                      className={`p-1 transition-colors ${expIndex === 0 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-gray-700"}`}
                      title="Move up"
                      disabled={expIndex === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 11a.5.5 0 0 0 .5-.5V6.707l1.146 1.147a.5.5 0 0 0 .708-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L7.5 6.707V10.5a.5.5 0 0 0 .5.5"/>
                        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => moveExperienceDown(expIndex)}
                      className={`p-1 transition-colors ${expIndex === cv.experiences.length - 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-gray-700"}`}
                      title="Move down"
                      disabled={expIndex === cv.experiences.length - 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5"/>
                        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                      </svg>
                    </button>
                  </div>
                  {/* Delete Button */}
                  <button
                    onClick={() => removeExperience(expIndex)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Role | Location */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelStyle}>Role</label>
                  <input
                    className={inputStyle}
                    placeholder="Role"
                    value={exp.position}
                    onChange={(e) =>
                      updateExperience(expIndex, "position", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={labelStyle}>Location</label>
                  <input
                    className={inputStyle}
                    placeholder="Location"
                    value={exp.location || ""}
                    onChange={(e) =>
                      updateExperience(expIndex, "location", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Start Date | End Date */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelStyle}>Start Date</label>
                  <input
                    className={inputStyle}
                    placeholder="Start Date"
                    value={exp.startDate || ""}
                    onChange={(e) =>
                      updateExperience(expIndex, "startDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={labelStyle}>End Date</label>
                  <input
                    className={inputStyle}
                    placeholder="End Date"
                    value={exp.endDate || ""}
                    onChange={(e) =>
                      updateExperience(expIndex, "endDate", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <label className={labelStyle}>Responsibilities</label>
                {exp.bullets.map((bullet, bIndex) => (
                  <div key={bIndex} className="flex gap-2 mb-2">
                    <input
                      className={inputStyle + " flex-1"}
                      placeholder="New Responsibility"
                      value={bullet}
                      onChange={(e) =>
                        updateBullet(expIndex, bIndex, e.target.value)
                      }
                    />
                    {exp.bullets.length > 1 && (
                      <button
                        onClick={() => removeBullet(expIndex, bIndex)}
                        className="text-gray-400 hover:text-red-500 px-1 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addBullet(expIndex)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-1 transition-colors"
                >
                  <span className="text-base leading-none">+</span>
                  Add Responsibility
                </button>
              </div>
            </div>
          ))}
        </Section>

        {/* Education */}
        <Section
          title="Education"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/>
              <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/>
            </svg>
          }
          tips={[
            "Include relevant coursework.",
            "Mention any academic honors.",
            "List degrees in reverse chronological order.",
          ]}
          isOpen={openSections.education}
          onToggle={() => toggleSection("education")}
        >
          {/* Add Education Button */}
          <button
            onClick={addEducation}
            className="flex items-center gap-2 mb-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Add Education
          </button>

          {/* Education Cards */}
          {cv.education.map((edu, index) => (
            <div
              key={index}
              className="mb-5 p-5 bg-white border border-gray-200 rounded-xl relative"
            >
              {/* University | Location */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelStyle}>University</label>
                  <input
                    className={inputStyle}
                    placeholder="University"
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(index, "school", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={labelStyle}>Location</label>
                  <div className="flex items-center gap-1">
                    <input
                      className={inputStyle + " flex-1"}
                      placeholder="Location"
                      value={edu.location || ""}
                      onChange={(e) =>
                        updateEducation(index, "location", e.target.value)
                      }
                    />
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveEducationUp(index)}
                        className={`p-1 transition-colors ${index === 0 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-gray-700"}`}
                        title="Move up"
                        disabled={index === 0}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 11a.5.5 0 0 0 .5-.5V6.707l1.146 1.147a.5.5 0 0 0 .708-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L7.5 6.707V10.5a.5.5 0 0 0 .5.5"/>
                          <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => moveEducationDown(index)}
                        className={`p-1 transition-colors ${index === cv.education.length - 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-gray-700"}`}
                        title="Move down"
                        disabled={index === cv.education.length - 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5"/>
                          <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                        </svg>
                      </button>
                    </div>
                    {/* Delete Button */}
                    <button
                      onClick={() => removeEducation(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Degree | Graduation Date */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelStyle}>Degree</label>
                  <input
                    className={inputStyle}
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={labelStyle}>Graduation Date</label>
                  <input
                    className={inputStyle}
                    placeholder="Graduation Date"
                    value={edu.date}
                    onChange={(e) =>
                      updateEducation(index, "date", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <label className={labelStyle}>Additional Information</label>
                <textarea
                  className={inputStyle + " h-20 resize-none"}
                  placeholder="Additional information (honors, relevant coursework, etc.)"
                  value={edu.additionalInfo || ""}
                  onChange={(e) =>
                    updateEducation(index, "additionalInfo", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </Section>

        {/* Technical Skills */}
        <Section
          title="Technical Skills"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          }
          tips={[
            "Prioritize skills named in the job posting.",
            "Use standard terminology for applicant-tracking systems.",
            "Group skills by category (e.g., Languages, Frameworks, Tools).",
          ]}
          isOpen={openSections.skills}
          onToggle={() => toggleSection("skills")}
        >
          {/* Add Category Button */}
          <button
            onClick={addSkillCategory}
            className="flex items-center gap-2 mb-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Add Category
          </button>

          {/* Skill Category Cards */}
          {cv.skills.map((skill, index) => (
            <div
              key={index}
              className="mb-5 p-5 bg-white border border-gray-200 rounded-xl relative"
            >
              {/* Category Name */}
              <div className="mb-3">
                <label className={labelStyle}>Category</label>
                <div className="flex items-center gap-1">
                  <input
                    className={inputStyle + " flex-1"}
                    placeholder="e.g. Backend & Languages"
                    value={skill.category}
                    onChange={(e) => updateSkillCategory(index, e.target.value)}
                  />
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveSkillUp(index)}
                      className={`p-1 transition-colors ${index === 0 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-gray-700"}`}
                      title="Move up"
                      disabled={index === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 11a.5.5 0 0 0 .5-.5V6.707l1.146 1.147a.5.5 0 0 0 .708-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L7.5 6.707V10.5a.5.5 0 0 0 .5.5"/>
                        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => moveSkillDown(index)}
                      className={`p-1 transition-colors ${index === cv.skills.length - 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-gray-700"}`}
                      title="Move down"
                      disabled={index === cv.skills.length - 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5"/>
                        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                      </svg>
                    </button>
                  </div>
                  {/* Delete Button */}
                  <button
                    onClick={() => removeSkillCategory(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className={labelStyle}>Skills</label>
                <input
                  className={inputStyle}
                  placeholder="e.g. Python (Expert), SQL (Advanced), Java, C/C++"
                  value={skill.items}
                  onChange={(e) => updateSkillItems(index, e.target.value)}
                />
              </div>
            </div>
          ))}
        </Section>

        {/* Technical Projects and Research */}
        <Section
          title="Projects and Research"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 19a5 5 0 0 1-5-5v8"/><path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5"/><circle cx="13" cy="12" r="2"/><circle cx="20" cy="19" r="2"/>
            </svg>
          }
          tips={[
            "Give each project a clear title and one-line purpose.",
            "Summarize your contribution and the outcome in 1–2 bullets.",
            "Note key technologies or methods used.",
            "Link to code, demo, or portfolio when available.",
            "Select projects that best match the target role's requirements.",
          ]}
          isOpen={openSections.projects}
          onToggle={() => toggleSection("projects")}
        >
          {/* Add Project Button */}
          <button
            onClick={addProject}
            className="flex items-center gap-2 mb-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Add Project
          </button>

          {/* Project Cards */}
          {cv.projects.map((project, index) => (
            <div
              key={index}
              className="mb-5 p-5 bg-white border border-gray-200 rounded-xl relative"
            >
              {/* Project Title */}
              <div className="mb-3">
                <label className={labelStyle}>Project Title</label>
                <div className="flex items-center gap-1">
                  <input
                    className={inputStyle + " flex-1"}
                    placeholder="New Project"
                    value={project.name}
                    onChange={(e) =>
                      updateProject(index, "name", e.target.value)
                    }
                  />
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveProjectUp(index)}
                      className={`p-1 transition-colors ${index === 0 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-gray-700"}`}
                      title="Move up"
                      disabled={index === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 11a.5.5 0 0 0 .5-.5V6.707l1.146 1.147a.5.5 0 0 0 .708-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L7.5 6.707V10.5a.5.5 0 0 0 .5.5"/>
                        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => moveProjectDown(index)}
                      className={`p-1 transition-colors ${index === cv.projects.length - 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-gray-700"}`}
                      title="Move down"
                      disabled={index === cv.projects.length - 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5"/>
                        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                      </svg>
                    </button>
                  </div>
                  {/* Delete Button */}
                  <button
                    onClick={() => removeProject(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Start Date | End Date */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelStyle}>Start Date</label>
                  <input
                    className={inputStyle}
                    placeholder="Start Date"
                    value={project.startDate || ""}
                    onChange={(e) =>
                      updateProject(index, "startDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className={labelStyle}>End Date</label>
                  <input
                    className={inputStyle}
                    placeholder="End Date"
                    value={project.endDate || ""}
                    onChange={(e) =>
                      updateProject(index, "endDate", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Project URL */}
              <div className="mb-3">
                <label className={labelStyle}>Project URL</label>
                <input
                  className={inputStyle}
                  placeholder="Project URL (optional)"
                  value={project.url || ""}
                  onChange={(e) =>
                    updateProject(index, "url", e.target.value)
                  }
                />
              </div>

              {/* Project Descriptions */}
              <div>
                <label className={labelStyle}>Project Descriptions</label>
                {project.bullets.map((bullet, bIndex) => (
                  <div key={bIndex} className="flex gap-2 mb-2">
                    <input
                      className={inputStyle + " flex-1"}
                      placeholder="Project description"
                      value={bullet}
                      onChange={(e) =>
                        updateProjectBullet(index, bIndex, e.target.value)
                      }
                    />
                    {project.bullets.length > 1 && (
                      <button
                        onClick={() => removeProjectBullet(index, bIndex)}
                        className="text-gray-400 hover:text-red-500 px-1 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addProjectBullet(index)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-1 transition-colors"
                >
                  <span className="text-base leading-none">+</span>
                  Add Description
                </button>
              </div>
            </div>
          ))}
        </Section>

        {/* References */}
        <Section
          title="References"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
          isOpen={openSections.references}
          onToggle={() => toggleSection("references")}
        >
          {/* Hide references toggle */}
          <div className="flex items-center gap-3 mb-4 mt-3">
            <button
              onClick={() => setHideReferences(!hideReferences)}
              className={`relative w-10 h-5 rounded-full transition-colors ${hideReferences ? "bg-blue-600" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${hideReferences ? "translate-x-5" : ""}`}
              />
            </button>
            <span className="text-sm text-gray-600">
              Hide references and show "Available upon request"
            </span>
          </div>

          {!hideReferences && (
            <>
              {/* Add Reference Button */}
              <button
                onClick={addReference}
                className="flex items-center gap-2 mb-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg leading-none">+</span>
                Add Reference
              </button>

              {/* Reference Cards */}
              {cv.references.map((ref, index) => (
                <div
                  key={index}
                  className="mb-5 p-5 bg-white border border-gray-200 rounded-xl relative"
                >
                  {/* Name | Company */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={labelStyle}>Referent's Full Name</label>
                      <input
                        className={inputStyle}
                        placeholder="e.g., John Smith"
                        value={ref.name}
                        onChange={(e) =>
                          updateReference(index, "name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Company</label>
                      <input
                        className={inputStyle}
                        placeholder="e.g., Tech Corp"
                        value={ref.company}
                        onChange={(e) =>
                          updateReference(index, "company", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Phone | Email */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={labelStyle}>Phone</label>
                      <input
                        className={inputStyle}
                        placeholder="e.g., +1 (555) 123-4567"
                        value={ref.phone}
                        onChange={(e) =>
                          updateReference(index, "phone", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Email</label>
                      <input
                        className={inputStyle}
                        placeholder="e.g., john@example.com"
                        value={ref.email}
                        onChange={(e) =>
                          updateReference(index, "email", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => removeReference(index)}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </Section>
      </div>

      {/* Resizable Divider */}
      <div
        onMouseDown={handleMouseDown}
        className="relative flex w-1 items-center justify-center bg-gray-300 cursor-col-resize"
        style={{ height: "100vh", position: "sticky", top: 0 }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 z-10 flex h-5 w-3 items-center justify-center rounded-sm border border-gray-400 bg-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <circle cx="9" cy="5" r="1"/>
            <circle cx="9" cy="12" r="1"/>
            <circle cx="9" cy="19" r="1"/>
            <circle cx="15" cy="5" r="1"/>
            <circle cx="15" cy="12" r="1"/>
            <circle cx="15" cy="19" r="1"/>
          </svg>
        </div>
      </div>

      {/* ==================== RIGHT PANEL - TOOLBAR + LIVE PREVIEW ==================== */}
      <div className="flex-1 flex flex-col overflow-auto">

        {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-gray-200">
          <div className="max-w-[200mm] mx-auto bg-white border-x border-b border-gray-300 rounded-b-lg px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Left buttons */}
              <div className="flex gap-2">
                {/* Templates Button */}
                <button className="inline-flex items-center gap-2 border border-gray-300 rounded-md bg-white px-4 py-2 text-gray-700 text-sm font-medium transition-all duration-200 hover:bg-gray-900 hover:text-white hover:border-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6 1H1v14h5zm9 0h-5v5h5zm0 9v5h-5v-5zM0 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm9 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1zm1 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1z"/>
                  </svg>
                  Templates
                </button>

                {/* Layout & Style Button */}
                <button className="inline-flex items-center gap-2 border border-gray-300 rounded-md bg-white px-4 py-2 text-gray-700 text-sm font-medium transition-all duration-200 hover:bg-gray-900 hover:text-white hover:border-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                  </svg>
                  Layout & Style
                </button>
              </div>

              {/* Right button */}
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white text-sm font-medium transition-all duration-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                </svg>
                {downloading ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex justify-center" style={{ paddingTop: "15px", paddingBottom: "0px" }}>
          <div className="inline-flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-2 py-1">
            {/* Zoom Out */}
            <button
              onClick={zoomOut}
              className="p-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
              </svg>
            </button>

            {/* Zoom Percentage */}
            <span className="px-3 text-sm font-medium text-gray-700 select-none min-w-[48px] text-center">
              {zoom}%
            </span>

            {/* Zoom In */}
            <button
              onClick={zoomIn}
              className="p-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
            </button>
          </div>
        </div>

        
        {/* CV Preview */}
        <div className="flex-1 flex justify-center items-start px-8 pb-8" style={{ paddingTop: "20px" }}>
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}
          >
            <div
              className="bg-white shadow-lg"
              style={{
                width: "210mm",
                minHeight: "297mm",
                padding: "12.7mm",
                fontFamily: "Inter, sans-serif",
                fontSize: "11pt",
                lineHeight: "1.5",
                color: "#333",
              }}
            >   
        
          {/* Header - Name */}
          {cv.name.trim() !== "" && (
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
          )}

          {/* Header - Title */}
          {cv.title.trim() !== "" && (
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
          )}

          {/* Header - Contact Info */}
          {(cv.phone || cv.email || cv.location || cv.linkedin).trim() !== "" && (
            <>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "9pt",
                  color: "#555",
                  marginBottom: "16px",
                }}
              >
                {[cv.phone, cv.email, cv.location, cv.linkedin]
                  .filter((v) => v && v.trim() !== "")
                  .join(" | ")}
              </p>
              <hr style={{ borderTop: "1.5px solid #000", marginBottom: "12px" }} />
            </>
          )}

          {/* PROFESSIONAL SUMMARY */}
          {cv.summary && cv.summary.trim() !== "" && (
            <>
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
            </>
          )}

          {/* EXPERIENCE */}
          {cv.experiences.length > 0 && cv.experiences.some((exp) => exp.company || exp.position) && (
            <>
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
              {cv.experiences.filter((exp) => exp.company || exp.position).map((exp, index) => (
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
                      {exp.startDate}{exp.startDate && exp.endDate ? " – " : ""}{exp.endDate}
                    </span>
                  </div>
                  {exp.position && (
                    <p
                      style={{
                        fontStyle: "italic",
                        fontSize: "10pt",
                        marginBottom: "4px",
                      }}
                    >
                      {exp.position}
                    </p>
                  )}
                  <ul style={{ paddingLeft: "18px", fontSize: "10pt", listStyleType: "disc" }}>
                    {exp.bullets.filter((b) => b.trim() !== "").map((bullet, i) => (
                      <li key={i} style={{ marginBottom: "2px" }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}

          {/* EDUCATION */}
          {cv.education.length > 0 && cv.education.some((edu) => edu.school || edu.degree) && (
            <>
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
              {cv.education.filter((edu) => edu.school || edu.degree).map((edu, index) => (
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
            </>
          )}

          {/* TECHNICAL SKILLS */}
          {cv.skills.length > 0 && cv.skills.some((s) => s.category || s.items) && (
            <>
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
              <ul style={{ paddingLeft: "18px", fontSize: "10pt", listStyleType: "disc" }}>
                {cv.skills.filter((s) => s.category || s.items).map((skill, index) => (
                  <li key={index} style={{ marginBottom: "4px" }}>
                    {skill.category && <strong>{skill.category}: </strong>}
                    {skill.items}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* TECHNICAL PROJECTS AND RESEARCH */}
          {cv.projects.length > 0 && cv.projects.some((p) => p.name) && (
            <>
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
              {cv.projects.filter((p) => p.name).map((project, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "10.5pt" }}>
                    <span>{project.name}</span>
                    <span style={{ fontWeight: "normal", color: "#555" }}>
                      {project.startDate}{project.startDate && project.endDate ? " – " : ""}{project.endDate}
                    </span>
                  </div>
                  <ul style={{ paddingLeft: "18px", fontSize: "10pt", listStyleType: "disc" }}>
                    {project.bullets.filter((b) => b.trim() !== "").map((bullet, i) => (
                      <li key={i} style={{ marginBottom: "2px" }}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}

          {/* REFERENCES */}
          {(cv.references.length > 0 || hideReferences) && (
            <>
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
                References
              </h2>
              {hideReferences ? (
                <p style={{ fontSize: "10pt", fontStyle: "italic" }}>
                  Available upon request
                </p>
              ) : (
                cv.references.filter((r) => r.name).map((ref, index) => (
                  <div key={index} style={{ marginBottom: "8px" }}>
                    <div style={{ fontWeight: "bold", fontSize: "10.5pt" }}>
                      {ref.name}{ref.company ? ` — ${ref.company}` : ""}
                    </div>
                    <div style={{ fontSize: "10pt", color: "#555" }}>
                      {ref.phone}{ref.phone && ref.email ? " | " : ""}{ref.email}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* REFERENCES */}
          {(cv.references.length > 0 || hideReferences) && (
            <>
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
                References
              </h2>
              {hideReferences ? (
                <p style={{ fontSize: "10pt", fontStyle: "italic" }}>
                  Available upon request
                </p>
              ) : (
                cv.references.filter((r) => r.name).map((ref, index) => (
                  <div key={index} style={{ marginBottom: "8px" }}>
                    <div style={{ fontWeight: "bold", fontSize: "10.5pt" }}>
                      {ref.name}{ref.company ? ` — ${ref.company}` : ""}
                    </div>
                    <div style={{ fontSize: "10pt", color: "#555" }}>
                      {ref.phone}{ref.phone && ref.email ? " | " : ""}{ref.email}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";

// Hooks
import useCVData from "@/hooks/useCVData";
import useResizablePanel from "@/hooks/useResizablePanel";
import usePdfExport from "@/hooks/usePdfExport";
import useStyleSettings from "@/hooks/useStyleSettings";

// Builder components
import PdfNameEditor from "@/components/builder/PdfNameEditor";
import Toolbar from "@/components/builder/Toolbar";
import ZoomControls from "@/components/builder/ZoomControls";
import ResizableDivider from "@/components/builder/ResizableDivider";

// CV section forms
import PersonalInfoForm from "@/components/cv-sections/PersonalInfoForm";
import SummaryForm from "@/components/cv-sections/SummaryForm";
import ExperienceForm from "@/components/cv-sections/ExperienceForm";
import EducationForm from "@/components/cv-sections/EducationForm";
import SkillsForm from "@/components/cv-sections/SkillsForm";
import ProjectsForm from "@/components/cv-sections/ProjectsForm";
import VolunteeringForm from "@/components/cv-sections/VolunteeringForm";
import CertificationsForm from "@/components/cv-sections/CertificationsForm";
import LanguagesForm from "@/components/cv-sections/LanguagesForm";
import ReferencesForm from "@/components/cv-sections/ReferencesForm";

// Layout & Style panel
import LayoutStylePanel from "@/components/layout-style/LayoutStylePanel";

// CV preview
import CVPreview from "@/components/cv-preview/CVPreview";

export default function Builder() {
  const cvData = useCVData();
  const { cv } = cvData;

  const { panelWidth, handleMouseDown } = useResizablePanel();

  const [hideReferences, setHideReferences] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [builderMode, setBuilderMode] = useState("editor");

  const { styleSettings, updateStyle, reorderSections, resetStyles } = useStyleSettings();

  const pdfExport = usePdfExport(cv, hideReferences, styleSettings);

  const [openSections, setOpenSections] = useState({
    personal: false,
    summary: false,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    volunteering: false,
    certifications: false,
    languages: false,
    references: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="h-screen bg-gray-200 flex overflow-hidden">
      <div
        className="bg-gray-100 border-r border-gray-300 overflow-y-auto h-screen"
        style={{ width: `${panelWidth}px` }}
      >
        {builderMode === "editor" ? (
          <>
            <PdfNameEditor {...pdfExport} />

            <PersonalInfoForm
              cv={cv}
              updateField={cvData.updateField}
              isOpen={openSections.personal}
              onToggle={() => toggleSection("personal")}
            />

            <SummaryForm
              cv={cv}
              updateField={cvData.updateField}
              isOpen={openSections.summary}
              onToggle={() => toggleSection("summary")}
            />

            <ExperienceForm
              experiences={cv.experiences}
              {...cvData}
              isOpen={openSections.experience}
              onToggle={() => toggleSection("experience")}
            />

            <EducationForm
              education={cv.education}
              {...cvData}
              isOpen={openSections.education}
              onToggle={() => toggleSection("education")}
            />

            <SkillsForm
              skills={cv.skills}
              {...cvData}
              isOpen={openSections.skills}
              onToggle={() => toggleSection("skills")}
            />

            <ProjectsForm
              projects={cv.projects}
              {...cvData}
              isOpen={openSections.projects}
              onToggle={() => toggleSection("projects")}
            />

            <VolunteeringForm
              volunteering={cv.volunteering}
              {...cvData}
              isOpen={openSections.volunteering}
              onToggle={() => toggleSection("volunteering")}
            />

            <CertificationsForm
              certifications={cv.certifications}
              {...cvData}
              isOpen={openSections.certifications}
              onToggle={() => toggleSection("certifications")}
            />

            <LanguagesForm
              languages={cv.languages}
              {...cvData}
              isOpen={openSections.languages}
              onToggle={() => toggleSection("languages")}
            />

            <ReferencesForm
              references={cv.references}
              hideReferences={hideReferences}
              setHideReferences={setHideReferences}
              {...cvData}
              isOpen={openSections.references}
              onToggle={() => toggleSection("references")}
            />
          </>
        ) : (
          <LayoutStylePanel
            styleSettings={styleSettings}
            updateStyle={updateStyle}
            reorderSections={reorderSections}
            onBack={() => setBuilderMode("editor")}
          />
        )}
      </div>

      <ResizableDivider onMouseDown={handleMouseDown} />

      <div className="flex-1 h-screen overflow-y-auto bg-gray-200">
        <div className="sticky top-0 z-20 bg-gray-200 pb-[25px]">
          <div className="max-w-[200mm] mx-auto bg-white border-x border-b border-gray-300 rounded-b-lg px-6 py-3">
            <Toolbar
              downloading={pdfExport.downloading}
              onDownloadPDF={pdfExport.handleDownloadPDF}
              onLayoutStyle={() => setBuilderMode("layout")}
              builderMode={builderMode}
            />
          </div>

          <div className="mt-[15px] flex justify-center">
            <ZoomControls zoom={zoom} setZoom={setZoom} />
          </div>
        </div>

        <div className="flex justify-center items-start px-8 pb-8">
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            <CVPreview
              cv={cv}
              hideReferences={hideReferences}
              styleSettings={styleSettings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
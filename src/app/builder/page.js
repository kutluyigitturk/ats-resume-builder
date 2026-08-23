"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

// Hooks
import useCVData from "@/hooks/useCVData";
import useResizablePanel from "@/hooks/useResizablePanel";
import usePdfExport from "@/hooks/usePdfExport";
import useStyleSettings from "@/hooks/useStyleSettings";
import useLocalStorage from "@/hooks/useLocalStorage";
import useUndoRedo from "@/hooks/useUndoRedo";

// Builder components
import PdfNameEditor from "@/components/builder/PdfNameEditor";
import Toolbar from "@/components/builder/Toolbar";
import ZoomControls from "@/components/builder/ZoomControls";
import ResizableDivider from "@/components/builder/ResizableDivider";
import CompletenessPanel from "@/components/builder/CompletenessPanel";

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

// Templates
import TemplateModal from "@/components/builder/TemplateModal";
import SessionExpiredModal from "@/components/builder/SessionExpiredModal";
import { defaultTemplateId, getTemplate } from "@/data/templates";

// Resume manager
import { touchResume, getResumes, updateResumeTemplateId } from "@/lib/resumeManager";

function BuilderInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumeId = searchParams.get("id");

  // Redirect to dashboard if no ID or invalid ID
  useEffect(() => {
    if (!resumeId) {
      router.replace("/dashboard");
      return;
    }
    // Check if this resume actually exists in registry
    const resumes = getResumes();
    const exists = resumes.some((r) => r.id === resumeId);
    if (!exists) {
      router.replace("/dashboard");
    }
  }, [resumeId, router]);

  const cvData = useCVData(resumeId);
  const { cv } = cvData;
  const undoRedo = useUndoRedo(cv, cvData.setCv, cvData.hydrated);

  // Update "last edited" timestamp when CV data changes
  const editedBaseline = useRef(null);

  useEffect(() => {
    if (!resumeId || !cv || !cvData.hydrated) return;

    // The first settled value is what was loaded from storage, not an edit.
    // Stamping it made every card read "Last edited just now" after a look,
    // and kept cleanupEmptyResumes from ever recognising an untouched resume.
    const current = JSON.stringify(cv);
    if (editedBaseline.current === null) {
      editedBaseline.current = current;
      return;
    }
    if (current === editedBaseline.current) return;

    // Debounce the touch to avoid excessive writes
    const timeout = setTimeout(() => {
      touchResume(resumeId);
      editedBaseline.current = current;
    }, 2000);
    return () => clearTimeout(timeout);
  }, [cv, resumeId, cvData.hydrated]);

  const { panelWidth, handleMouseDown } = useResizablePanel();

  // Every other preference survives a reload; this one used to reset, so a
  // resume printed without references had them back the next morning.
  const hideReferencesStorageKey = resumeId
    ? `cv-${resumeId}-hideReferences`
    : "cv-builder-hideReferences";
  const [hideReferences, setHideReferences] = useLocalStorage(hideReferencesStorageKey, false);
  const [zoom, setZoom] = useState(100);
  const [builderMode, setBuilderMode] = useState("editor");
  const [completenessOpen, setCompletenessOpen] = useState(false);

  const { styleSettings, updateStyle, reorderSections } = useStyleSettings(resumeId);

  const templateStorageKey = resumeId ? `cv-${resumeId}-templateId` : "cv-builder-templateId";
  const [templateId, setTemplateId] = useLocalStorage(templateStorageKey, defaultTemplateId);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const pdfExport = usePdfExport(cv, hideReferences, styleSettings, templateId, resumeId);

  const openSectionsKey = resumeId ? `cv-${resumeId}-openSections` : "cv-builder-openSections";
  const [openSections, setOpenSections] = useLocalStorage(openSectionsKey, {
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

  const getSectionTitle = (key, fallback) => cv.sectionTitles?.[key] || fallback;

  const updateSectionTitle = (key, value) => {
    cvData.updateField("sectionTitles", {
      ...cv.sectionTitles,
      [key]: value,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-200">
      <div
        className="h-screen overflow-y-auto border-r border-slate-200 bg-gray-100"
        style={{ width: `${panelWidth}px` }}
      >
        {builderMode === "editor" ? (
          <>
            <PdfNameEditor
              {...pdfExport}
              cv={cv}
              onCompletenessToggle={() => setCompletenessOpen((prev) => !prev)}
            />

            <div className="w-full px-3 pb-5">
              <div className="space-y-2.5">
                <CompletenessPanel cv={cv} isOpen={completenessOpen} />

                <PersonalInfoForm
                  cv={cv}
                  updateField={cvData.updateField}
                  isOpen={openSections.personal}
                  onToggle={() => toggleSection("personal")}
                  sectionTitle={getSectionTitle("personal", "Personal Information")}
                  onSectionTitleChange={(v) => updateSectionTitle("personal", v)}
                />

                <SummaryForm
                  cv={cv}
                  updateField={cvData.updateField}
                  isOpen={openSections.summary}
                  onToggle={() => toggleSection("summary")}
                  sectionTitle={getSectionTitle("summary", "Professional Summary")}
                  onSectionTitleChange={(v) => updateSectionTitle("summary", v)}
                />

                <ExperienceForm
                  experiences={cv.experiences}
                  {...cvData}
                  isOpen={openSections.experience}
                  onToggle={() => toggleSection("experience")}
                  sectionTitle={getSectionTitle("experience", "Work Experience")}
                  onSectionTitleChange={(v) => updateSectionTitle("experience", v)}
                />

                <EducationForm
                  education={cv.education}
                  {...cvData}
                  isOpen={openSections.education}
                  onToggle={() => toggleSection("education")}
                  sectionTitle={getSectionTitle("education", "Education")}
                  onSectionTitleChange={(v) => updateSectionTitle("education", v)}
                />

                <SkillsForm
                  skills={cv.skills}
                  {...cvData}
                  isOpen={openSections.skills}
                  onToggle={() => toggleSection("skills")}
                  sectionTitle={getSectionTitle("skills", "Technical Skills")}
                  onSectionTitleChange={(v) => updateSectionTitle("skills", v)}
                />

                <ProjectsForm
                  projects={cv.projects}
                  {...cvData}
                  isOpen={openSections.projects}
                  onToggle={() => toggleSection("projects")}
                  templateId={templateId}
                  sectionTitle={getSectionTitle("projects", "Technical Projects and Research")}
                  onSectionTitleChange={(v) => updateSectionTitle("projects", v)}
                />

                <VolunteeringForm
                  volunteering={cv.volunteering}
                  {...cvData}
                  isOpen={openSections.volunteering}
                  onToggle={() => toggleSection("volunteering")}
                  sectionTitle={getSectionTitle("volunteering", "Volunteering & Leadership")}
                  onSectionTitleChange={(v) => updateSectionTitle("volunteering", v)}
                />

                <CertificationsForm
                  certifications={cv.certifications}
                  {...cvData}
                  isOpen={openSections.certifications}
                  onToggle={() => toggleSection("certifications")}
                  templateId={templateId}
                  sectionTitle={getSectionTitle("certifications", "Certifications")}
                  onSectionTitleChange={(v) => updateSectionTitle("certifications", v)}
                />

                <LanguagesForm
                  languages={cv.languages}
                  {...cvData}
                  isOpen={openSections.languages}
                  onToggle={() => toggleSection("languages")}
                  sectionTitle={getSectionTitle("languages", "Languages")}
                  onSectionTitleChange={(v) => updateSectionTitle("languages", v)}
                />

                <ReferencesForm
                  references={cv.references}
                  hideReferences={hideReferences}
                  setHideReferences={setHideReferences}
                  {...cvData}
                  isOpen={openSections.references}
                  onToggle={() => toggleSection("references")}
                  sectionTitle={getSectionTitle("references", "References")}
                  onSectionTitleChange={(v) => updateSectionTitle("references", v)}
                />
              </div>
            </div>
          </>
        ) : (
          <LayoutStylePanel
            styleSettings={styleSettings}
            updateStyle={updateStyle}
            reorderSections={reorderSections}
            onBack={() => setBuilderMode("editor")}
            cv={cv}
          />
        )}
      </div>

      <ResizableDivider onMouseDown={handleMouseDown} />

      <div className="flex-1 h-screen overflow-y-auto bg-gray-100">
        <div className="sticky top-0 z-20 bg-gray-100 pb-[25px]">
          <div className="mx-auto max-w-[240mm] rounded-b-lg border-x border-b border-slate-300 bg-white px-6 py-3">
            <Toolbar
              downloading={pdfExport.downloading}
              onDownloadPDF={pdfExport.handleDownloadPDF}
              onLayoutStyle={() => setBuilderMode("layout")}
              onTemplates={() => setTemplateModalOpen(true)}
              builderMode={builderMode}
              onUndo={undoRedo.undo}
              onRedo={undoRedo.redo}
              canUndo={undoRedo.canUndo}
              canRedo={undoRedo.canRedo}
              undoFlash={undoRedo.undoFlash}
              redoFlash={undoRedo.redoFlash}
            />

            {pdfExport.exportError && (
              // Announced when it appears, without stealing focus from the
              // field the user was editing.
              <p
                role="alert"
                className="mt-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-700"
              >
                {pdfExport.exportError}
              </p>
            )}
          </div>

          <div className="mt-[15px] flex justify-center">
            <ZoomControls zoom={zoom} setZoom={setZoom} />
          </div>
        </div>

        <div className="flex items-start justify-center px-8 pb-8">
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            <CVPreview
              cv={cv}
              hideReferences={hideReferences}
              styleSettings={styleSettings}
              templateId={templateId}
            />
          </div>
        </div>
      </div>
      {pdfExport.sessionExpired && (
        <SessionExpiredModal
          onClose={pdfExport.dismissSessionExpired}
          onSignedIn={pdfExport.retryAfterSignIn}
        />
      )}

      <TemplateModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        currentTemplateId={templateId}
        onApply={(newTemplateId) => {
          const previous = getTemplate(templateId);
          const tpl = getTemplate(newTemplateId);
          setTemplateId(newTemplateId);

          // Only carry the new template's fonts over if the current ones are
          // still the outgoing template's defaults. A font the user chose is
          // not ours to reset, and there is no undo for style settings.
          if (styleSettings.primaryFont === previous.defaultPrimaryFont) {
            updateStyle("primaryFont", tpl.defaultPrimaryFont);
          }
          if (styleSettings.secondaryFont === previous.defaultSecondaryFont) {
            updateStyle("secondaryFont", tpl.defaultSecondaryFont);
          }

          if (resumeId) updateResumeTemplateId(resumeId, newTemplateId);
        }}
        cv={cv}
        hideReferences={hideReferences}
        styleSettings={styleSettings}
      />
    </div>
  );
}

export default function Builder() {
  return (
    <Suspense>
      <BuilderInner />
    </Suspense>
  );
}

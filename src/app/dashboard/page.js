"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import TemplateModal from "@/components/builder/TemplateModal";
import CVPreview from "@/components/cv-preview/CVPreview";
import initialCV from "@/data/initialCV";
import sampleCV from "@/data/sampleCV";
import { defaultStyleSettings } from "@/data/styleDefaults";
import {
  getResumes,
  createResume,
  createResumeWithData,
  deleteResume,
  renameResume,
  duplicateResume,
  migrateIfNeeded,
  cleanupEmptyResumes,
  readJSON,
  cvDataKey,
  styleKey,
  templateKey,
} from "@/lib/resumeManager";

import {
  PlusIcon,
  FileTextIcon,
  EditIcon,
  RenameIcon,
  DuplicateIcon,
  TrashOutlineIcon as TrashIcon,
} from "@/icons";

/* ─── Constants ──────────────────────────────────── */

const BG_COLOR = "#fafafa";

/* ─── Helpers ────────────────────────────────────── */

function formatTimeAgo(isoString) {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ─── Mini CV Preview ────────────────────────────── */

function MiniCVPreview({ resumeId }) {
  const [cvData, setCvData] = useState(null);
  const [style, setStyle] = useState(null);
  const [tplId, setTplId] = useState(null);

  useEffect(() => {
    setCvData(readJSON(cvDataKey(resumeId)) || initialCV);
    setStyle(readJSON(styleKey(resumeId)) || defaultStyleSettings);
    setTplId(readJSON(templateKey(resumeId)) || "classic");
  }, [resumeId]);

  if (!cvData) return null;

  return (
    <div className="pointer-events-none select-none">
      <div className="w-full h-full rounded-lg overflow-hidden flex items-start justify-center" style={{ background: BG_COLOR }}>
        <div className="relative w-full h-full">
          <div
            style={{
              transform: "scale(0.243)",
              transformOrigin: "left top",
              width: "210mm",
              height: "297mm",
              overflow: "hidden",
            }}
          >
            <CVPreview
              cv={cvData}
              hideReferences={false}
              styleSettings={style}
              templateId={tplId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Resume Card ────────────────────────────────── */

function ResumeCard({ resume, onEdit, onRename, onDuplicate, onDelete }) {
  const timeAgo = formatTimeAgo(resume.updatedAt);

  const templateBadge = {
    classic: { label: "Classic", className: "bg-slate-100 text-slate-500" },
    advanced: { label: "Advanced", className: "bg-blue-50 text-blue-600" },
    professional: { label: "Professional", className: "bg-violet-50 text-violet-600" },
  };
  const badge = templateBadge[resume.templateId] || templateBadge.classic;

  return (
    <div className="overflow-hidden rounded-xl shadow-md transition-all duration-300 ease-in-out hover:shadow-lg" style={{ background: "#fff" }}>
      <div className="flex p-6" style={{ height: "300px" }}>
        {/* Left — Real CV Preview */}
        <div className="relative isolate w-48 h-64 mr-6 flex-shrink-0">
          <div className="w-full h-full rounded-lg overflow-hidden border border-slate-200 shadow-sm" style={{ background: "#fff" }}>
            <MiniCVPreview resumeId={resume.id} />
          </div>
        </div>

        {/* Right — Info + Actions */}
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-slate-400">Resume Title:</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.className}`}>
                  {badge.label}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 truncate mb-1">
              {resume.name}
            </h3>
            <p className="text-xs text-slate-400">
              Last edited {timeAgo}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 mt-4">
            <button
              onClick={() => onEdit(resume.id)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50/50 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
            >
              <EditIcon />
              Edit Resume
            </button>
            <button
              onClick={() => onRename(resume.id, resume.name)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              style={{ background: "#fff" }}
            >
              <RenameIcon />
              Rename
            </button>
            <button
              onClick={() => onDuplicate(resume.id)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50/50 px-4 py-2 text-sm font-medium text-violet-600 transition-colors hover:bg-violet-100"
            >
              <DuplicateIcon />
              Duplicate
            </button>
            <button
              onClick={() => onDelete(resume.id, resume.name)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50/40 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-100"
            >
              <TrashIcon />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Create New Card ────────────────────────────── */

function CreateCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200/80 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
      style={{ height: "300px", background: "transparent" }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 transition-all duration-200 group-hover:bg-slate-200 group-hover:text-slate-600 group-hover:scale-105">
        <PlusIcon size={22} />
      </div>
      <span className="mt-3 text-sm font-semibold text-slate-500 transition-colors group-hover:text-slate-700">
        Create New Resume
      </span>
      <span className="mt-1 text-xs text-slate-400">
        Choose a template to start
      </span>
    </button>
  );
}

/* ─── Empty State ────────────────────────────────── */

function StepIndicator() {
  const steps = [
    { num: "1", label: "Choose a template" },
    { num: "2", label: "Fill in your info" },
    { num: "3", label: "Export as PDF" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-slate-200/60 px-3 py-1.5" style={{ background: "#fff" }}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
              {step.num}
            </span>
            <span className="text-xs font-medium text-slate-600">{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <svg width="20" height="8" viewBox="0 0 20 8" fill="none" className="text-slate-300">
              <path d="M0 4h16M13 1l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

function EntryCard({ icon, title, description, onClick, highlight = false, badge = null }) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
        highlight
          ? "border-blue-200/80 hover:border-blue-300"
          : "border-slate-200/70 hover:border-slate-300"
      }`}
      style={{ background: highlight ? "rgba(239,246,255,0.5)" : "#fff" }}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
          highlight
            ? "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
        }`}
      >
        {icon}
      </div>
      <div>
        <h3 className={`text-sm font-bold mb-1 ${highlight ? "text-blue-900" : "text-slate-800"}`}>
          {title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      {badge && (
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
          badge === "ai"
            ? "bg-amber-50 text-amber-700 border border-amber-200/60"
            : "bg-blue-50 text-blue-700"
        }`}>
          {badge === "ai" ? "AI Required" : badge}
        </span>
      )}
    </button>
  );
}

function TrustBadge({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-slate-500">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
        {icon}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

function EmptyState({ onCreate, onSampleStart, onPasteStart }) {
  return (
    <div className="mx-auto max-w-3xl py-4">
      <div className="text-center mb-8">
        <h2
          className="text-3xl font-extrabold tracking-tight text-slate-900 mb-3"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Your next career move starts here
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Build a professional, ATS-friendly resume in minutes. Choose how you&apos;d like to get started.
        </p>
      </div>

      <StepIndicator />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <EntryCard
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>}
          title="Start from scratch"
          description="Pick a template and build your resume step by step."
          onClick={onCreate}
        />
        <EntryCard
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>}
          title="Explore with sample"
          description="Start with a pre-filled resume to see how it looks."
          onClick={onSampleStart}
          highlight
          badge="Recommended"
        />
        <EntryCard
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>}
          title="Upload your resume"
          description="Import from an existing PDF and let AI fill in the fields."
          onClick={onPasteStart}
          badge="ai"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-slate-200/60">
        <TrustBadge icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>} label="ATS-optimized templates" />
        <TrustBadge icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>} label="Real-time A4 preview" />
        <TrustBadge icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>} label="One-click PDF export" />
        <TrustBadge icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} label="Your data stays in your browser" />
      </div>
    </div>
  );
}

/* ─── AI Required Modal ──────────────────────────── */

function AIRequiredModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-4 w-full max-w-sm rounded-3xl border border-slate-200/60 p-8 shadow-2xl text-center"
        style={{ background: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200/50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.663 17h4.674M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547Z" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">AI Update Required</h3>
        <p className="mb-6 text-sm text-slate-500 leading-relaxed">
          Uploading and parsing resumes requires AI integration, which is currently in development. This feature will be available soon.
        </p>
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

/* ─── Delete Modal ───────────────────────────────── */

function DeleteModal({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onCancel}>
      <div
        className="mx-4 w-full max-w-sm rounded-3xl border border-slate-200/60 p-8 shadow-2xl text-center"
        style={{ background: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 border border-red-200/50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" /><path d="M12 17h.01" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">Delete Resume</h3>
        <p className="mb-8 text-sm text-slate-500 leading-relaxed">
          You are about to delete &ldquo;{name}&rdquo;.<br />Are you sure you want to proceed?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
            No, keep it
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600">
            Yes, delete it
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Rename Modal ───────────────────────────────── */

function RenameModal({ currentName, onConfirm, onCancel }) {
  const [name, setName] = useState(currentName);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.select(); }, []);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed) onConfirm(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onCancel}>
      <div
        className="mx-4 w-full max-w-sm rounded-3xl border border-slate-200/60 p-8 shadow-2xl"
        style={{ background: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200/50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
          </svg>
        </div>
        <h3 className="mb-4 text-center text-lg font-bold text-slate-900">Rename Resume</h3>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="mb-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          style={{ background: BG_COLOR }}
          placeholder="Resume name"
          autoFocus
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Dashboard Page ─────────────────────────────── */

export default function Dashboard() {
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [pendingImportData, setPendingImportData] = useState(null);

  useEffect(() => {
    migrateIfNeeded();
    cleanupEmptyResumes();
    setResumes(getResumes());
    setHydrated(true);
  }, []);

  const handleCreate = (name, templateId) => {
    let id;
    if (pendingImportData) {
      id = createResumeWithData(name, templateId, pendingImportData);
      setPendingImportData(null);
    } else {
      id = createResume(name, templateId);
    }
    setShowCreateModal(false);
    router.push(`/builder?id=${id}`);
  };

  const handleSampleStart = () => {
    setPendingImportData(sampleCV);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setPendingImportData(null);
  };

  const handleEdit = (id) => { router.push(`/builder?id=${id}`); };

  const handleDuplicate = (id) => {
    duplicateResume(id);
    setResumes(getResumes());
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteResume(deleteTarget.id);
    setResumes(getResumes());
    setDeleteTarget(null);
  };

  const handleRename = (newName) => {
    if (!renameTarget) return;
    renameResume(renameTarget.id, newName);
    setResumes(getResumes());
    setRenameTarget(null);
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: BG_COLOR }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
      </div>
    );
  }

  const isEmpty = resumes.length === 0;

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: BG_COLOR }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-50/40 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-50/30 blur-[120px]" />
      </div>

      <Navbar maxWidth="1024px" baseRingClass="ring-slate-200/50" justify="justify-center">
        <Logo />
      </Navbar>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-28 pb-16">
        {!isEmpty && (
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              My Resumes
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {`${resumes.length} resume${resumes.length !== 1 ? "s" : ""} — pick one to continue or create a new one.`}
            </p>
          </div>
        )}

        {isEmpty ? (
          <EmptyState
            onCreate={() => setShowCreateModal(true)}
            onSampleStart={handleSampleStart}
            onPasteStart={() => setShowAIModal(true)}
          />
        ) : (
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onEdit={handleEdit}
                onRename={(id, name) => setRenameTarget({ id, name })}
                onDuplicate={handleDuplicate}
                onDelete={(id, name) => setDeleteTarget({ id, name })}
              />
            ))}
            <CreateCard onClick={() => setShowCreateModal(true)} />
          </div>
        )}
      </main>

      <TemplateModal isOpen={showCreateModal} onClose={handleCloseCreateModal} mode="create" onCreate={handleCreate} />
      {showAIModal && <AIRequiredModal onClose={() => setShowAIModal(false)} />}
      {deleteTarget && <DeleteModal name={deleteTarget.name} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {renameTarget && <RenameModal currentName={renameTarget.name} onConfirm={handleRename} onCancel={() => setRenameTarget(null)} />}
    </div>
  );
}
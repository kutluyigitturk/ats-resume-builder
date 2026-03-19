"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import TemplateModal from "@/components/builder/TemplateModal";
import CVPreview from "@/components/cv-preview/CVPreview";
import initialCV from "@/data/initialCV";
import { defaultStyleSettings } from "@/data/styleDefaults";
import {
  getResumes,
  createResume,
  deleteResume,
  renameResume,
  duplicateResume,
  migrateIfNeeded,
  cleanupEmptyResumes,
  cvDataKey,
  styleKey,
  templateKey,
} from "@/lib/resumeManager";

/* ─── Helpers ────────────────────────────────────── */

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

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

/* ─── Icons ──────────────────────────────────────── */

function PlusIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function RenameIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

/* ─── Floating Navbar ────────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 w-full max-w-[1024px] rounded-2xl transition-all duration-300 ${
        scrolled
          ? "ring-1 ring-slate-900/5 bg-white/60 backdrop-blur-3xl shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
          : "ring-1 ring-slate-200/50 bg-white/40 backdrop-blur-3xl"
      }`}
    >
      <div className="flex h-[56px] items-center justify-center px-8">
        <Logo />
      </div>
    </nav>
  );
}

/* ─── Mini CV Preview (real render) ──────────────── */

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
      <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden flex items-start justify-center">
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

/* ─── Resume Card (Jobsuit-style, 4 buttons) ─────── */

function ResumeCard({ resume, onEdit, onRename, onDuplicate, onDelete }) {
  const timeAgo = formatTimeAgo(resume.updatedAt);
  const isAdvanced = resume.templateId === "advanced";

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-lg">
      <div className="flex p-6" style={{ height: "300px" }}>
        {/* Left — Real CV Preview */}
        <div className="relative isolate w-48 h-64 mr-6 flex-shrink-0">
          <div className="w-full h-full rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
            <MiniCVPreview resumeId={resume.id} />
          </div>
        </div>

        {/* Right — Info + Actions */}
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-slate-400">Resume Title:</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                isAdvanced ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
              }`}>
                {isAdvanced ? "Advanced" : "Classic"}
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
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
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
      className="group flex flex-col items-center justify-center overflow-hidden rounded-xl bg-white/60 border-2 border-dashed border-slate-200/80 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md"
      style={{ height: "300px" }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 transition-all duration-200 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:scale-105">
        <PlusIcon size={24} />
      </div>
      <span className="mt-3 text-sm font-bold text-slate-500 transition-colors group-hover:text-blue-600">
        Create New Resume
      </span>
      <span className="mt-1 text-xs text-slate-400 transition-colors group-hover:text-blue-500">
        Classic or Advanced template
      </span>
    </button>
  );
}

/* ─── Empty State ────────────────────────────────── */

function EmptyState({ onCreate }) {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm border border-slate-200/60">
        <FileTextIcon />
      </div>
      <h2
        className="mb-3 text-2xl font-extrabold tracking-tight text-slate-900"
        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
      >
        No resumes yet
      </h2>
      <p className="mb-8 text-sm leading-relaxed text-slate-500">
        Create your first resume and start building your career story. It takes less than a minute to get started.
      </p>
      <button
        onClick={onCreate}
        className="btn-primary inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-slate-800 hover:shadow-xl hover:scale-[1.02]"
      >
        <PlusIcon />
        Create Your First Resume
      </button>
    </div>
  );
}

/* ─── Delete Confirm Modal ───────────────────────── */

function DeleteModal({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onCancel}>
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-2 text-base font-bold text-slate-900">Delete Resume</h3>
        <p className="mb-6 text-sm text-slate-500">
          Are you sure you want to delete <span className="font-semibold text-slate-700">&quot;{name}&quot;</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2.5">
          <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">Cancel</button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">Delete</button>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onCancel}>
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-base font-bold text-slate-900">Rename Resume</h3>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="mb-6 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="Resume name"
          autoFocus
        />
        <div className="flex justify-end gap-2.5">
          <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">Cancel</button>
          <button onClick={handleSubmit} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800">Save</button>
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

  useEffect(() => {
    migrateIfNeeded();
    cleanupEmptyResumes();
    setResumes(getResumes());
    setHydrated(true);
  }, []);

  const handleCreate = (name, templateId) => {
    const id = createResume(name, templateId);
    setShowCreateModal(false);
    router.push(`/builder?id=${id}`);
  };

  const handleEdit = (id) => {
    router.push(`/builder?id=${id}`);
  };

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      {/* ── Background gradient ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-100/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-50/40 blur-[100px]" />
      </div>

      {/* ── Floating Navbar ── */}
      <Navbar />

      {/* ── Main Content ── */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-28 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            My Resumes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {resumes.length === 0
              ? "Create your first resume to get started."
              : `${resumes.length} resume${resumes.length !== 1 ? "s" : ""} — pick one to continue or create a new one.`
            }
          </p>
        </div>

        {/* Grid */}
        {resumes.length === 0 ? (
          <EmptyState onCreate={() => setShowCreateModal(true)} />
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
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

      {/* ── Modals ── */}
      <TemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        mode="create"
        onCreate={handleCreate}
      />

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {renameTarget && (
        <RenameModal
          currentName={renameTarget.name}
          onConfirm={handleRename}
          onCancel={() => setRenameTarget(null)}
        />
      )}
    </div>
  );
}
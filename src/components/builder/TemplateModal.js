"use client";

import { useState, useEffect } from "react";
import { templates } from "@/data/templates";
import CVPreview from "@/components/cv-preview/CVPreview";

/* ─── Mini Preview ───────────────────────────────── */

function MiniPreview({ cv, hideReferences, styleSettings, isSelected }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg transition-shadow duration-200 ${
        isSelected
          ? "shadow-[0_2px_12px_rgba(59,130,246,0.12)]"
          : "shadow-[0_1px_4px_rgba(15,23,42,0.08)]"
      }`}
      style={{
        height: "420px",
        background: "linear-gradient(145deg, #f1f5f9 0%, #e8ecf1 100%)",
      }}
    >
      {/* Inner CV paper with shadow */}
      <div
        className="absolute bg-white"
        style={{
          top: "12px",
          left: "50%",
          transform: "translateX(-50%) scale(0.46)",
          transformOrigin: "top center",
          width: "210mm",
          height: "297mm",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
          borderRadius: "2px",
          pointerEvents: "none",
        }}
      >
        <CVPreview
          cv={cv}
          hideReferences={hideReferences}
          styleSettings={styleSettings}
        />
      </div>
    </div>
  );
}

/* ─── Badge ──────────────────────────────────────── */

function Badge({ text }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
      {text}
    </span>
  );
}

/* ─── Template Card ──────────────────────────────── */

function TemplateCard({
  template,
  isSelected,
  isDefault,
  onSelect,
  cv,
  hideReferences,
  styleSettings,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(template.id)}
      className={`group relative w-full text-left rounded-2xl border-2 transition-all duration-200 ${
        isSelected
          ? "border-blue-500 bg-white shadow-[0_0_0_2px_rgba(59,130,246,0.15),0_8px_24px_rgba(59,130,246,0.08)]"
          : "border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] hover:-translate-y-0.5"
      }`}
    >
      {/* Card Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[15px] font-bold text-slate-900">
                {template.name}
              </span>

              {isDefault && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600 ring-1 ring-blue-100">
                  Current
                </span>
              )}
            </div>

            <p className="text-xs leading-relaxed text-slate-500 mb-2.5">
              {template.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {template.badges.map((badge) => (
                <Badge key={badge} text={badge} />
              ))}
            </div>
          </div>

          {/* Radio indicator */}
          <div
            className={`ml-4 mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
              isSelected
                ? "border-blue-500 bg-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
                : "border-slate-300 group-hover:border-slate-400"
            }`}
          >
            {isSelected && (
              <div className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="px-4 pb-3">
        <MiniPreview
          cv={cv}
          hideReferences={hideReferences}
          styleSettings={styleSettings}
          isSelected={isSelected}
        />
      </div>

      {/* Footer — metadata strip */}
      <div
        className={`flex items-center justify-between rounded-b-2xl px-5 py-2.5 transition-colors duration-200 ${
          isSelected ? "bg-blue-50/60" : "bg-slate-50/80"
        }`}
      >
        <span
          className={`text-[11px] font-medium ${
            isSelected ? "text-blue-600" : "text-slate-400"
          }`}
        >
          Default font: {template.defaultFont}, sans-serif
        </span>
      </div>
    </button>
  );
}

/* ─── Main Modal ─────────────────────────────────── */

export default function TemplateModal({
  isOpen,
  onClose,
  currentTemplateId,
  onApply,
  cv,
  hideReferences,
  styleSettings,
}) {
  const [selectedId, setSelectedId] = useState(currentTemplateId);

  useEffect(() => {
    if (isOpen) setSelectedId(currentTemplateId);
  }, [isOpen, currentTemplateId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(selectedId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 flex max-h-[96vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Choose Resume Template
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Select a template that fits your style. Your content will be preserved.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          <div className="grid grid-cols-2 gap-6">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedId === template.id}
                isDefault={currentTemplateId === template.id}
                onSelect={setSelectedId}
                cv={cv}
                hideReferences={hideReferences}
                styleSettings={styleSettings}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-7 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(15,23,42,0.15)] transition-all duration-200 hover:bg-slate-800 hover:shadow-[0_6px_16px_rgba(15,23,42,0.2)]"
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
}
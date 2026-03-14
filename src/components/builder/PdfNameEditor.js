"use client";

import { BackArrowIcon, PencilIcon } from "@/icons";

export default function PdfNameEditor({
  pdfName,
  setPdfName,
  editingName,
  setEditingName,
}) {
  return (
    <div className="sticky top-0 z-20 bg-gradient-to-b from-[#f3f4f6] via-[#f3f4f6] to-transparent px-3 pb-2.5 pt-3">
      <div className="w-full rounded-[18px] border border-slate-200 bg-white/95 px-4 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur">
        <div className="grid grid-cols-[36px_1fr_36px] items-center gap-2.5">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100"
          >
            <BackArrowIcon />
          </button>

          <div className="flex min-w-0 items-center justify-center gap-2">
            {editingName ? (
              <input
                autoFocus
                value={pdfName}
                onChange={(e) => setPdfName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
                className="w-full max-w-[240px] border-b border-slate-300 bg-transparent px-1 py-0.5 text-center text-sm font-semibold text-slate-900 outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingName(true)}
                className="truncate text-sm font-semibold tracking-[-0.01em] text-slate-900"
              >
                {pdfName}
              </button>
            )}

            <button
              type="button"
              onClick={() => setEditingName(true)}
              className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <PencilIcon />
            </button>
          </div>

          <div className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
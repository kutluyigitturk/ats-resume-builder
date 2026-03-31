"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { BackArrowIcon, PencilIcon } from "@/icons";
import CompletenessIndicator from "@/components/builder/CompletenessIndicator";

export default function PdfNameEditor({
  pdfName,
  setPdfName,
  editingName,
  setEditingName,
  cv,
  onCompletenessToggle,
}) {
  const measureRef = useRef(null);
  const [inputWidth, setInputWidth] = useState("auto");

  useEffect(() => {
    if (measureRef.current) {
      setInputWidth(`${measureRef.current.scrollWidth + 2}px`);
    }
  }, [pdfName]);

  return (
    <div className="sticky top-0 z-20 bg-gradient-to-b from-[#f3f4f6] via-[#f3f4f6] to-transparent px-3 pb-2.5 pt-3">
      <div className="w-full rounded-[18px] border border-slate-200 bg-white/95 px-4 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur">
        <div className="grid grid-cols-[36px_1fr_36px] items-center gap-2.5">
          <Link
            href="/dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100"
          >
            <BackArrowIcon />
          </Link>

          <div className="flex min-w-0 items-center justify-center gap-2">
            <span
              ref={measureRef}
              aria-hidden="true"
              className="pointer-events-none invisible absolute whitespace-pre text-sm font-semibold tracking-[-0.01em]"
            >
              {pdfName || "\u00A0"}
            </span>

            {editingName ? (
              <input
                autoFocus
                value={pdfName}
                onChange={(e) => setPdfName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
                style={{ width: inputWidth }}
                className="min-w-[2ch] border-none bg-transparent p-0 text-center text-sm font-semibold tracking-[-0.01em] text-slate-900 outline-none"
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
              className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-md transition-colors ${
                editingName
                  ? "bg-slate-100 text-slate-600"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              }`}
            >
              <PencilIcon />
            </button>
          </div>

          <CompletenessIndicator cv={cv} onToggle={onCompletenessToggle} />
        </div>
      </div>
    </div>
  );
}
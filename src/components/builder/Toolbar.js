"use client";

import { TemplatesIcon, SettingsIcon, DownloadIcon } from "@/icons";

export default function Toolbar({ downloading, onDownloadPDF, onLayoutStyle, builderMode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
        >
          <TemplatesIcon />
          <span>Templates</span>
        </button>

        <button
          type="button"
          onClick={onLayoutStyle}
          className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-all duration-200 ${
            builderMode === "layout"
              ? "border-slate-900 bg-slate-900 text-white shadow-[0_6px_16px_rgba(15,23,42,0.16)]"
              : "border-slate-200 bg-white text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <SettingsIcon />
          <span>Layout & Style</span>
        </button>
      </div>

      <button
        type="button"
        onClick={onDownloadPDF}
        disabled={downloading}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(15,23,42,0.16)] transition-all duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        <DownloadIcon />
        <span>{downloading ? "Generating..." : "Download PDF"}</span>
      </button>
    </div>
  );
}
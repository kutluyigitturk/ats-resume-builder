"use client";

import { TemplatesIcon, SettingsIcon, DownloadIcon } from "@/icons";

export default function Toolbar({ downloading, onDownloadPDF, onLayoutStyle, builderMode }) {
  return (
    <div className="flex items-center justify-between">
      {/* Left buttons */}
      <div className="flex gap-2">
        <button className="inline-flex items-center gap-2 border border-gray-300 rounded-md bg-white px-4 py-2 text-gray-700 text-sm font-medium transition-all duration-200 hover:bg-gray-900 hover:text-white hover:border-gray-900">
          <TemplatesIcon />
          Templates
        </button>

        <button
          onClick={onLayoutStyle}
          className={`inline-flex items-center gap-2 border rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
            builderMode === "layout"
              ? "bg-gray-900 text-white border-gray-900"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900"
          }`}
        >
          <SettingsIcon />
          Layout & Style
        </button>
      </div>

      {/* Download PDF */}
      <button
        onClick={onDownloadPDF}
        disabled={downloading}
        className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white text-sm font-medium transition-all duration-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <DownloadIcon />
        {downloading ? "Generating..." : "Download PDF"}
      </button>
    </div>
  );
}
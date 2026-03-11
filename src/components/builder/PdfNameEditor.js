"use client";

import { BackArrowIcon, PencilIcon } from "@/icons";

export default function PdfNameEditor({ pdfName, setPdfName, editingName, setEditingName }) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Back Button */}
        <button className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-800">
          <BackArrowIcon />
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
            <PencilIcon />
          </button>
        </div>

        {/* Spacer for symmetry */}
        <div className="w-8" />
      </div>
    </div>
  );
}
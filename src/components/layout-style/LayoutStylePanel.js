"use client";

import { BackArrowIcon } from "@/icons";
import FormattingSection from "@/components/layout-style/FormattingSection";
import ReorderSections from "@/components/layout-style/ReorderSections";
import MarginsSpacingSection from "@/components/layout-style/MarginsSpacingSection";

export default function LayoutStylePanel({
  styleSettings,
  updateStyle,
  reorderSections,
  onBack,
}) {
  return (
    <div className="h-full">
      {/* Header — matches PdfNameEditor style */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
        >
          <BackArrowIcon />
          Back to Editor
        </button>
      </div>

      {/* Content */}
      <FormattingSection
        styleSettings={styleSettings}
        updateStyle={updateStyle}
      />

      <ReorderSections
        sectionOrder={styleSettings.sectionOrder}
        onReorder={reorderSections}
      />

      <MarginsSpacingSection
        styleSettings={styleSettings}
        updateStyle={updateStyle}
      />
    </div>
  );
}
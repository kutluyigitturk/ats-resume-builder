"use client";

import { BackArrowIcon } from "@/icons";
import FormattingSection from "@/components/layout-style/FormattingSection";
import ReorderSections from "@/components/layout-style/ReorderSections";
import MarginsSpacingSection from "@/components/layout-style/MarginsSpacingSection"


export default function LayoutStylePanel({
  styleSettings,
  updateStyle,
  reorderSections,
  onBack,
  cv,
}) {
  return (
    <div>
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#f3f4f6] via-[#f3f4f6] to-transparent px-3 pb-2.5 pt-3">
        <div className="mx-3 mt-2.5 mb-0 overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.05)]">
          <button
            type="button"
            onClick={onBack}
            className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-colors hover:bg-slate-50/80"
          >
            <span className="flex shrink-0 items-center justify-center text-slate-700">
              <BackArrowIcon />
            </span>

            <span className="truncate text-[15px] font-semibold tracking-[-0.01em] text-slate-900">
              Back to Editor
            </span>
          </button>
        </div>
      </div>

      <FormattingSection
        styleSettings={styleSettings}
        updateStyle={updateStyle}
      />

      <ReorderSections
        sectionOrder={styleSettings.sectionOrder}
        onReorder={reorderSections}
        cv={cv}
      />

      <MarginsSpacingSection
        styleSettings={styleSettings}
        updateStyle={updateStyle}
      />
    </div>
  );
}
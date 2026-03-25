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
        <div className="w-full rounded-[18px] border border-slate-200 bg-white/95 px-4 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur">
          <div className="grid grid-cols-[36px_1fr_36px] items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100"
            >
              <BackArrowIcon />
            </button>

            <span className="truncate text-center text-sm font-semibold tracking-[-0.01em] text-slate-900">
              Back to Editor
            </span>

            <div className="h-8 w-8" />
          </div>
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
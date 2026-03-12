"use client";

import FontSelect from "@/components/layout-style/FontSelect";
import StepperControl from "@/components/layout-style/StepperControl";
import { styleControls } from "@/data/styleDefaults";
import { FontsIcon } from "@/icons";

export default function FormattingSection({ styleSettings, updateStyle }) {
  return (
    <div className="mx-4 mt-4 mb-4 bg-white border border-gray-200 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <span style={{ color: "rgb(37, 99, 235)" }}>
          <FontsIcon size={20} />
        </span>
        <h2 className="text-sm font-semibold text-gray-900">Formatting</h2>
      </div>

      {/* Controls */}
      <div className="px-5 py-4">
        <FontSelect
          label="Primary Font (Headings)"
          value={styleSettings.primaryFont}
          onChange={(v) => updateStyle("primaryFont", v)}
        />

        <FontSelect
          label="Secondary Font (Body)"
          value={styleSettings.secondaryFont}
          onChange={(v) => updateStyle("secondaryFont", v)}
        />

        <StepperControl
          label={styleControls.headingSize.label}
          value={styleSettings.headingSize}
          min={styleControls.headingSize.min}
          max={styleControls.headingSize.max}
          step={styleControls.headingSize.step}
          unit={styleControls.headingSize.unit}
          onChange={(v) => updateStyle("headingSize", v)}
        />

        <StepperControl
          label={styleControls.bodySize.label}
          value={styleSettings.bodySize}
          min={styleControls.bodySize.min}
          max={styleControls.bodySize.max}
          step={styleControls.bodySize.step}
          unit={styleControls.bodySize.unit}
          onChange={(v) => updateStyle("bodySize", v)}
        />

        <StepperControl
          label={styleControls.lineSpacing.label}
          value={styleSettings.lineSpacing}
          min={styleControls.lineSpacing.min}
          max={styleControls.lineSpacing.max}
          step={styleControls.lineSpacing.step}
          unit={styleControls.lineSpacing.unit}
          onChange={(v) => updateStyle("lineSpacing", v)}
        />
      </div>
    </div>
  );
}
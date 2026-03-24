"use client";

import { marginPresets, spacingControls } from "@/data/styleDefaults";
import StepperControl from "@/components/layout-style/StepperControl";
import { MarginsIcon } from "@/icons";

/* ─── Margin Preset Card ─────────────────────────── */

function MarginPresetCard({ preset, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(preset)}
      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
        isSelected
          ? "border-gray-900 bg-gray-50"
          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
      }`}
    >
      <div className="text-sm font-medium text-gray-800">{preset.label}</div>
      <div className="text-xs text-gray-500 mt-1">
        Top/Bottom: {preset.topBottom}mm &nbsp;·&nbsp; Left/Right: {preset.leftRight}mm
      </div>
    </button>
  );
}

/* ─── Custom Margin Steppers ─────────────────────── */

function CustomMarginControls({ marginTopBottom, marginLeftRight, updateStyle }) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
            Spacing
        </p>
      <StepperControl
        label="Top & Bottom"
        value={marginTopBottom}
        min={5}
        max={50}
        step={1}
        unit="mm"
        onChange={(v) => {
          updateStyle("marginTopBottom", v);
          updateStyle("marginPreset", "custom");
        }}
      />
      <StepperControl
        label="Left & Right"
        value={marginLeftRight}
        min={5}
        max={60}
        step={1}
        unit="mm"
        onChange={(v) => {
          updateStyle("marginLeftRight", v);
          updateStyle("marginPreset", "custom");
        }}
      />
    </div>
  );
}

/* ─── Main Component ─────────────────────────────── */

export default function MarginsSpacingSection({ styleSettings, updateStyle }) {
  const handlePresetSelect = (preset) => {
    updateStyle("marginPreset", preset.id);
    updateStyle("marginTopBottom", preset.topBottom);
    updateStyle("marginLeftRight", preset.leftRight);
  };

  return (
    <div className="mx-4 mt-4 mb-4 bg-white border border-gray-200 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <span style={{ color: "rgb(37, 99, 235)" }}>
          <MarginsIcon size={20} />
        </span>
        <h2 className="text-sm font-semibold text-gray-900">Margins & Spacing</h2>
      </div>

      <div className="px-5 py-4">
        {/* Margin Presets */}
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          Page Margins
        </p>
        <div className="flex flex-col gap-2 mb-4">
          {marginPresets.map((preset) => (
            <MarginPresetCard
              key={preset.id}
              preset={preset}
              isSelected={styleSettings.marginPreset === preset.id}
              onSelect={handlePresetSelect}
            />
          ))}
        </div>

        {/* Custom Margin Controls */}
        <CustomMarginControls
          marginTopBottom={styleSettings.marginTopBottom}
          marginLeftRight={styleSettings.marginLeftRight}
          updateStyle={updateStyle}
        />

        <div className="mt-4">

          <StepperControl
            label={spacingControls.betweenSections.label}
            value={styleSettings.betweenSections}
            min={spacingControls.betweenSections.min}
            max={spacingControls.betweenSections.max}
            step={spacingControls.betweenSections.step}
            unit={spacingControls.betweenSections.unit}
            onChange={(v) => updateStyle("betweenSections", v)}
          />

          <StepperControl
            label={spacingControls.betweenTitleContent.label}
            value={styleSettings.betweenTitleContent}
            min={spacingControls.betweenTitleContent.min}
            max={spacingControls.betweenTitleContent.max}
            step={spacingControls.betweenTitleContent.step}
            unit={spacingControls.betweenTitleContent.unit}
            onChange={(v) => updateStyle("betweenTitleContent", v)}
          />

          <StepperControl
            label={spacingControls.betweenContentBlocks.label}
            value={styleSettings.betweenContentBlocks}
            min={spacingControls.betweenContentBlocks.min}
            max={spacingControls.betweenContentBlocks.max}
            step={spacingControls.betweenContentBlocks.step}
            unit={spacingControls.betweenContentBlocks.unit}
            onChange={(v) => updateStyle("betweenContentBlocks", v)}
          />
        </div>

        {/* Page Break Behavior */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Page Breaks
          </p>
          <label className="flex items-center justify-between gap-3 cursor-pointer rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50">
            <div>
              <span className="text-sm font-medium text-gray-800">Keep items together</span>
              <p className="text-xs text-gray-500 mt-0.5">
                {styleSettings.keepItemsTogether
                  ? "Entire entries stay on the same page"
                  : "Bullet points can flow across pages"
                }
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={styleSettings.keepItemsTogether}
              onClick={() => updateStyle("keepItemsTogether", !styleSettings.keepItemsTogether)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
                styleSettings.keepItemsTogether ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  styleSettings.keepItemsTogether ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}
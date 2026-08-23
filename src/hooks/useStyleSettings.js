"use client";

import { useCallback, useMemo } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { defaultStyleSettings } from "@/data/styleDefaults";

// A resume saved before a style option existed has no key for it, and a
// section added later is missing from its stored order. Reconciling on read
// means the builder always works with a complete settings object, so a new
// option cannot accept input in the panel and then render nowhere.
// Lato was dropped because its Google build has no ğ, İ or ş at all, so a
// Turkish name could not be set in it. Resumes already saved with it are moved
// to the font that replaced it rather than silently falling back to Inter.
const RETIRED_FONTS = { Lato: "Montserrat" };

function withDefaults(stored) {
  if (!stored) return defaultStyleSettings;

  const merged = { ...defaultStyleSettings, ...stored };

  for (const key of ["primaryFont", "secondaryFont"]) {
    if (RETIRED_FONTS[merged[key]]) merged[key] = RETIRED_FONTS[merged[key]];
  }

  // Keep the order the user chose, drop sections that no longer exist, and
  // append anything new at the end rather than silently losing it.
  const known = new Set(defaultStyleSettings.sectionOrder);
  const chosen = Array.isArray(stored.sectionOrder) ? stored.sectionOrder : [];
  const kept = chosen.filter((id) => known.has(id));
  const missing = defaultStyleSettings.sectionOrder.filter((id) => !kept.includes(id));

  merged.sectionOrder = [...kept, ...missing];

  return merged;
}

export default function useStyleSettings(resumeId) {
  const storageKey = resumeId ? `cv-${resumeId}-styleSettings` : "cv-builder-styleSettings";
  const [stored, setStyleSettings] = useLocalStorage(storageKey, defaultStyleSettings);

  const styleSettings = useMemo(() => withDefaults(stored), [stored]);

  const updateStyle = useCallback(
    (key, value) => {
      setStyleSettings((prev) => ({ ...prev, [key]: value }));
    },
    [setStyleSettings]
  );

  const reorderSections = useCallback(
    (newOrder) => {
      setStyleSettings((prev) => ({ ...prev, sectionOrder: newOrder }));
    },
    [setStyleSettings]
  );

  const resetStyles = useCallback(() => {
    setStyleSettings(defaultStyleSettings);
  }, [setStyleSettings]);

  return { styleSettings, updateStyle, reorderSections, resetStyles };
}

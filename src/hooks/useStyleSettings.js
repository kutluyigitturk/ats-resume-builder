"use client";

import { useCallback } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { defaultStyleSettings } from "@/data/styleDefaults";

export default function useStyleSettings(resumeId) {
  const storageKey = resumeId ? `cv-${resumeId}-styleSettings` : "cv-builder-styleSettings";
  const [styleSettings, setStyleSettings] = useLocalStorage(
    storageKey,
    defaultStyleSettings
  );

  const updateStyle = useCallback((key, value) => {
    setStyleSettings((prev) => ({ ...prev, [key]: value }));
  }, [setStyleSettings]);

  const reorderSections = useCallback((newOrder) => {
    setStyleSettings((prev) => ({ ...prev, sectionOrder: newOrder }));
  }, [setStyleSettings]);

  const resetStyles = useCallback(() => {
    setStyleSettings(defaultStyleSettings);
  }, [setStyleSettings]);

  return { styleSettings, updateStyle, reorderSections, resetStyles };
}
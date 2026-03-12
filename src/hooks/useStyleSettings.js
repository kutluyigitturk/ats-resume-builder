"use client";

import { useState, useCallback } from "react";
import { defaultStyleSettings } from "@/data/styleDefaults";

export default function useStyleSettings() {
  const [styleSettings, setStyleSettings] = useState(defaultStyleSettings);

  const updateStyle = useCallback((key, value) => {
    setStyleSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reorderSections = useCallback((newOrder) => {
    setStyleSettings((prev) => ({ ...prev, sectionOrder: newOrder }));
  }, []);

  const resetStyles = useCallback(() => {
    setStyleSettings(defaultStyleSettings);
  }, []);

  return { styleSettings, updateStyle, reorderSections, resetStyles };
}
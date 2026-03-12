"use client";

import { useState, useCallback } from "react";
import { defaultStyleSettings } from "@/data/styleDefaults";

export default function useStyleSettings() {
  const [styleSettings, setStyleSettings] = useState(defaultStyleSettings);

  const updateStyle = useCallback((key, value) => {
    setStyleSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetStyles = useCallback(() => {
    setStyleSettings(defaultStyleSettings);
  }, []);

  return { styleSettings, updateStyle, resetStyles };
}
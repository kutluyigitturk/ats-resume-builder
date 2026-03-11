"use client";

import { useState, useCallback, useEffect } from "react";
import { PANEL_MIN_FRACTION, PANEL_MAX_FRACTION, PANEL_DEFAULT_WIDTH } from "@/lib/constants";

export default function useResizablePanel() {
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);

  // Enforce min/max on initial load and window resize
  useEffect(() => {
    const clamp = () => {
      const minWidth = window.innerWidth * PANEL_MIN_FRACTION;
      const maxWidth = window.innerWidth * PANEL_MAX_FRACTION;
      setPanelWidth((prev) => Math.min(Math.max(prev, minWidth), maxWidth));
    };
    requestAnimationFrame(clamp);
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const minWidth = window.innerWidth * PANEL_MIN_FRACTION;
      const maxWidth = window.innerWidth * PANEL_MAX_FRACTION;
      const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  return { panelWidth, handleMouseDown };
}
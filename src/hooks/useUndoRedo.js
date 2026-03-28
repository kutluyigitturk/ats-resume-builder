"use client";

import { useRef, useCallback, useEffect, useState } from "react";

const MAX_HISTORY = 50;
const DEBOUNCE_MS = 500;

export default function useUndoRedo(cv, setCv) {
  const history = useRef([]);
  const pointer = useRef(-1);
  const isUndoRedo = useRef(false);
  const debounceTimer = useRef(null);
  const lastSnapshot = useRef(null);

  // Flash states for button visual feedback
  const [undoFlash, setUndoFlash] = useState(false);
  const [redoFlash, setRedoFlash] = useState(false);

  // Track history length for reactivity
  const [historyInfo, setHistoryInfo] = useState({ canUndo: false, canRedo: false });

  const updateInfo = useCallback(() => {
    setHistoryInfo({
      canUndo: pointer.current > 0,
      canRedo: pointer.current < history.current.length - 1,
    });
  }, []);

  // Initialize with first snapshot
  useEffect(() => {
    if (cv && history.current.length === 0) {
      const snapshot = JSON.stringify(cv);
      history.current = [snapshot];
      pointer.current = 0;
      lastSnapshot.current = snapshot;
      updateInfo();
    }
  }, [cv, updateInfo]);

  // Track changes with debounce
  useEffect(() => {
    if (!cv || isUndoRedo.current) {
      isUndoRedo.current = false;
      return;
    }

    const currentSnapshot = JSON.stringify(cv);

    // Skip if nothing actually changed
    if (currentSnapshot === lastSnapshot.current) return;

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      // Trim any future states if we're not at the end
      if (pointer.current < history.current.length - 1) {
        history.current = history.current.slice(0, pointer.current + 1);
      }

      // Push new state
      history.current.push(currentSnapshot);

      // Limit history size
      if (history.current.length > MAX_HISTORY) {
        history.current = history.current.slice(-MAX_HISTORY);
      }

      pointer.current = history.current.length - 1;
      lastSnapshot.current = currentSnapshot;
      updateInfo();
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceTimer.current);
  }, [cv, updateInfo]);

  const undo = useCallback(() => {
    if (pointer.current <= 0) return;

    // Flush any pending debounce first
    clearTimeout(debounceTimer.current);
    const currentSnapshot = JSON.stringify(cv);
    if (currentSnapshot !== lastSnapshot.current) {
      if (pointer.current < history.current.length - 1) {
        history.current = history.current.slice(0, pointer.current + 1);
      }
      history.current.push(currentSnapshot);
      if (history.current.length > MAX_HISTORY) {
        history.current = history.current.slice(-MAX_HISTORY);
      }
      pointer.current = history.current.length - 1;
    }

    pointer.current -= 1;
    const previous = JSON.parse(history.current[pointer.current]);
    lastSnapshot.current = history.current[pointer.current];
    isUndoRedo.current = true;
    setCv(previous);
    updateInfo();

    // Button flash
    setUndoFlash(true);
    setTimeout(() => setUndoFlash(false), 150);
  }, [cv, setCv, updateInfo]);

  const redo = useCallback(() => {
    if (pointer.current >= history.current.length - 1) return;

    pointer.current += 1;
    const next = JSON.parse(history.current[pointer.current]);
    lastSnapshot.current = history.current[pointer.current];
    isUndoRedo.current = true;
    setCv(next);
    updateInfo();

    // Button flash
    setRedoFlash(true);
    setTimeout(() => setRedoFlash(false), 150);
  }, [setCv, updateInfo]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (modifier && e.key === "y") ||
        (modifier && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return {
    undo,
    redo,
    canUndo: historyInfo.canUndo,
    canRedo: historyInfo.canRedo,
    undoFlash,
    redoFlash,
  };
}
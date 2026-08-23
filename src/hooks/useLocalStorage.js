"use client";

import { useState, useEffect, useRef } from "react";

const DEBOUNCE_MS = 500;

// Safely read from localStorage
function readFromStorage(key) {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// Safely write to localStorage
function writeToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save to localStorage [${key}]:`, error);
  }
}

// Generic hook: syncs React state with localStorage
// Uses fallback for SSR/first render, loads from storage after mount
export default function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(fallback);
  const [hydrated, setHydrated] = useState(false);
  const timeoutRef = useRef(null);
  const pendingRef = useRef(null);

  // Load from localStorage after mount (avoids hydration mismatch).
  // `hydrated` is returned as well: until it flips, `value` is still the
  // fallback, and a caller that treats that as real data - useUndoRedo did -
  // will act on an empty document the user never saw.
  useEffect(() => {
    const stored = readFromStorage(key);
    if (stored !== null) {
      setValue(stored);
    }
    setHydrated(true);
  }, [key]);

  // Debounced write to localStorage on value change (only after hydration)
  useEffect(() => {
    if (!hydrated) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      writeToStorage(key, value);
      pendingRef.current = null;
    }, DEBOUNCE_MS);

    // What the debounce still owes storage, kept somewhere the unload
    // listener can reach without being torn down and rebuilt on every
    // keystroke.
    pendingRef.current = { key, value };

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [key, value, hydrated]);

  // A half-second debounce means closing the tab mid-sentence loses the
  // sentence. Both events are needed: pagehide is the one that fires reliably
  // when a mobile browser discards the tab, visibilitychange catches the
  // switch away that precedes it.
  useEffect(() => {
    function persistPending() {
      if (!pendingRef.current) return;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      writeToStorage(pendingRef.current.key, pendingRef.current.value);
      pendingRef.current = null;
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") persistPending();
    }

    window.addEventListener("pagehide", persistPending);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", persistPending);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return [value, setValue, hydrated];
}

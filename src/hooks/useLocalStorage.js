"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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

  // Load from localStorage after mount (avoids hydration mismatch)
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
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [key, value, hydrated]);

  // Flush: immediately save without waiting for debounce
  const flush = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    writeToStorage(key, value);
  }, [key, value]);

  return [value, setValue, flush];
}
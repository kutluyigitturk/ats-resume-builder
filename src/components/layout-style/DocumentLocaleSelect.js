"use client";

import { useState, useRef, useEffect } from "react";
import { documentLocales } from "@/data/styleDefaults";
import { GlobeIcon } from "@/icons";

// The resume's own language, not the interface's. It is here beside the fonts
// rather than in a global menu because it belongs to this document: the same
// person may keep an English resume and a Turkish one, and each has to case its
// own name correctly.
export default function DocumentLocaleSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = documentLocales.find((l) => l.id === value) || documentLocales[0];

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="mb-5" ref={containerRef}>
      <label className="mb-2 block text-sm font-medium text-gray-700">Document Language</label>

      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
            isOpen ? "border-gray-900 bg-white" : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <span className="text-gray-700">{selected.label}</span>
          <span className="text-gray-400">
            <GlobeIcon />
          </span>
        </button>

        {isOpen && (
          <ul
            role="listbox"
            className="absolute z-30 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg"
          >
            {documentLocales.map((locale) => (
              <li key={locale.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={locale.id === value}
                  onClick={() => {
                    onChange(locale.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    locale.id === value
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {locale.label}
                    {locale.id === value && (
                      <svg
                        className="h-4 w-4 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Says what it actually does, because "language" invites the assumption
          that it translates the headings - which it does not, yet. */}
      <p className="mt-2 text-xs text-gray-500">
        Sets how your name is capitalised and tags the exported file. Section headings stay in
        English for now.
      </p>
    </div>
  );
}

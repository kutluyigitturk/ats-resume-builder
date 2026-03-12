"use client";

import { useState, useRef, useEffect } from "react";
import { fontOptions } from "@/data/styleDefaults";
import { FontsIcon } from "@/icons";

export default function FontSelect({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedFont = fontOptions.find((f) => f.name === value) || fontOptions[0];

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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-md text-sm text-left transition-colors ${
            isOpen
              ? "bg-white border-gray-900"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
        >
          <span className="text-gray-700" style={{ fontFamily: selectedFont.family }}>
            {selectedFont.name}
          </span>

          <span className="text-gray-400">
            <FontsIcon />
          </span>
        </button>

        {isOpen && (
          <ul className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {fontOptions.map((font) => (
              <li key={font.name}>
                <button
                  onClick={() => {
                    onChange(font.name);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    font.name === value
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ fontFamily: font.family }}
                >
                  <span className="flex items-center justify-between">
                    {font.name}
                    {font.name === value && (
                      <svg
                        className="w-4 h-4 text-blue-600"
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
    </div>
  );
}
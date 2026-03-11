"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/icons";

// Reusable accordion section with optional tips dropdown
export default function Section({ title, icon, isOpen, onToggle, tips, children }) {
  const [tipsOpen, setTipsOpen] = useState(false);

  return (
    <div className="mx-4 my-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-4 px-5 hover:bg-gray-50 text-left transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <span style={{ color: "rgb(37, 99, 235)" }}>{icon}</span>}
          <span className="font-semibold text-gray-900 text-sm">{title}</span>
        </div>
        <span className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDownIcon />
        </span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 border-t border-gray-100">
          {/* Tips and Recommendations */}
          {tips && (
            <div className="mt-4 mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setTipsOpen(!tipsOpen)}
                className="w-full flex justify-between items-center px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">Tips and Recommendations</span>
                <span className={`text-gray-400 transition-transform duration-200 ${tipsOpen ? "rotate-180" : ""}`}>
                  <ChevronDownIcon size={16} />
                </span>
              </button>
              {tipsOpen && (
                <div className="px-4 pb-3 border-t border-gray-100">
                  <ul className="mt-2 space-y-1.5">
                    {tips.map((tip, i) => (
                      <li key={i} className="text-xs text-gray-600 flex gap-2">
                        <span className="text-gray-400">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
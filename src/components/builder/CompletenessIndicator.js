"use client";

import { useState, useMemo } from "react";
import { calculateCompleteness, getCompletionTip } from "@/lib/completeness";

// Circular progress ring SVG
function CircularProgress({ score, size = 36, strokeWidth = 3 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Color based on score
  const getColor = () => {
    if (score >= 80) return "#22c55e";
    if (score >= 50) return "#3b82f6";
    if (score >= 25) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={getColor()}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
      />
    </svg>
  );
}

// Check icon for completed sections
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// Circle icon for incomplete sections
function CircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export default function CompletenessIndicator({ cv }) {
  const [expanded, setExpanded] = useState(false);

  const { score, sections } = useMemo(
    () => calculateCompleteness(cv),
    [cv]
  );

  const tip = useMemo(() => getCompletionTip(sections), [sections]);

  return (
    <div className="relative">
      {/* Circular trigger button */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
        title="Resume completeness"
        style={{ width: "36px", height: "36px" }}
      >
        <CircularProgress score={score} />
        <span
          className="absolute inset-0 flex items-center justify-center text-slate-700"
          style={{ fontSize: "9px", fontWeight: 700 }}
        >
          {score}%
        </span>
      </button>

      {/* Expandable panel */}
      <div
        className="completeness-panel"
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          width: "280px",
          zIndex: 50,
          transformOrigin: "top right",
          pointerEvents: expanded ? "auto" : "none",
        }}
      >
        <div
          className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ${
            expanded ? "completeness-enter" : "completeness-exit"
          }`}
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">
                Profile completeness
              </span>
              <span
                className="text-xs font-bold"
                style={{
                  color:
                    score >= 80
                      ? "#22c55e"
                      : score >= 50
                      ? "#3b82f6"
                      : score >= 25
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              >
                {score}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${score}%`,
                  backgroundColor:
                    score >= 80
                      ? "#22c55e"
                      : score >= 50
                      ? "#3b82f6"
                      : score >= 25
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              />
            </div>

            {/* Tip */}
            <p className="mt-2 text-slate-400" style={{ fontSize: "11px", lineHeight: "1.4" }}>
              {tip}
            </p>
          </div>

          {/* Section checklist */}
          <div className="border-t border-slate-100 px-4 py-3 space-y-2">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center gap-2.5">
                {section.complete ? <CheckIcon /> : <CircleIcon />}
                <span
                  className={`text-xs ${
                    section.complete
                      ? "text-slate-400 line-through"
                      : "text-slate-600"
                  }`}
                >
                  {section.label}
                </span>
                {!section.complete && section.ratio > 0 && (
                  <span
                    className="ml-auto rounded-full bg-amber-50 px-1.5 py-0.5 text-amber-600"
                    style={{ fontSize: "9px", fontWeight: 600 }}
                  >
                    Partial
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Click-outside overlay */}
      {expanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setExpanded(false)}
        />
      )}
    </div>
  );
}
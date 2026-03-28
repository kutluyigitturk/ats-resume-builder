"use client";

import { useMemo } from "react";
import { calculateCompleteness } from "@/lib/completeness";

function CircularProgress({ score, size = 36, strokeWidth = 3 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

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

export default function CompletenessIndicator({ cv, onToggle }) {
  const { score } = useMemo(() => calculateCompleteness(cv), [cv]);

  return (
    <button
      onClick={onToggle}
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
  );
}
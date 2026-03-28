"use client";

import { useMemo } from "react";
import { calculateCompleteness, getCompletionTip } from "@/lib/completeness";
import { ResumeAnalysisIcon } from "@/icons";

function SectionRow({ section }) {
  const pct = Math.round(section.ratio * 100);

  const getColor = () => {
    if (pct >= 100) return "#22c55e";
    if (pct >= 40) return "#f59e0b";
    if (pct > 0) return "#ef4444";
    return "#cbd5e1";
  };

  const getBadge = () => {
    if (pct >= 100) return null;
    if (pct > 0) return { text: `${pct}%`, bg: "#fef3c7", color: "#92400e" };
    return { text: "Missing", bg: "#fee2e2", color: "#991b1b" };
  };

  const color = getColor();
  const badge = getBadge();

  return (
    <div style={{ marginBottom: "8px" }}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          {pct >= 100 ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: "13px", height: "13px", border: `2px solid ${color}` }}
            >
              {pct > 0 && (
                <div className="rounded-full" style={{ width: "5px", height: "5px", backgroundColor: color }} />
              )}
            </div>
          )}
          <span
            className={pct >= 100 ? "line-through" : ""}
            style={{ fontSize: "11px", color: pct >= 100 ? "#94a3b8" : "#475569" }}
          >
            {section.label}
          </span>
        </div>
        {badge && (
          <span
            className="rounded"
            style={{
              fontSize: "9px",
              fontWeight: 600,
              padding: "1px 6px",
              backgroundColor: badge.bg,
              color: badge.color,
            }}
          >
            {badge.text}
          </span>
        )}
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: "3px", backgroundColor: "#f1f5f9" }}>
        <div
          className="rounded-full"
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: color,
            transition: "width 0.5s ease, background-color 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function CompletenessPanel({ cv, isOpen }) {
  const { score, sections } = useMemo(() => calculateCompleteness(cv), [cv]);
  const tip = useMemo(() => getCompletionTip(sections), [sections]);

  const essentialIds = ["personal", "summary", "experience", "education", "skills"];
  const essential = sections.filter((s) => essentialIds.includes(s.id));
  const optional = sections.filter((s) => !essentialIds.includes(s.id));

  return (
    <div
      className={`completeness-card-wrapper ${isOpen ? "completeness-card-open" : "completeness-card-closed"}`}
    >
      <section
        className="mx-3 overflow-hidden rounded-[18px] bg-white transition-all duration-500"
        style={{
          border: `1px solid ${
            score === 0
              ? "#e2e8f0"
              : score >= 80
              ? "#bbf7d0"
              : score >= 50
              ? "#bfdbfe"
              : score >= 25
              ? "#fde68a"
              : "#fecaca"
          }`,
          boxShadow:
            score === 0
              ? "0 1px 2px rgba(15,23,42,0.05)"
              : score >= 80
              ? "inset 0 2px 0 rgba(34,197,94,0.85), 0 10px 24px rgba(34,197,94,0.06)"
              : score >= 50
              ? "inset 0 2px 0 rgba(59,130,246,0.85), 0 10px 24px rgba(37,99,235,0.06)"
              : score >= 25
              ? "inset 0 2px 0 rgba(245,158,11,0.85), 0 10px 24px rgba(245,158,11,0.06)"
              : "inset 0 2px 0 rgba(239,68,68,0.85), 0 10px 24px rgba(239,68,68,0.06)",
        }}
      >
        {/* Header */}
        <div className="flex w-full items-center justify-between px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex shrink-0 items-center justify-center text-blue-600">
              <ResumeAnalysisIcon size={20} />
            </span>
            <span className="truncate text-[15px] font-semibold tracking-[-0.01em] text-slate-900">
              Resume Analysis
            </span>
          </div>
          <span
            className="text-lg font-bold"
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

        {/* Content */}
        <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-3">
          {/* Progress bar + tip */}
          <div className="mb-3">
            <div className="rounded-full overflow-hidden" style={{ height: "6px", backgroundColor: "#f1f5f9" }}>
              <div
                className="rounded-full"
                style={{
                  height: "100%",
                  width: `${score}%`,
                  backgroundColor:
                    score >= 80
                      ? "#22c55e"
                      : score >= 50
                      ? "#3b82f6"
                      : score >= 25
                      ? "#f59e0b"
                      : "#ef4444",
                  transition: "width 0.7s ease",
                }}
              />
            </div>

            <div
              className="flex items-start gap-1.5 mt-2.5 rounded-lg"
              style={{ backgroundColor: "#f8fafc", padding: "7px 9px" }}
            >
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="shrink-0" style={{ marginTop: "1px" }}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span style={{ fontSize: "11px", color: "#64748b", lineHeight: "1.4" }}>
                {tip}
              </span>
            </div>
          </div>

          {/* Essential */}
          <div className="mb-3">
            <span
              className="block mb-2"
              style={{ fontSize: "10px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}
            >
              Essential
            </span>
            {essential.map((s) => (
              <SectionRow key={s.id} section={s} />
            ))}
          </div>

          {/* Optional */}
          <div className="mb-3 pt-2 border-t border-slate-100">
            <span
              className="block mb-2"
              style={{ fontSize: "10px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}
            >
              Optional
            </span>
            {optional.map((s) => (
              <SectionRow key={s.id} section={s} />
            ))}
          </div>

          {/* Job match — coming soon */}
          <div className="pt-2 border-t border-slate-100">
            <div
              className="rounded-lg border border-dashed border-slate-200 p-3 text-center"
              style={{ backgroundColor: "#fafafa" }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>
                  Job match score
                </span>
                <span
                  className="rounded-full"
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    padding: "1px 6px",
                    backgroundColor: "#f0f7ff",
                    color: "#3b82f6",
                  }}
                >
                  Soon
                </span>
              </div>
              <p style={{ fontSize: "10px", color: "#94a3b8", lineHeight: "1.4" }}>
                Paste a job description to see how well your resume matches
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, PencilIcon } from "@/icons";

export default function Section({ title, icon, isOpen, onToggle, onTitleChange, tips, children }) {
  const [tipsOpen, setTipsOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditValue(title);
  }, [title]);

  useEffect(() => {
    if (editingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTitle]);

  const startEditing = (e) => {
    e.stopPropagation();
    setEditValue(title);
    setEditingTitle(true);
  };

  const saveTitle = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== title && onTitleChange) {
      onTitleChange(trimmed);
    }
    setEditingTitle(false);
  };

  return (
    <section
      className={`overflow-hidden rounded-[18px] border bg-white transition-all duration-200 ${
        isOpen
          ? "border-blue-200 shadow-[inset_0_2px_0_rgba(59,130,246,0.85),0_10px_24px_rgba(37,99,235,0.06)]"
          : "border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.05)]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`group flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors ${
          isOpen ? "bg-blue-50/[0.35]" : "hover:bg-slate-50/80"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {icon && <span className="flex shrink-0 items-center justify-center text-blue-600">{icon}</span>}

          {editingTitle ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") setEditingTitle(false);
              }}
              onClick={(e) => e.stopPropagation()}
              className="min-w-0 border-b border-slate-300 bg-transparent text-[15px] font-semibold tracking-[-0.01em] text-slate-900 outline-none"
            />
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="truncate text-[15px] font-semibold tracking-[-0.01em] text-slate-900">
                {title}
              </span>
              {onTitleChange && (
                <span
                  onClick={startEditing}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100 cursor-pointer"
                >
                  <PencilIcon size={11} />
                </span>
              )}
            </span>
          )}
        </div>

        <span
          className={`shrink-0 transition-all duration-200 ${
            isOpen ? "rotate-180 text-blue-500" : "text-slate-400"
          }`}
        >
          <ChevronDownIcon size={17} />
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-3">
          {tips && (
            <div className="mb-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setTipsOpen((prev) => !prev)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-xs font-medium text-slate-700">
                  Tips and Recommendations
                </span>

                <span
                  className={`text-slate-400 transition-transform duration-200 ${
                    tipsOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDownIcon size={15} />
                </span>
              </button>

              {tipsOpen && (
                <div className="px-4 pb-3 space-y-1">
                  {tips.map((tip, index) => (
                    <div key={index} className="text-xs leading-snug text-slate-600">
                      • {tip}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {children}
        </div>
      )}
    </section>
  );
}
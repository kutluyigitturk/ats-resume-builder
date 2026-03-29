"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDownIcon, PencilIcon } from "@/icons";

export default function Section({ title, icon, isOpen, onToggle, onTitleChange, tips, children }) {
  const [tipsOpen, setTipsOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [pencilOpacity, setPencilOpacity] = useState(0);
  const inputRef = useRef(null);
  const pencilRef = useRef(null);
  const headerRef = useRef(null);

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

  const handleMouseMove = useCallback((e) => {
    if (!pencilRef.current || !onTitleChange || editingTitle) return;

    const pencilRect = pencilRef.current.getBoundingClientRect();
    const pencilCenterX = pencilRect.left + pencilRect.width / 2;
    const pencilCenterY = pencilRect.top + pencilRect.height / 2;

    const dx = e.clientX - pencilCenterX;
    const dy = e.clientY - pencilCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = 250;
    const minOpacity = 0.08;
    const maxOpacity = 1;

    if (distance >= maxDistance) {
      setPencilOpacity(minOpacity);
    } else {
      const ratio = 1 - distance / maxDistance;
      const raw = minOpacity + ratio * (maxOpacity - minOpacity);
      const stepped = Math.round(raw * 10) / 10;
      setPencilOpacity(stepped);
    }
  }, [onTitleChange, editingTitle]);

  const handleMouseLeave = useCallback(() => {
    setPencilOpacity(0);
  }, []);

  return (
    <section
      className={`overflow-hidden rounded-[18px] border bg-white transition-all duration-200 ${
        isOpen
          ? "border-blue-200 shadow-[inset_0_2px_0_rgba(59,130,246,0.85),0_10px_24px_rgba(37,99,235,0.06)]"
          : "border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.05)]"
      }`}
    >
      <div
        ref={headerRef}
        role="button"
        tabIndex={0}
        onClick={() => { if (!editingTitle) onToggle(); }}
        onKeyDown={(e) => { if (!editingTitle && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onToggle(); } }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left transition-colors ${
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
                e.stopPropagation();
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") setEditingTitle(false);
              }}
              onClick={(e) => e.stopPropagation()}
              className="min-w-0 bg-transparent text-[15px] font-semibold tracking-[-0.01em] text-slate-900 outline-none"
            />
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="truncate text-[15px] font-semibold tracking-[-0.01em] text-slate-900">
                {title}
              </span>
              {onTitleChange && (
                <span
                    ref={pencilRef}
                    onClick={startEditing}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md cursor-pointer transition-colors text-slate-400 hover:text-slate-700 active:text-slate-900"
                    style={{
                      opacity: pencilOpacity,
                      transition: "opacity 0.15s ease",
                    }}
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
      </div>

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
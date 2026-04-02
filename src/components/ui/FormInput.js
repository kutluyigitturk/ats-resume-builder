import { useState, useRef, useEffect, useCallback } from "react";
import { inputStyle, labelStyle } from "@/lib/constants";

// Standard labeled input field used across all form sections
export default function FormInput({ label, placeholder, value, onChange, className = "" }) {
  return (
    <div className={className}>
      <label className={labelStyle}>{label}</label>
      <input
        className={inputStyle}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// Standard labeled textarea field with auto-save indicator
export function FormTextarea({ label, placeholder, value, onChange, rows = "h-28", resizable = false, className = "" }) {
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | fading
  const saveTimer = useRef(null);
  const fadeTimer = useRef(null);

  const clearTimers = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    clearTimers();

    setSaveStatus("saving");

    saveTimer.current = setTimeout(() => {
      setSaveStatus("saved");

      fadeTimer.current = setTimeout(() => {
        setSaveStatus("fading");
        setTimeout(() => setSaveStatus("idle"), 400);
      }, 2000);
    }, 800);
  };

  const visible = saveStatus !== "idle";
  const isSaving = saveStatus === "saving";
  const isFading = saveStatus === "fading";

  return (
    <div className={className}>
      {label && <label className={labelStyle}>{label}</label>}
      <div className="relative">
        <style>{`
          @keyframes savingPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        `}</style>
        <textarea
          className={`${inputStyle} ${rows} ${resizable ? "resize-y overflow-hidden" : "resize-none"}`}
          placeholder={placeholder}
          value={value || ""}
          onChange={handleChange}
        />
        {visible && (
          <span
            className="absolute bottom-2 right-3 select-none pointer-events-none"
            style={{
              fontSize: "10px",
              letterSpacing: "0.01em",
              opacity: isFading ? 0 : 1,
              transition: "opacity 400ms ease-out",
            }}
          >
            {/* "Saving..." — crossfades out when saved */}
            <span
              className="italic text-slate-400"
              style={{
                position: "absolute",
                right: 0,
                whiteSpace: "nowrap",
                opacity: isSaving ? 1 : 0,
                transition: "opacity 300ms ease-in-out",
                animation: isSaving ? "savingPulse 1.2s ease-in-out infinite" : "none",
              }}
            >
              Saving...
            </span>
            {/* "Saved" — crossfades in when done */}
            <span
              className="italic text-slate-400"
              style={{
                whiteSpace: "nowrap",
                opacity: isSaving ? 0 : 1,
                transition: "opacity 300ms ease-in-out",
              }}
            >
              Saved
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
"use client";

import { labelStyle, inputStyle, ONGOING } from "@/lib/constants";
import { CalendarCheckIcon, CalendarXIcon } from "@/icons";

// Auto-formatting date input for MM/YYYY format
// Automatically inserts "/" after the month digits
export default function DateInput({
  label,
  placeholder = "MM/YYYY",
  value,
  onChange,
  ongoing = false,
}) {
  const isOngoing = value === ONGOING;

  const handleChange = (e) => {
    const raw = e.target.value;

    // Digits only. Letters are turned away rather than accepted and reformatted,
    // so the field never looks like it takes free text - the toggle beside it is
    // the way to say an entry has not ended.
    const cleaned = raw.replace(/[^0-9/]/g, "");

    // Remove any user-typed slashes to re-format cleanly
    const digits = cleaned.replace(/\//g, "");

    // Limit to 6 digits (MMYYYY)
    const limited = digits.slice(0, 6);

    // Auto-insert slash after 2 digits (MM/)
    let formatted;
    if (limited.length > 2) {
      formatted = limited.slice(0, 2) + "/" + limited.slice(2);
    } else {
      formatted = limited;
    }

    onChange(formatted);
  };

  return (
    <div>
      {label && <label className={labelStyle}>{label}</label>}

      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={isOngoing ? ONGOING : value}
          onChange={handleChange}
          // Read-only rather than disabled: the word stays legible and
          // selectable, and typing simply does nothing.
          readOnly={isOngoing}
          maxLength={7}
          // Only as much room as the icon needs. A labelled badge here ate
          // three quarters of the field - measured at 124px wide on a 13"
          // screen, it left 20px for the date itself.
          className={`${inputStyle} ${ongoing ? "pr-10" : ""}`}
        />

        {ongoing && (
          <button
            type="button"
            // A switch, not a checkbox: it turns one state into another rather
            // than adding an item to a set.
            role="switch"
            aria-checked={isOngoing}
            aria-label="Still ongoing"
            title={isOngoing ? "Still ongoing — click to set an end date" : "Mark as still ongoing"}
            onClick={() => onChange(isOngoing ? "" : ONGOING)}
            className={`absolute top-1/2 right-1.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded transition-colors ${
              isOngoing
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "border border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600"
            }`}
          >
            {isOngoing ? <CalendarCheckIcon /> : <CalendarXIcon />}
          </button>
        )}
      </div>
    </div>
  );
}

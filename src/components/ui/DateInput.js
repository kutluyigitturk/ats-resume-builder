"use client";

import { labelStyle, inputStyle, ONGOING } from "@/lib/constants";
import { CalendarCheckIcon, CalendarXIcon } from "@/icons";

// An entry that has not ended is written as a word, and which word is the
// user's business: the interface is in English but the resume very often is
// not. So the state is read off the content rather than compared against one
// blessed string - anything with a letter in it is a running entry, and the
// field stays as free as every other field in the form.
const hasLetter = (value) => /\p{L}/u.test(value ?? "");

// Auto-formatting date input for MM/YYYY format
// Automatically inserts "/" after the month digits
export default function DateInput({
  label,
  placeholder = "MM/YYYY",
  value,
  onChange,
  ongoing = false,
  ongoingLabel = ONGOING,
}) {
  const isOngoing = hasLetter(value);

  const handleChange = (e) => {
    const raw = e.target.value;

    // A word is passed through untouched. Only something the user is clearly
    // typing as a date gets the MM/YYYY treatment.
    if (hasLetter(raw)) {
      onChange(raw.slice(0, 24));
      return;
    }

    // Remove everything except digits and slash
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
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          maxLength={isOngoing ? 24 : 7}
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
            onClick={() => onChange(isOngoing ? "" : ongoingLabel)}
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

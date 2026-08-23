"use client";

import { useState } from "react";
import { labelStyle, inputStyle, ONGOING } from "@/lib/constants";
import { CalendarCheckIcon, CalendarXIcon } from "@/icons";

// An entry that has not ended is written as a word, and which word is the
// user's business: the interface is in English but the resume very often is
// not. So there is no blessed string to compare against - the field takes
// whatever they type.
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
  // Which of the two the field is taking is the badge's business, not the
  // content's. Deriving it from the text looked simpler until you tried to
  // replace "Present" with "Halen": the moment the last letter was deleted the
  // field turned back into a date and refused the first letter of the new word.
  //
  // The stored text still decides on arrival, so a resume saved with "Halen"
  // opens in word mode; after that only the badge changes it.
  const [wordMode, setWordMode] = useState(() => hasLetter(value));
  const isOngoing = wordMode || hasLetter(value);

  function toggle() {
    setWordMode(!isOngoing);
    onChange(isOngoing ? "" : ongoingLabel);
  }

  const handleChange = (e) => {
    const raw = e.target.value;

    // In word mode the field is free text - "Expected 2026" needs its digits
    // as much as "Halen" needs its letters.
    if (isOngoing) {
      onChange(raw.slice(0, 24));
      return;
    }

    // Otherwise only a date can be typed. Letters are dropped rather than
    // silently switching the mode behind the user's back.
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
          placeholder={isOngoing ? ongoingLabel : placeholder}
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
            onClick={toggle}
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

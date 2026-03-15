"use client";

import { labelStyle, inputStyle } from "@/lib/constants";

// Auto-formatting date input for MM/YYYY format
// Automatically inserts "/" after the month digits
export default function DateInput({ label, placeholder = "MM/YYYY", value, onChange }) {
  const handleChange = (e) => {
    let raw = e.target.value;

    // Remove everything except digits and slash
    raw = raw.replace(/[^0-9/]/g, "");

    // Remove any user-typed slashes to re-format cleanly
    const digits = raw.replace(/\//g, "");

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
      <input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        maxLength={7}
        className={inputStyle}
      />
    </div>
  );
}
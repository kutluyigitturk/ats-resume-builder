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

// Standard labeled textarea field
export function FormTextarea({ label, placeholder, value, onChange, rows = "h-28", resizable = false, className = "" }) {
  return (
    <div className={className}>
      {label && <label className={labelStyle}>{label}</label>}
      <textarea
        className={`${inputStyle} ${rows} ${resizable ? "resize-y overflow-hidden" : "resize-none"}`}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
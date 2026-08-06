"use client";

import { forwardRef } from "react";

const base =
  "h-[46px] w-full rounded-xl border bg-[#fbfbfa] px-3.5 text-[14.5px] text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-[3px]";
const normal = "border-[#d6d6d2] focus:border-blue-700 focus:ring-blue-700/15";
const invalid = "border-red-400 focus:border-red-500 focus:ring-red-500/15";

const AuthField = forwardRef(function AuthField(
  { id, label, error, className = "", ...props },
  ref
) {
  const errorId = `${id}-error`;

  return (
    <div className="mb-[15px]">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-slate-500">
        {label}
      </label>

      <input
        ref={ref}
        id={id}
        name={id}
        // Tells assistive technology the value was rejected, and points at the
        // message so it is announced together with the field.
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${base} ${error ? invalid : normal} ${className}`}
        {...props}
      />

      {/* Rendered next to the field it belongs to, as text - a red border on
          its own says something is wrong but never what. */}
      {error && (
        <p id={errorId} className="mt-1.5 text-[13px] text-red-700">
          {error}
        </p>
      )}
    </div>
  );
});

export default AuthField;

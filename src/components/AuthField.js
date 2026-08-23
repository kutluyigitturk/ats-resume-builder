"use client";

import { forwardRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/icons";

const base =
  "h-[46px] w-full rounded-xl border bg-[#fbfbfa] text-[14.5px] text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-[3px]";
const normal = "border-[#d6d6d2] focus:border-blue-700 focus:ring-blue-700/15";
const invalid = "border-red-400 focus:border-red-500 focus:ring-red-500/15";

const AuthField = forwardRef(function AuthField(
  { id, label, error, className = "", ...props },
  ref
) {
  const errorId = `${id}-error`;

  const [revealed, setRevealed] = useState(false);
  const isPassword = props.type === "password";

  // Revealing swaps the input type, which is the only thing that actually
  // shows the characters. Kept per field, so showing one password on a form
  // never uncovers another.
  const type = isPassword && revealed ? "text" : props.type;

  return (
    <div className="mb-[15px]">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-slate-500">
        {label}
      </label>

      <div className="relative">
        <input
          ref={ref}
          id={id}
          name={id}
          // Tells assistive technology the value was rejected, and points at the
          // message so it is announced together with the field.
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
          type={type}
          // Room for the toggle, so a long password never runs under it.
          className={`${base} ${error ? invalid : normal} ${isPassword ? "pr-11 pl-3.5" : "px-3.5"} ${className}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((shown) => !shown)}
            // The label carries the whole message: an eye on its own does not
            // say whether it will show or hide.
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            className="absolute top-1/2 right-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-blue-700/30 focus-visible:outline-none"
          >
            {revealed ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

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

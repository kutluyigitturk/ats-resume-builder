import { initialsOf, toneFor } from "@/lib/avatar";

// Display only. Nothing here is uploadable yet, and a circle that looks
// clickable but is not would be a promise the page cannot keep.
export default function Avatar({ name, email, size = 32, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none ${className}`}
      style={{
        width: size,
        height: size,
        background: toneFor(email),
        fontSize: Math.round(size * 0.4),
        letterSpacing: "0.01em",
      }}
    >
      {initialsOf(name, email)}
    </span>
  );
}

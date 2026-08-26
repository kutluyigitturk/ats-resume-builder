// Deep enough for white text to sit on comfortably, and close enough together
// that the set reads as one family instead of a random assortment.
const TONES = ["#0099f2", "#4338ca", "#0f766e", "#15803d", "#b45309", "#be123c", "#7e22ce"];

export function initialsOf(name, email) {
  const words = (name || "").trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  // Signup requires a name, but accounts predating that field only have an
  // address - and an empty circle would look like a loading state.
  return (email || "?").slice(0, 2).toUpperCase();
}

// Keyed on the address, not the name: renaming yourself should not change the
// colour you have learned to recognise.
export function toneFor(email) {
  let hash = 0;

  for (const char of email || "") {
    hash = (hash * 31 + char.charCodeAt(0)) % 100000;
  }

  return TONES[hash % TONES.length];
}

// One stored image serves every size. It is 3:4, and the circle shows its top
// square - which is where a portrait keeps the face, so no second crop and no
// second file are needed.
export default function Avatar({ name, email, size = 32, src = null, className = "" }) {
  const shared = `inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full select-none ${className}`;

  if (src) {
    return (
      <span aria-hidden="true" className={shared} style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image
            is unused across this app and would want a loader for a route that
            already returns exactly the bytes we stored. */}
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-cover object-top"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${shared} font-semibold text-white`}
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

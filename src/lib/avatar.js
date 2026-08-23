// The avatar is the same person in the menu and on the account page, so the
// initials and the colour are derived here rather than twice.

// Deep enough for white text to sit on comfortably, and close enough together
// that the set reads as one family instead of a random assortment.
const TONES = ["#1d4ed8", "#4338ca", "#0f766e", "#15803d", "#b45309", "#be123c", "#7e22ce"];

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

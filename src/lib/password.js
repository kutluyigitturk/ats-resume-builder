export const MIN_PASSWORD_LENGTH = 8;

// The passwords that actually show up first in a credential-stuffing list.
// This is not a strength meter and is not meant to be exhaustive - it only
// rejects the handful of choices that would be broken in seconds. Composition
// rules ("one capital, one symbol") are left out on purpose: they push people
// towards Password1! without making anything harder to guess.
const COMMON_PASSWORDS = new Set([
  "password",
  "password1",
  "password123",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty123",
  "qwertyuiop",
  "1q2w3e4r",
  "iloveyou",
  "admin123",
  "welcome1",
  "letmein1",
  "abc12345",
  "football",
  "baseball",
  "sunshine",
  "princess",
  "trustno1",
  "starwars",
  "asdfghjkl",
  "zxcvbnm123",
  "parola123",
  "sifre123",
]);

// Returns an error message, or null when the password is acceptable.
// The same function runs on the server and in the form, so the browser can
// never show a rule the server does not actually enforce.
export function checkPassword(password, email = "") {
  if (!password) {
    return "Choose a password.";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Choose a password with at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  const normalized = password.toLowerCase();

  if (COMMON_PASSWORDS.has(normalized)) {
    return "This password is one of the most guessed ones. Choose something else.";
  }

  // A password built from the address it protects is the first thing anyone
  // targeting this specific account would try.
  const localPart = email.split("@")[0].trim().toLowerCase();

  if (localPart.length >= 3 && normalized.includes(localPart)) {
    return "Your password should not contain your email address.";
  }

  // "aaaaaaaa" and "11111111" clear the length rule while carrying almost no
  // information at all.
  if (new Set(normalized).size <= 2) {
    return "Choose a password with more variety than a repeated character.";
  }

  return null;
}

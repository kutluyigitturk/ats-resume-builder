import { redirectIfAuthenticated } from "@/lib/session";

// Covers /login, /signup and /forgot-password. The parentheses keep the folder
// out of the URL, so these paths are unchanged - the group exists only to give
// the three pages one shared gate.
//
// /reset-password and /verify-email are deliberately outside it: both are
// reached from a link in an email, and a signed-in user following one still
// has a real reason to be there.
export default async function AuthLayout({ children }) {
  await redirectIfAuthenticated();

  return children;
}

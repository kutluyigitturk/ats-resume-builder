// Escapes special HTML characters to prevent XSS injection
// Used when inserting user input into the PDF HTML template

const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, (char) => escapeMap[char]);
}
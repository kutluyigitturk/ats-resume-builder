// Basic resume text parser
// Extracts structured data from pasted plain-text resumes.
// Designed for "üret" phase — covers the 80% case, not perfect.

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE = /(\+?\d[\d\s\-().]{7,}\d)/;
const LINKEDIN_RE = /linkedin\.com\/in\/[\w-]+/i;
const WEBSITE_RE = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?)/i;

/**
 * Parse raw resume text into a partial CV data object.
 * Returns only the fields it can confidently extract.
 */
export function parseResumeText(text) {
  if (!text || !text.trim()) return null;

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  // ── Extract contact info via patterns ──────────────
  const email = extractMatch(text, EMAIL_RE);
  const phone = extractMatch(text, PHONE_RE);
  const linkedin = extractMatch(text, LINKEDIN_RE);

  // First non-email, non-phone, non-url line is likely the name
  const name = lines.find(
    (line) =>
      line.length < 60 &&
      !EMAIL_RE.test(line) &&
      !PHONE_RE.test(line) &&
      !LINKEDIN_RE.test(line) &&
      !isSectionHeader(line)
  ) || "";

  // Second short line (after name) may be the title
  const nameIndex = lines.indexOf(name);
  const title = nameIndex >= 0 && nameIndex + 1 < lines.length
    ? lines.slice(nameIndex + 1, nameIndex + 3).find(
        (line) =>
          line.length < 80 &&
          !EMAIL_RE.test(line) &&
          !PHONE_RE.test(line) &&
          !isSectionHeader(line)
      ) || ""
    : "";

  // ── Split into sections ────────────────────────────
  const sections = splitIntoSections(lines);

  // ── Map sections to CV fields ──────────────────────
  const summary = findSection(sections, ["summary", "profile", "objective", "about", "özet", "profil"]);
  const experienceText = findSection(sections, ["experience", "work", "employment", "deneyim", "iş"]);
  const educationText = findSection(sections, ["education", "academic", "eğitim"]);
  const skillsText = findSection(sections, ["skills", "technical", "competencies", "beceri", "yetkinlik"]);

  // Build result
  const result = {
    name: cleanField(name),
    title: cleanField(title),
    email: email || "",
    phone: phone || "",
    linkedin: linkedin || "",
    website: "",
    summary: summary || buildFallbackSummary(lines, name, title),
    experiences: [],
    education: [],
    skills: skillsText ? parseSkillsBasic(skillsText) : [],
    projects: [],
    volunteering: [],
    certifications: [],
    languages: [],
    references: [],
  };

  return result;
}

// ─── Helpers ─────────────────────────────────────────

function extractMatch(text, regex) {
  const match = text.match(regex);
  return match ? match[0] : "";
}

function cleanField(str) {
  return (str || "").replace(/[|•·,]/g, "").trim();
}

const SECTION_KEYWORDS = [
  "summary", "profile", "objective", "about",
  "experience", "work", "employment",
  "education", "academic",
  "skills", "technical", "competencies",
  "projects", "certifications", "certificates",
  "languages", "volunteering", "volunteer",
  "references", "awards", "honors",
  // Turkish
  "özet", "profil", "deneyim", "iş", "eğitim",
  "beceri", "yetkinlik", "projeler", "sertifika",
  "diller", "gönüllülük", "referans",
];

function isSectionHeader(line) {
  const lower = line.toLowerCase().replace(/[:\-–—]/g, "").trim();
  if (lower.length > 40) return false;
  if (line === line.toUpperCase() && line.length > 2 && line.length < 40) return true;
  return SECTION_KEYWORDS.some((kw) => lower === kw || lower.startsWith(kw + " "));
}

function splitIntoSections(lines) {
  const sections = [];
  let current = { header: "", lines: [] };

  for (const line of lines) {
    if (isSectionHeader(line)) {
      if (current.header || current.lines.length) {
        sections.push(current);
      }
      current = { header: line.toLowerCase().replace(/[:\-–—]/g, "").trim(), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  if (current.header || current.lines.length) {
    sections.push(current);
  }

  return sections;
}

function findSection(sections, keywords) {
  const section = sections.find((s) =>
    keywords.some((kw) => s.header.includes(kw))
  );
  return section ? section.lines.join("\n").trim() : "";
}

function parseSkillsBasic(text) {
  // Try to detect "Category: items" pattern
  const lines = text.split("\n").filter(Boolean);
  const skills = [];
  let idCounter = 1;

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0 && colonIndex < 30) {
      skills.push({
        id: `parsed-skill-${idCounter++}`,
        category: line.slice(0, colonIndex).trim(),
        items: line.slice(colonIndex + 1).trim(),
      });
    }
  }

  // If no "category: items" pattern found, put everything in one
  if (skills.length === 0 && text.trim()) {
    skills.push({
      id: "parsed-skill-1",
      category: "Skills",
      items: text.replace(/\n/g, ", ").replace(/[•·\-]\s*/g, ""),
    });
  }

  return skills;
}

function buildFallbackSummary(lines, name, title) {
  // If we couldn't find a summary section, use first few content lines
  const contentLines = lines.filter(
    (l) => l !== name && l !== title && !EMAIL_RE.test(l) && !PHONE_RE.test(l) && !isSectionHeader(l)
  );
  return contentLines.slice(0, 4).join(" ").slice(0, 500);
}
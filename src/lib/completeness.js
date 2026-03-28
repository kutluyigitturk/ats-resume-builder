// CV completeness scoring engine
// Returns a score (0-100) and a list of section statuses

const SECTIONS = [
  {
    id: "personal",
    label: "Personal information",
    weight: 20,
    check: (cv) => {
      let filled = 0;
      let total = 3;
      if (cv.name?.trim()) filled++;
      if (cv.email?.trim()) filled++;
      if (cv.phone?.trim()) filled++;
      return filled / total;
    },
  },
  {
    id: "summary",
    label: "Professional summary",
    weight: 10,
    check: (cv) => (cv.summary?.trim().length >= 30 ? 1 : cv.summary?.trim() ? 0.5 : 0),
  },
  {
    id: "experience",
    label: "Work experience",
    weight: 25,
    check: (cv) => {
      const valid = (cv.experiences || []).filter(
        (e) => e.company?.trim() || e.position?.trim()
      );
      if (valid.length === 0) return 0;
      const hasBullets = valid.some(
        (e) => (e.bullets || []).some((b) => b?.trim())
      );
      return hasBullets ? 1 : 0.6;
    },
  },
  {
    id: "education",
    label: "Education",
    weight: 20,
    check: (cv) => {
      const valid = (cv.education || []).filter(
        (e) => e.school?.trim() || e.degree?.trim()
      );
      return valid.length > 0 ? 1 : 0;
    },
  },
  {
    id: "skills",
    label: "Technical skills",
    weight: 15,
    check: (cv) => {
      const valid = (cv.skills || []).filter(
        (s) => s.category?.trim() || s.items?.trim()
      );
      return valid.length > 0 ? 1 : 0;
    },
  },
  {
    id: "projects",
    label: "Projects",
    weight: 4,
    check: (cv) => {
      const valid = (cv.projects || []).filter((p) => p.name?.trim());
      return valid.length > 0 ? 1 : 0;
    },
  },
  {
    id: "languages",
    label: "Languages",
    weight: 3,
    check: (cv) => {
      const valid = (cv.languages || []).filter((l) => l.language?.trim());
      return valid.length > 0 ? 1 : 0;
    },
  },
  {
    id: "certifications",
    label: "Certifications",
    weight: 3,
    check: (cv) => {
      const valid = (cv.certifications || []).filter(
        (c) => c.name?.trim() || c.institution?.trim()
      );
      return valid.length > 0 ? 1 : 0;
    },
  },
];

export function calculateCompleteness(cv) {
  if (!cv) return { score: 0, sections: [] };

  const sections = SECTIONS.map((section) => {
    const ratio = section.check(cv);
    return {
      id: section.id,
      label: section.label,
      weight: section.weight,
      ratio: Math.min(1, Math.max(0, ratio)),
      complete: ratio >= 1,
    };
  });

  const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
  const weightedScore = sections.reduce(
    (sum, s) => sum + s.ratio * s.weight,
    0
  );
  const score = Math.round((weightedScore / totalWeight) * 100);

  return { score, sections };
}

export function getCompletionTip(sections) {
  const incomplete = sections.filter((s) => !s.complete);
  if (incomplete.length === 0) return "Your resume is complete!";

  // Prioritize high-weight incomplete sections
  const sorted = [...incomplete].sort((a, b) => b.weight - a.weight);
  const top = sorted[0];

  const tips = {
    personal: "Add your name, email and phone number",
    summary: "Write a professional summary (at least 2-3 sentences)",
    experience: "Add at least one work experience with bullet points",
    education: "Add your education background",
    skills: "List your technical skills",
    projects: "Add a project to showcase your work",
    languages: "Add languages you speak",
    certifications: "Add your certifications",
  };

  return tips[top.id] || "Keep filling in your resume";
}
// CV completeness scoring engine
// Returns a score (0-100) and a list of section statuses

const SECTIONS = [
  {
    id: "personal",
    label: "Personal information",
    weight: 20,
    check: (cv) => {
      let filled = 0;
      const total = 5;
      if (cv.name?.trim()) filled++;
      if (cv.email?.trim()) filled++;
      if (cv.phone?.trim()) filled++;
      if (cv.location?.trim()) filled++;
      if (cv.linkedin?.trim()) filled++;
      return filled / total;
    },
  },
  {
    id: "summary",
    label: "Professional summary",
    weight: 12,
    check: (cv) => {
      const len = cv.summary?.trim().length || 0;
      if (len >= 150) return 1;
      if (len >= 50) return 0.6;
      if (len > 0) return 0.3;
      return 0;
    },
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

      // Average quality across all experiences
      const scores = valid.map((e) => {
        let s = 0.3; // base: has company or position

        // Date fields filled
        if (e.startDate?.trim()) s += 0.1;
        if (e.endDate?.trim()) s += 0.1;

        // Bullet point quality
        const bullets = (e.bullets || []).filter((b) => b?.trim());
        if (bullets.length >= 3) s += 0.5;
        else if (bullets.length === 2) s += 0.35;
        else if (bullets.length === 1) s += 0.2;

        return Math.min(1, s);
      });

      return scores.reduce((sum, s) => sum + s, 0) / scores.length;
    },
  },
  {
    id: "education",
    label: "Education",
    weight: 18,
    check: (cv) => {
      const valid = (cv.education || []).filter(
        (e) => e.school?.trim() || e.degree?.trim()
      );
      if (valid.length === 0) return 0;

      const scores = valid.map((e) => {
        let s = 0;
        if (e.school?.trim()) s += 0.3;
        if (e.degree?.trim()) s += 0.3;
        if (e.startDate?.trim() || e.endDate?.trim()) s += 0.2;
        if (e.location?.trim()) s += 0.1;
        if (e.additionalInfo?.trim()) s += 0.1;
        return Math.min(1, s);
      });

      return scores.reduce((sum, s) => sum + s, 0) / scores.length;
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
      if (valid.length === 0) return 0;
      if (valid.length >= 3) return 1;
      if (valid.length === 2) return 0.7;
      return 0.4;
    },
  },
  {
    id: "projects",
    label: "Projects",
    weight: 5,
    check: (cv) => {
      const valid = (cv.projects || []).filter((p) => p.name?.trim());
      if (valid.length === 0) return 0;

      const hasBullets = valid.some(
        (p) => (p.bullets || []).some((b) => b?.trim())
      );
      return hasBullets ? 1 : 0.5;
    },
  },
  {
    id: "languages",
    label: "Languages",
    weight: 2,
    check: (cv) => {
      const valid = (cv.languages || []).filter((l) => l.language?.trim());
      if (valid.length === 0) return 0;

      const withLevel = valid.filter((l) => l.fluencyLevel?.trim());
      return withLevel.length === valid.length ? 1 : 0.6;
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
      if (valid.length === 0) return 0;

      const detailed = valid.filter(
        (c) => c.name?.trim() && c.institution?.trim()
      );
      return detailed.length === valid.length ? 1 : 0.6;
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
    personal: "Add your name, email, phone, location and LinkedIn",
    summary: "Write a professional summary (at least 2-3 sentences)",
    experience: "Add work experience with 3+ bullet points per role",
    education: "Add your education with school, degree and dates",
    skills: "Add at least 3 skill categories for ATS keyword coverage",
    projects: "Add a project with description bullet points",
    languages: "Add languages with fluency levels",
    certifications: "Add certifications with issuing institution",
  };

  return tips[top.id] || "Keep filling in your resume";
}
// Default empty CV data structure
// Used as the initial state when the builder loads

const initialCV = {
  name: "",
  title: "",
  phone: "",
  email: "",
  location: "",
  linkedin: "",
  website: "",
  summary: "",

  experiences: [],
  education: [],
  skills: [],
  projects: [],
  volunteering: [],
  certifications: [],
  languages: [],
  references: [],

  sectionTitles: {
    personal: "Personal Information",
    summary: "Professional Summary",
    experience: "Work Experience",
    education: "Education",
    skills: "Technical Skills",
    projects: "Technical Projects and Research",
    volunteering: "Volunteering & Leadership",
    certifications: "Certifications",
    languages: "Languages",
    references: "References",
    linkedinLabel: "LinkedIn",
    portfolioLabel: "Portfolio",
  },
};

export default initialCV;
import { createId } from "@/lib/createId";

// Shared style class strings used across all form components
export const inputStyle =
  "w-full border border-gray-200 rounded-md bg-gray-100 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-all";

export const labelStyle = "block text-sm font-medium text-gray-500 mb-1.5";

// CV preview inline style values (shared between preview and PDF template)
// These will be the foundation for the template system later
export const cvStyles = {
  page: {
    width: "210mm",
    minHeight: "297mm",
    padding: "12.7mm",
    fontFamily: "Inter, sans-serif",
    fontSize: "11pt",
    lineHeight: "1.5",
    color: "#333",
    overflowWrap: "break-word",
    wordBreak: "break-word",
  },

  name: {
    fontSize: "22pt",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "2px",
    color: "#000",
  },

  title: {
    textAlign: "center",
    fontSize: "11pt",
    color: "#444",
    marginBottom: "8px",
  },

  contact: {
    textAlign: "center",
    fontSize: "9pt",
    color: "#555",
    marginBottom: "16px",
  },

  divider: {
    borderTop: "1.5px solid #000",
    marginBottom: "12px",
  },

  sectionTitle: {
    fontSize: "12pt",
    fontWeight: "bold",
    borderBottom: "1px solid #999",
    paddingBottom: "2px",
    marginBottom: "6px",
    marginTop: "14px",
  },

  sectionTitleFirst: {
    fontSize: "12pt",
    fontWeight: "bold",
    borderBottom: "1px solid #999",
    paddingBottom: "2px",
    marginBottom: "6px",
  },

  summary: {
    fontSize: "10pt",
    marginBottom: "14px",
  },

  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: "10.5pt",
  },

  itemDate: {
    fontWeight: "normal",
    color: "#555",
  },

  itemSubtitle: {
    fontStyle: "italic",
    fontSize: "10pt",
    marginBottom: "4px",
  },

  bulletList: {
    paddingLeft: "18px",
    fontSize: "10pt",
    listStyleType: "disc",
  },

  bulletItem: {
    marginBottom: "2px",
  },

  referenceTitle: {
    fontWeight: "bold",
    fontSize: "10.5pt",
  },

  referenceContact: {
    fontSize: "10pt",
    color: "#555",
  },
};

// Factory functions for creating new items with unique IDs

export const createNewExperience = () => ({
  id: createId("exp"),
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  bullets: [""],
});

export const createNewEducation = () => ({
  id: createId("edu"),
  school: "",
  location: "",
  degree: "",
  startDate: "",
  endDate: "",
  additionalInfo: "",
});

export const createNewSkill = () => ({
  id: createId("skill"),
  category: "",
  items: "",
});

export const createNewProject = () => ({
  id: createId("project"),
  name: "",
  startDate: "",
  endDate: "",
  url: "",
  bullets: [""],
});

export const createNewVolunteering = () => ({
  id: createId("vol"),
  organization: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  bullets: [""],
});

export const createNewCertification = () => ({
  id: createId("cert"),
  name: "",
  institution: "",
  dateAcquired: "",
  expirationDate: "",
  url: "",
  description: "",
});

export const createNewLanguage = () => ({
  id: createId("lang"),
  language: "",
  fluencyLevel: "",
});

export const createNewReference = () => ({
  id: createId("ref"),
  name: "",
  company: "",
  phone: "",
  email: "",
});

// Zoom constraints
export const ZOOM_MIN = 40;
export const ZOOM_MAX = 150;
export const ZOOM_STEP = 10;

// Panel constraints (as fractions of window width)
export const PANEL_MIN_FRACTION = 1 / 3;
export const PANEL_MAX_FRACTION = 1 / 2;
export const PANEL_DEFAULT_WIDTH = 640;
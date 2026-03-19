"use client";

import useLocalStorage from "@/hooks/useLocalStorage";
import initialCV from "@/data/initialCV";
import {
  createNewExperience,
  createNewEducation,
  createNewSkill,
  createNewProject,
  createNewVolunteering,
  createNewCertification,
  createNewLanguage,
  createNewReference,
} from "@/lib/constants";

// Maps section keys to their "new item" factory functions
const templateMap = {
  experiences: createNewExperience,
  education: createNewEducation,
  skills: createNewSkill,
  projects: createNewProject,
  volunteering: createNewVolunteering,
  certifications: createNewCertification,
  languages: createNewLanguage,
  references: createNewReference,
};

function resolveItemIndex(items, itemIdentifier) {
  if (typeof itemIdentifier === "number") {
    return itemIdentifier;
  }

  return items.findIndex((item) => item.id === itemIdentifier);
}

// Central CV state management hook with localStorage persistence
// Accepts optional resumeId for multi-CV support
export default function useCVData(resumeId) {
  const storageKey = resumeId ? `cv-${resumeId}-cvData` : "cv-builder-cvData";
  const [cv, setCv] = useLocalStorage(storageKey, initialCV);

  const updateField = (field, value) => {
    setCv((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = (section) => {
    const createItem = templateMap[section];
    if (!createItem) return;

    setCv((prev) => ({
      ...prev,
      [section]: [...prev[section], createItem()],
    }));
  };

  const removeItem = (section, itemIdentifier) => {
    setCv((prev) => {
      const index = resolveItemIndex(prev[section], itemIdentifier);
      if (index === -1) return prev;

      return {
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index),
      };
    });
  };

  const updateItem = (section, itemIdentifier, field, value) => {
    setCv((prev) => {
      const updated = [...prev[section]];
      const index = resolveItemIndex(updated, itemIdentifier);

      if (index === -1) return prev;

      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [section]: updated };
    });
  };

  const moveItemUp = (section, itemIdentifier) => {
    setCv((prev) => {
      const updated = [...prev[section]];
      const index = resolveItemIndex(updated, itemIdentifier);

      if (index <= 0) return prev;

      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      return { ...prev, [section]: updated };
    });
  };

  const moveItemDown = (section, itemIdentifier) => {
    setCv((prev) => {
      const updated = [...prev[section]];
      const index = resolveItemIndex(updated, itemIdentifier);

      if (index === -1 || index === updated.length - 1) return prev;

      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      return { ...prev, [section]: updated };
    });
  };

  const addBullet = (section, itemIdentifier) => {
    setCv((prev) => {
      const updated = [...prev[section]];
      const index = resolveItemIndex(updated, itemIdentifier);

      if (index === -1) return prev;

      updated[index] = {
        ...updated[index],
        bullets: [...updated[index].bullets, ""],
      };

      return { ...prev, [section]: updated };
    });
  };

  const removeBullet = (section, itemIdentifier, bulletIndex) => {
    setCv((prev) => {
      const updated = [...prev[section]];
      const index = resolveItemIndex(updated, itemIdentifier);

      if (index === -1) return prev;

      const item = updated[index];
      if (item.bullets.length <= 1) return prev;

      updated[index] = {
        ...updated[index],
        bullets: item.bullets.filter((_, i) => i !== bulletIndex),
      };

      return { ...prev, [section]: updated };
    });
  };

  const updateBullet = (section, itemIdentifier, bulletIndex, value) => {
    setCv((prev) => {
      const updated = [...prev[section]];
      const index = resolveItemIndex(updated, itemIdentifier);

      if (index === -1) return prev;

      const newBullets = [...updated[index].bullets];
      newBullets[bulletIndex] = value;

      updated[index] = {
        ...updated[index],
        bullets: newBullets,
      };

      return { ...prev, [section]: updated };
    });
  };

  return {
    cv,
    setCv,
    updateField,
    addItem,
    removeItem,
    updateItem,
    moveItemUp,
    moveItemDown,
    addBullet,
    removeBullet,
    updateBullet,
  };
}
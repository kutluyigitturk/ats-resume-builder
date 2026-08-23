"use client";

import { useMemo } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import initialCV from "@/data/initialCV";
import { DATED_SECTIONS, ONGOING } from "@/lib/constants";
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

// Which word this resume uses for an entry that has not ended. Taking it from
// the document rather than from a setting means someone writing in Turkish
// types "Halen" once and every entry they add afterwards follows, with no
// preference to find and nothing to keep in sync.
function ongoingLabelFor(cv) {
  for (const section of DATED_SECTIONS) {
    for (const item of cv?.[section] ?? []) {
      const end = item?.endDate;
      if (typeof end === "string" && /\p{L}/u.test(end)) return end.trim();
    }
  }

  return ONGOING;
}

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
  const [stored, setCv, hydrated] = useLocalStorage(storageKey, initialCV);

  // A resume saved before a field existed simply has no key for it. Merging
  // over the defaults means every field the app knows about is always present,
  // so a new section cannot render as undefined in one place and crash another.
  const cv = useMemo(() => ({ ...initialCV, ...stored }), [stored]);

  const updateField = (field, value) => {
    setCv((prev) => ({ ...prev, [field]: value }));
  };

  const ongoingLabel = useMemo(() => ongoingLabelFor(cv), [cv]);

  const addItem = (section) => {
    const createItem = templateMap[section];
    if (!createItem) return;

    setCv((prev) => {
      const item = createItem();

      // Still running is the common case for the entry someone is adding right
      // now, so it starts that way - in this resume's own word.
      if (DATED_SECTIONS.includes(section)) {
        item.endDate = ongoingLabelFor(prev);
      }

      return { ...prev, [section]: [...prev[section], item] };
    });
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
    hydrated,
    ongoingLabel,
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

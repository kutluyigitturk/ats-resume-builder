"use client";

import { useState } from "react";
import initialCV from "@/data/initialCV";
import {
  createNewExperience,
  createNewEducation,
  createNewSkill,
  createNewProject,
  createNewReference,
} from "@/lib/constants";

// Maps section keys to their "new item" templates
const templateMap = {
  experiences: createNewExperience,
  education: createNewEducation,
  skills: createNewSkill,
  projects: createNewProject,
  references: createNewReference,
};

function resolveItemIndex(items, itemIdentifier) {
  if (typeof itemIdentifier === "number") {
    return itemIdentifier;
  }

  return items.findIndex((item) => item.id === itemIdentifier);
}

// Central CV state management hook
// Replaces ~30 individual add/remove/update/move functions with generic operations
export default function useCVData() {
  const [cv, setCv] = useState(initialCV);

  // Update a top-level field (name, email, summary, etc.)
  const updateField = (field, value) => {
    setCv((prev) => ({ ...prev, [field]: value }));
  };

  // Add a new item to an array section
  const addItem = (section) => {
  const createItem = templateMap[section];
  if (!createItem) return;

  setCv((prev) => ({
    ...prev,
    [section]: [...prev[section], createItem()],
  }));
};

  // Remove an item from an array section by index
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

  // Update a specific field on an item in an array section
  const updateItem = (section, itemIdentifier, field, value) => {
  setCv((prev) => {
    const updated = [...prev[section]];
    const index = resolveItemIndex(updated, itemIdentifier);

    if (index === -1) return prev;

    updated[index] = { ...updated[index], [field]: value };
    return { ...prev, [section]: updated };
  });
};

  // Move an item up in its array
  const moveItemUp = (section, itemIdentifier) => {
  setCv((prev) => {
    const updated = [...prev[section]];
    const index = resolveItemIndex(updated, itemIdentifier);

    if (index <= 0) return prev;

    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    return { ...prev, [section]: updated };
  });
};

  // Move an item down in its array
  const moveItemDown = (section, itemIdentifier) => {
  setCv((prev) => {
    const updated = [...prev[section]];
    const index = resolveItemIndex(updated, itemIdentifier);

    if (index === -1 || index === updated.length - 1) return prev;

    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    return { ...prev, [section]: updated };
  });
};

  // Add a bullet point to an item that has a bullets array
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

  // Remove a bullet point (keeps at least one)
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

  // Update a specific bullet point's text
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
"use client";

import { useState } from "react";
import initialCV from "@/data/initialCV";
import {
  newExperience,
  newEducation,
  newSkill,
  newProject,
  newReference,
} from "@/lib/constants";

// Maps section keys to their "new item" templates
const templateMap = {
  experiences: newExperience,
  education: newEducation,
  skills: newSkill,
  projects: newProject,
  references: newReference,
};

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
    const template = templateMap[section];
    if (!template) return;
    setCv((prev) => ({
      ...prev,
      [section]: [...prev[section], { ...template }],
    }));
  };

  // Remove an item from an array section by index
  const removeItem = (section, index) => {
    setCv((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // Update a specific field on an item in an array section
  const updateItem = (section, index, field, value) => {
    setCv((prev) => {
      const updated = [...prev[section]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [section]: updated };
    });
  };

  // Move an item up in its array
  const moveItemUp = (section, index) => {
    if (index === 0) return;
    setCv((prev) => {
      const updated = [...prev[section]];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      return { ...prev, [section]: updated };
    });
  };

  // Move an item down in its array
  const moveItemDown = (section, index) => {
    setCv((prev) => {
      if (index === prev[section].length - 1) return prev;
      const updated = [...prev[section]];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      return { ...prev, [section]: updated };
    });
  };

  // Add a bullet point to an item that has a bullets array
  const addBullet = (section, itemIndex) => {
    setCv((prev) => {
      const updated = [...prev[section]];
      updated[itemIndex] = {
        ...updated[itemIndex],
        bullets: [...updated[itemIndex].bullets, ""],
      };
      return { ...prev, [section]: updated };
    });
  };

  // Remove a bullet point (keeps at least one)
  const removeBullet = (section, itemIndex, bulletIndex) => {
    setCv((prev) => {
      const item = prev[section][itemIndex];
      if (item.bullets.length <= 1) return prev;

      const updated = [...prev[section]];
      updated[itemIndex] = {
        ...updated[itemIndex],
        bullets: item.bullets.filter((_, i) => i !== bulletIndex),
      };
      return { ...prev, [section]: updated };
    });
  };

  // Update a specific bullet point's text
  const updateBullet = (section, itemIndex, bulletIndex, value) => {
    setCv((prev) => {
      const updated = [...prev[section]];
      const newBullets = [...updated[itemIndex].bullets];
      newBullets[bulletIndex] = value;
      updated[itemIndex] = { ...updated[itemIndex], bullets: newBullets };
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
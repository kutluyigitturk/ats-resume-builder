"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import sectionTips from "@/data/sectionTips";
import { PersonIcon } from "@/icons";

export default function PersonalInfoForm({ cv, updateField, isOpen, onToggle, sectionTitle, onSectionTitleChange }) {
  return (
    <Section
      title={sectionTitle}
      onTitleChange={onSectionTitleChange}
      icon={<PersonIcon />}
      tips={sectionTips.personal}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          label="Name"
          placeholder="Full Name"
          value={cv.name}
          onChange={(v) => updateField("name", v)}
        />
        <FormInput
          label="Job Title"
          placeholder="Job Title | Position"
          value={cv.title}
          onChange={(v) => updateField("title", v)}
        />
        <FormInput
          label="Email"
          placeholder="email@example.com"
          value={cv.email}
          onChange={(v) => updateField("email", v)}
        />
        <FormInput
          label="Phone"
          placeholder="+90 5XX XXX XX XX"
          value={cv.phone}
          onChange={(v) => updateField("phone", v)}
        />
        <FormInput
          label="City"
          placeholder="City, Country"
          value={cv.location}
          onChange={(v) => updateField("location", v)}
        />
        <FormInput
          label="LinkedIn"
          placeholder="linkedin.com/in/yourprofile"
          value={cv.linkedin}
          onChange={(v) => updateField("linkedin", v)}
        />
        <FormInput
          label="Website/Portfolio"
          placeholder="Your portfolio or personal website URL"
          value={cv.website}
          onChange={(v) => updateField("website", v)}
        />
      </div>
    </Section>
  );
}
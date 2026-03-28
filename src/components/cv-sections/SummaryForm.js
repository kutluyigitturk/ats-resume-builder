"use client";

import Section from "@/components/ui/Section";
import { FormTextarea } from "@/components/ui/FormInput";
import sectionTips from "@/data/sectionTips";
import { DocumentIcon } from "@/icons";

export default function SummaryForm({ cv, updateField, isOpen, onToggle, sectionTitle, onSectionTitleChange }) {
  return (
    <Section
      title={sectionTitle}
      onTitleChange={onSectionTitleChange}
      icon={<DocumentIcon />}
      tips={sectionTips.summary}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <FormTextarea
        placeholder="Briefly introduce yourself. Mention your years of experience, areas of expertise, and career objectives."
        value={cv.summary}
        onChange={(v) => updateField("summary", v)}
        resizable
      />
    </Section>
  );
}
"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import AddButton from "@/components/ui/AddButton";
import ReorderableCard from "@/components/ui/ReorderableCard";
import sectionTips from "@/data/sectionTips";
import { GraduationCapIcon } from "@/icons";

export default function EducationForm({
  education,
  addItem,
  removeItem,
  updateItem,
  moveItemUp,
  moveItemDown,
  isOpen,
  onToggle,
}) {
  return (
    <Section
      title="Education"
      icon={<GraduationCapIcon />}
      tips={sectionTips.education}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <AddButton label="Add Education" onClick={() => addItem("education")} />

      {education.map((edu, index) => (
        <ReorderableCard
          key={edu.id ?? index}
          index={index}
          total={education.length}
          onMoveUp={() => moveItemUp("education", edu.id)}
          onMoveDown={() => moveItemDown("education", edu.id)}
          onRemove={() => removeItem("education", edu.id)}
        >
          <div className="mb-3 pr-24">
            <FormInput
              label="School"
              placeholder="School Name"
              value={edu.school}
              onChange={(v) => updateItem("education", edu.id, "school", v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <FormInput
              label="Degree"
              placeholder="Degree"
              value={edu.degree}
              onChange={(v) => updateItem("education", edu.id, "degree", v)}
            />
            <FormInput
              label="Location"
              placeholder="Location"
              value={edu.location}
              onChange={(v) => updateItem("education", edu.id, "location", v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <FormInput
              label="Date"
              placeholder="Date"
              value={edu.date}
              onChange={(v) => updateItem("education", edu.id, "date", v)}
            />
            <FormInput
              label="Additional Info"
              placeholder="Additional Info"
              value={edu.additionalInfo}
              onChange={(v) => updateItem("education", edu.id, "additionalInfo", v)}
            />
          </div>
        </ReorderableCard>
      ))}
    </Section>
  );
}
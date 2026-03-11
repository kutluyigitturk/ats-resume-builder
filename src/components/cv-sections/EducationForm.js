"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import { FormTextarea } from "@/components/ui/FormInput";
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
          key={index}
          index={index}
          total={education.length}
          onMoveUp={(i) => moveItemUp("education", i)}
          onMoveDown={(i) => moveItemDown("education", i)}
          onRemove={(i) => removeItem("education", i)}
        >
          {/* University | Location */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <FormInput
              label="University"
              placeholder="University"
              value={edu.school}
              onChange={(v) => updateItem("education", index, "school", v)}
            />
            <div className="pr-24">
              <FormInput
                label="Location"
                placeholder="Location"
                value={edu.location}
                onChange={(v) => updateItem("education", index, "location", v)}
              />
            </div>
          </div>

          {/* Degree | Graduation Date */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <FormInput
              label="Degree"
              placeholder="Degree"
              value={edu.degree}
              onChange={(v) => updateItem("education", index, "degree", v)}
            />
            <FormInput
              label="Graduation Date"
              placeholder="Graduation Date"
              value={edu.date}
              onChange={(v) => updateItem("education", index, "date", v)}
            />
          </div>

          {/* Additional Information */}
          <FormTextarea
            label="Additional Information"
            placeholder="Additional information (honors, relevant coursework, etc.)"
            value={edu.additionalInfo}
            onChange={(v) => updateItem("education", index, "additionalInfo", v)}
            rows="h-20"
          />
        </ReorderableCard>
      ))}
    </Section>
  );
}
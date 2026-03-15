"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import AddButton from "@/components/ui/AddButton";
import ReorderableCard from "@/components/ui/ReorderableCard";
import sectionTips from "@/data/sectionTips";
import DateInput from "@/components/ui/DateInput";
import { labelStyle, inputStyle } from "@/lib/constants";
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
      {education.map((edu, index) => (
        <ReorderableCard
          key={edu.id ?? index}
          index={index}
          total={education.length}
          onMoveUp={() => moveItemUp("education", edu.id)}
          onMoveDown={() => moveItemDown("education", edu.id)}
          onRemove={() => removeItem("education", edu.id)}
        >
          <div className="pt-6">
            <div className="grid grid-cols-2 gap-5 mb-4">
              <FormInput
                label="University"
                placeholder="University Name"
                value={edu.school}
                onChange={(v) => updateItem("education", edu.id, "school", v)}
              />
              <FormInput
                label="Location"
                placeholder="Location"
                value={edu.location}
                onChange={(v) => updateItem("education", edu.id, "location", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-5 mb-4">
              <FormInput
                label="Degree"
                placeholder="Degree"
                value={edu.degree}
                onChange={(v) => updateItem("education", edu.id, "degree", v)}
              />

              <div className="grid grid-cols-2 gap-3">
                <DateInput
                  label="Start Date"
                  value={edu.startDate}
                  onChange={(v) => updateItem("education", edu.id, "startDate", v)}
                />
                <DateInput
                  label="End Date"
                  value={edu.endDate}
                  onChange={(v) => updateItem("education", edu.id, "endDate", v)}
                />
              </div>
            </div>

            <div>
              <label className={labelStyle}>Additional Information</label>
              <textarea
                rows={5}
                placeholder="Additional Information"
                value={edu.additionalInfo}
                onChange={(e) =>
                  updateItem("education", edu.id, "additionalInfo", e.target.value)
                }
                className={`${inputStyle} min-h-[140px] resize-y leading-6`}
              />
            </div>
          </div>
        </ReorderableCard>
      ))}

      <AddButton label="Add Education" onClick={() => addItem("education")} />
    </Section>
  );
}
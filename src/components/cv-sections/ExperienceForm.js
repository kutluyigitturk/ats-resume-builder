"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import AddButton from "@/components/ui/AddButton";
import ReorderableCard from "@/components/ui/ReorderableCard";
import BulletListEditor from "@/components/ui/BulletListEditor";
import sectionTips from "@/data/sectionTips";
import { BriefcaseIcon } from "@/icons";

export default function ExperienceForm({
  experiences,
  addItem,
  removeItem,
  updateItem,
  moveItemUp,
  moveItemDown,
  addBullet,
  removeBullet,
  updateBullet,
  isOpen,
  onToggle,
}) {
  return (
    <Section
      title="Work Experience"
      icon={<BriefcaseIcon />}
      tips={sectionTips.experience}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {experiences.map((exp, index) => (
        <ReorderableCard
          key={exp.id ?? index}
          index={index}
          total={experiences.length}
          onMoveUp={() => moveItemUp("experiences", exp.id)}
          onMoveDown={() => moveItemDown("experiences", exp.id)}
          onRemove={() => removeItem("experiences", exp.id)}
        >
          <div className="pt-6">
            <div className="mb-3">
              <FormInput
                label="Company"
                placeholder="Company Name"
                value={exp.company}
                onChange={(v) => updateItem("experiences", exp.id, "company", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <FormInput
                label="Role"
                placeholder="Role"
                value={exp.position}
                onChange={(v) => updateItem("experiences", exp.id, "position", v)}
              />
              <FormInput
                label="Location"
                placeholder="Location"
                value={exp.location}
                onChange={(v) => updateItem("experiences", exp.id, "location", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <FormInput
                label="Start Date"
                placeholder="Start Date"
                value={exp.startDate}
                onChange={(v) => updateItem("experiences", exp.id, "startDate", v)}
              />
              <FormInput
                label="End Date"
                placeholder="End Date"
                value={exp.endDate}
                onChange={(v) => updateItem("experiences", exp.id, "endDate", v)}
              />
            </div>

            <BulletListEditor
              label="Responsibilities"
              placeholder="New Responsibility"
              addLabel="Add Responsibility"
              bullets={exp.bullets}
              onUpdate={(bIndex, value) => updateBullet("experiences", exp.id, bIndex, value)}
              onAdd={() => addBullet("experiences", exp.id)}
              onRemove={(bIndex) => removeBullet("experiences", exp.id, bIndex)}
            />
          </div>
        </ReorderableCard>
      ))}

      <AddButton label="Add Work Experience" onClick={() => addItem("experiences")} />
    </Section>
  );
}
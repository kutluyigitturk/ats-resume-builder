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
      <AddButton label="Add Work Experience" onClick={() => addItem("experiences")} />

      {experiences.map((exp, index) => (
        <ReorderableCard
          key={index}
          index={index}
          total={experiences.length}
          onMoveUp={(i) => moveItemUp("experiences", i)}
          onMoveDown={(i) => moveItemDown("experiences", i)}
          onRemove={(i) => removeItem("experiences", i)}
        >
          {/* Company */}
          <div className="mb-3 pr-24">
            <FormInput
              label="Company"
              placeholder="Company Name"
              value={exp.company}
              onChange={(v) => updateItem("experiences", index, "company", v)}
            />
          </div>

          {/* Role | Location */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <FormInput
              label="Role"
              placeholder="Role"
              value={exp.position}
              onChange={(v) => updateItem("experiences", index, "position", v)}
            />
            <FormInput
              label="Location"
              placeholder="Location"
              value={exp.location}
              onChange={(v) => updateItem("experiences", index, "location", v)}
            />
          </div>

          {/* Start Date | End Date */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <FormInput
              label="Start Date"
              placeholder="Start Date"
              value={exp.startDate}
              onChange={(v) => updateItem("experiences", index, "startDate", v)}
            />
            <FormInput
              label="End Date"
              placeholder="End Date"
              value={exp.endDate}
              onChange={(v) => updateItem("experiences", index, "endDate", v)}
            />
          </div>

          {/* Responsibilities */}
          <BulletListEditor
            label="Responsibilities"
            placeholder="New Responsibility"
            addLabel="Add Responsibility"
            bullets={exp.bullets}
            onUpdate={(bIndex, value) => updateBullet("experiences", index, bIndex, value)}
            onAdd={() => addBullet("experiences", index)}
            onRemove={(bIndex) => removeBullet("experiences", index, bIndex)}
          />
        </ReorderableCard>
      ))}
    </Section>
  );
}
"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import AddButton from "@/components/ui/AddButton";
import ReorderableCard from "@/components/ui/ReorderableCard";
import sectionTips from "@/data/sectionTips";
import { WrenchIcon } from "@/icons";

export default function SkillsForm({
  skills,
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
      title="Technical Skills"
      icon={<WrenchIcon />}
      tips={sectionTips.skills}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <AddButton label="Add Category" onClick={() => addItem("skills")} />

      {skills.map((skill, index) => (
        <ReorderableCard
          key={index}
          index={index}
          total={skills.length}
          onMoveUp={(i) => moveItemUp("skills", i)}
          onMoveDown={(i) => moveItemDown("skills", i)}
          onRemove={(i) => removeItem("skills", i)}
        >
          {/* Category Name */}
          <div className="mb-3 pr-24">
            <FormInput
              label="Category"
              placeholder="e.g. Backend & Languages"
              value={skill.category}
              onChange={(v) => updateItem("skills", index, "category", v)}
            />
          </div>

          {/* Skills */}
          <FormInput
            label="Skills"
            placeholder="e.g. Python (Expert), SQL (Advanced), Java, C/C++"
            value={skill.items}
            onChange={(v) => updateItem("skills", index, "items", v)}
          />
        </ReorderableCard>
      ))}
    </Section>
  );
}
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
  sectionTitle, 
  onSectionTitleChange,
}) {
  return (
    <Section
      title={sectionTitle}
      onTitleChange={onSectionTitleChange}
      icon={<WrenchIcon />}
      tips={sectionTips.skills}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {skills.map((skill, index) => (
        <ReorderableCard
          key={skill.id ?? index}
          index={index}
          total={skills.length}
          onMoveUp={() => moveItemUp("skills", skill.id)}
          onMoveDown={() => moveItemDown("skills", skill.id)}
          onRemove={() => removeItem("skills", skill.id)}
        >
          <div className="pt-6">
            <div className="grid grid-cols-1 gap-3">
              <FormInput
                label="Category"
                placeholder="e.g. Programming Languages"
                value={skill.category}
                onChange={(v) => updateItem("skills", skill.id, "category", v)}
              />
              <FormInput
                label="Items"
                placeholder="e.g. JavaScript, Python, React"
                value={skill.items}
                onChange={(v) => updateItem("skills", skill.id, "items", v)}
              />
            </div>
          </div>
        </ReorderableCard>
      ))}

      <AddButton label="Add Skill Category" onClick={() => addItem("skills")} />
    </Section>
  );
}
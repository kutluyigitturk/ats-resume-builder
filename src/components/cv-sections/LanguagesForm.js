"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import AddButton from "@/components/ui/AddButton";
import ReorderableCard from "@/components/ui/ReorderableCard";
import sectionTips from "@/data/sectionTips";
import { LanguagesIcon } from "@/icons";

export default function LanguagesForm({
  languages,
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
      title="Languages"
      icon={<LanguagesIcon />}
      tips={sectionTips.languages}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {languages.map((lang, index) => (
        <ReorderableCard
          key={lang.id ?? index}
          index={index}
          total={languages.length}
          onMoveUp={() => moveItemUp("languages", lang.id)}
          onMoveDown={() => moveItemDown("languages", lang.id)}
          onRemove={() => removeItem("languages", lang.id)}
        >
          <div className="pt-6">
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Language"
                placeholder="e.g., English, Spanish, Mandarin"
                value={lang.language}
                onChange={(v) => updateItem("languages", lang.id, "language", v)}
              />
              <FormInput
                label="Fluency Level"
                placeholder="e.g., Native, Fluent, Professional, Basic"
                value={lang.fluencyLevel}
                onChange={(v) => updateItem("languages", lang.id, "fluencyLevel", v)}
              />
            </div>
          </div>
        </ReorderableCard>
      ))}

      <AddButton label="Add Language" onClick={() => addItem("languages")} />
    </Section>
  );
}
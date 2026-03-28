"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import AddButton from "@/components/ui/AddButton";
import ReorderableCard from "@/components/ui/ReorderableCard";
import sectionTips from "@/data/sectionTips";
import { UsersIcon } from "@/icons";

export default function ReferencesForm({
  references,
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
      icon={<UsersIcon />}
      tips={sectionTips.references}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {references.map((ref, index) => (
        <ReorderableCard
          key={ref.id ?? index}
          index={index}
          total={references.length}
          onMoveUp={() => moveItemUp("references", ref.id)}
          onMoveDown={() => moveItemDown("references", ref.id)}
          onRemove={() => removeItem("references", ref.id)}
        >
          <div className="pt-6">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <FormInput
                label="Name"
                placeholder="Reference Name"
                value={ref.name}
                onChange={(v) => updateItem("references", ref.id, "name", v)}
              />
              <FormInput
                label="Company"
                placeholder="Company"
                value={ref.company}
                onChange={(v) => updateItem("references", ref.id, "company", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Phone"
                placeholder="Phone"
                value={ref.phone}
                onChange={(v) => updateItem("references", ref.id, "phone", v)}
              />
              <FormInput
                label="Email"
                placeholder="Email"
                value={ref.email}
                onChange={(v) => updateItem("references", ref.id, "email", v)}
              />
            </div>
          </div>
        </ReorderableCard>
      ))}

      <div className="mt-2">
        <AddButton label="Add Reference" onClick={() => addItem("references")} />
      </div>
    </Section>
  );
}
"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import AddButton from "@/components/ui/AddButton";
import sectionTips from "@/data/sectionTips";
import { UsersIcon, TrashIcon } from "@/icons";

export default function ReferencesForm({
  references,
  addItem,
  removeItem,
  updateItem,
  isOpen,
  onToggle,
}) {
  return (
    <Section
      title="References"
      icon={<UsersIcon />}
      tips={sectionTips.references}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <AddButton label="Add Reference" onClick={() => addItem("references")} />

      {references.map((ref, index) => (
        <div
          key={ref.id ?? index}
          className="mb-5 p-5 bg-white border border-gray-200 rounded-xl relative"
        >
          <button
            onClick={() => removeItem("references", ref.id)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <TrashIcon />
          </button>

          <div className="grid grid-cols-2 gap-3 mb-3 pr-12">
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
      ))}
    </Section>
  );
}
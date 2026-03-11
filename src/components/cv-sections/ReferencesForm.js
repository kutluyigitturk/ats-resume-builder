"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import AddButton from "@/components/ui/AddButton";
import { TrashIcon, UsersIcon } from "@/icons";

export default function ReferencesForm({
  references,
  hideReferences,
  setHideReferences,
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
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {/* Hide references toggle */}
      <div className="flex items-center gap-3 mb-4 mt-3">
        <button
          onClick={() => setHideReferences(!hideReferences)}
          className={`relative w-10 h-5 rounded-full transition-colors ${hideReferences ? "bg-blue-600" : "bg-gray-300"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${hideReferences ? "translate-x-5" : ""}`}
          />
        </button>
        <span className="text-sm text-gray-600">
          Hide references and show &quot;Available upon request&quot;
        </span>
      </div>

      {!hideReferences && (
        <>
          <AddButton label="Add Reference" onClick={() => addItem("references")} />

          {references.map((ref, index) => (
            <div
              key={index}
              className="mb-5 p-5 bg-white border border-gray-200 rounded-xl relative"
            >
              {/* Name | Company */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <FormInput
                  label="Referent's Full Name"
                  placeholder="e.g., John Smith"
                  value={ref.name}
                  onChange={(v) => updateItem("references", index, "name", v)}
                />
                <FormInput
                  label="Company"
                  placeholder="e.g., Tech Corp"
                  value={ref.company}
                  onChange={(v) => updateItem("references", index, "company", v)}
                />
              </div>

              {/* Phone | Email */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <FormInput
                  label="Phone"
                  placeholder="e.g., +1 (555) 123-4567"
                  value={ref.phone}
                  onChange={(v) => updateItem("references", index, "phone", v)}
                />
                <FormInput
                  label="Email"
                  placeholder="e.g., john@example.com"
                  value={ref.email}
                  onChange={(v) => updateItem("references", index, "email", v)}
                />
              </div>

              {/* Remove Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => removeItem("references", index)}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  <TrashIcon size={14} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </Section>
  );
}
"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import AddButton from "@/components/ui/AddButton";
import ReorderableCard from "@/components/ui/ReorderableCard";
import BulletListEditor from "@/components/ui/BulletListEditor";
import sectionTips from "@/data/sectionTips";
import { VolunteeringIcon } from "@/icons";

export default function VolunteeringForm({
  volunteering,
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
      title="Volunteering & Leadership"
      icon={<VolunteeringIcon />}
      tips={sectionTips.volunteering}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {volunteering.map((vol, index) => (
        <ReorderableCard
          key={vol.id ?? index}
          index={index}
          total={volunteering.length}
          onMoveUp={() => moveItemUp("volunteering", vol.id)}
          onMoveDown={() => moveItemDown("volunteering", vol.id)}
          onRemove={() => removeItem("volunteering", vol.id)}
        >
          <div className="pt-6">
            <div className="mb-3">
              <FormInput
                label="Organization"
                placeholder="Organization Name"
                value={vol.organization}
                onChange={(v) => updateItem("volunteering", vol.id, "organization", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <FormInput
                label="Role"
                placeholder="Role"
                value={vol.role}
                onChange={(v) => updateItem("volunteering", vol.id, "role", v)}
              />
              <FormInput
                label="Location"
                placeholder="Location"
                value={vol.location}
                onChange={(v) => updateItem("volunteering", vol.id, "location", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <FormInput
                label="Start Date"
                placeholder="Start Date"
                value={vol.startDate}
                onChange={(v) => updateItem("volunteering", vol.id, "startDate", v)}
              />
              <FormInput
                label="End Date"
                placeholder="End Date"
                value={vol.endDate}
                onChange={(v) => updateItem("volunteering", vol.id, "endDate", v)}
              />
            </div>

            <BulletListEditor
              label="Responsibilities"
              placeholder="New Responsibility"
              addLabel="Add Responsibility"
              bullets={vol.bullets}
              onUpdate={(bIndex, value) => updateBullet("volunteering", vol.id, bIndex, value)}
              onAdd={() => addBullet("volunteering", vol.id)}
              onRemove={(bIndex) => removeBullet("volunteering", vol.id, bIndex)}
            />
          </div>
        </ReorderableCard>
      ))}

      <AddButton label="Add Volunteering/Leadership" onClick={() => addItem("volunteering")} />
    </Section>
  );
}
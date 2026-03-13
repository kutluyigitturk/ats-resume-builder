"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import AddButton from "@/components/ui/AddButton";
import ReorderableCard from "@/components/ui/ReorderableCard";
import sectionTips from "@/data/sectionTips";
import { CertificationIcon } from "@/icons";

export default function CertificationsForm({
  certifications,
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
      title="Certifications"
      icon={<CertificationIcon />}
      tips={sectionTips.certifications}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {certifications.map((cert, index) => (
        <ReorderableCard
          key={cert.id ?? index}
          index={index}
          total={certifications.length}
          onMoveUp={() => moveItemUp("certifications", cert.id)}
          onMoveDown={() => moveItemDown("certifications", cert.id)}
          onRemove={() => removeItem("certifications", cert.id)}
        >
          <div className="pt-6">
            <div className="mb-3">
              <FormInput
                label="Certification Name"
                placeholder="New Certification"
                value={cert.name}
                onChange={(v) => updateItem("certifications", cert.id, "name", v)}
              />
            </div>

            <div className="mb-3">
              <FormInput
                label="Issuing Institution"
                placeholder="Institution Name"
                value={cert.institution}
                onChange={(v) => updateItem("certifications", cert.id, "institution", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Date Acquired"
                placeholder="MM/YYYY"
                value={cert.dateAcquired}
                onChange={(v) => updateItem("certifications", cert.id, "dateAcquired", v)}
              />
              <FormInput
                label="Expiration Date"
                placeholder="MM/YYYY"
                value={cert.expirationDate}
                onChange={(v) => updateItem("certifications", cert.id, "expirationDate", v)}
              />
            </div>
          </div>
        </ReorderableCard>
      ))}

      <AddButton label="Add Certification" onClick={() => addItem("certifications")} />
    </Section>
  );
}
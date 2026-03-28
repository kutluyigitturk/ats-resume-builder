"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import AddButton from "@/components/ui/AddButton";
import ReorderableCard from "@/components/ui/ReorderableCard";
import BulletListEditor from "@/components/ui/BulletListEditor";
import sectionTips from "@/data/sectionTips";
import DateInput from "@/components/ui/DateInput";
import { FolderIcon } from "@/icons";

export default function ProjectsForm({
  projects,
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
  templateId,
  sectionTitle, 
  onSectionTitleChange,
}) {
  return (
    <Section
      title={sectionTitle}
      onTitleChange={onSectionTitleChange}
      icon={<FolderIcon />}
      tips={sectionTips.projects}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {projects.map((project, index) => (
        <ReorderableCard
          key={project.id ?? index}
          index={index}
          total={projects.length}
          onMoveUp={() => moveItemUp("projects", project.id)}
          onMoveDown={() => moveItemDown("projects", project.id)}
          onRemove={() => removeItem("projects", project.id)}
        >
          <div className="pt-6">
            <div className="mb-3">
              <FormInput
                label="Project Name"
                placeholder="Project Name"
                value={project.name}
                onChange={(v) => updateItem("projects", project.id, "name", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <DateInput
                  label="Start Date"
                  value={project.startDate}
                  onChange={(v) => updateItem("projects", project.id, "startDate", v)}
                />
                <DateInput
                  label="End Date"
                  value={project.endDate}
                  onChange={(v) => updateItem("projects", project.id, "endDate", v)}
                />
            </div>

            {templateId === "advanced" && (
              <div className="mb-3">
                <FormInput
                  label="Project URL"
                  placeholder="https://..."
                  value={project.url}
                  onChange={(v) => updateItem("projects", project.id, "url", v)}
                />
              </div>
            )}

            <BulletListEditor
              label="Project Details"
              placeholder="New Detail"
              addLabel="Add Detail"
              bullets={project.bullets}
              onUpdate={(bIndex, value) => updateBullet("projects", project.id, bIndex, value)}
              onAdd={() => addBullet("projects", project.id)}
              onRemove={(bIndex) => removeBullet("projects", project.id, bIndex)}
            />
          </div>
        </ReorderableCard>
      ))}

      <AddButton label="Add Project" onClick={() => addItem("projects")} />
    </Section>
  );
}
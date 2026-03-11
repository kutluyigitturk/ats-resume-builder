"use client";

import Section from "@/components/ui/Section";
import FormInput from "@/components/ui/FormInput";
import AddButton from "@/components/ui/AddButton";
import ReorderableCard from "@/components/ui/ReorderableCard";
import BulletListEditor from "@/components/ui/BulletListEditor";
import sectionTips from "@/data/sectionTips";
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
}) {
  return (
    <Section
      title="Projects and Research"
      icon={<FolderIcon />}
      tips={sectionTips.projects}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <AddButton label="Add Project" onClick={() => addItem("projects")} />

      {projects.map((project, index) => (
        <ReorderableCard
          key={index}
          index={index}
          total={projects.length}
          onMoveUp={(i) => moveItemUp("projects", i)}
          onMoveDown={(i) => moveItemDown("projects", i)}
          onRemove={(i) => removeItem("projects", i)}
        >
          {/* Project Title */}
          <div className="mb-3 pr-24">
            <FormInput
              label="Project Title"
              placeholder="New Project"
              value={project.name}
              onChange={(v) => updateItem("projects", index, "name", v)}
            />
          </div>

          {/* Start Date | End Date */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <FormInput
              label="Start Date"
              placeholder="Start Date"
              value={project.startDate}
              onChange={(v) => updateItem("projects", index, "startDate", v)}
            />
            <FormInput
              label="End Date"
              placeholder="End Date"
              value={project.endDate}
              onChange={(v) => updateItem("projects", index, "endDate", v)}
            />
          </div>

          {/* Project URL */}
          <div className="mb-3">
            <FormInput
              label="Project URL"
              placeholder="Project URL (optional)"
              value={project.url}
              onChange={(v) => updateItem("projects", index, "url", v)}
            />
          </div>

          {/* Descriptions */}
          <BulletListEditor
            label="Project Descriptions"
            placeholder="Project description"
            addLabel="Add Description"
            bullets={project.bullets}
            onUpdate={(bIndex, value) => updateBullet("projects", index, bIndex, value)}
            onAdd={() => addBullet("projects", index)}
            onRemove={(bIndex) => removeBullet("projects", index, bIndex)}
          />
        </ReorderableCard>
      ))}
    </Section>
  );
}
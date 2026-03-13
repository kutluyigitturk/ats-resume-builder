"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { sectionDefinitions } from "@/data/styleDefaults";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { ListOrderedIcon, PersonIcon, DocumentIcon, BriefcaseIcon, GraduationCapIcon, WrenchIcon, FolderIcon, UsersIcon, VolunteeringIcon, CertificationIcon, LanguagesIcon } from "@/icons";
import React from "react";

/* ─── Drag Handle Icon ───────────────────────────── */

function DragHandleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gray-400">
      <circle cx="5" cy="3" r="1.5" />
      <circle cx="11" cy="3" r="1.5" />
      <circle cx="5" cy="8" r="1.5" />
      <circle cx="11" cy="8" r="1.5" />
      <circle cx="5" cy="13" r="1.5" />
      <circle cx="11" cy="13" r="1.5" />
    </svg>
  );
}

// Section icon mapping — matches editor sidebar icons
const sectionIcons = {
  summary: DocumentIcon,
  experience: BriefcaseIcon,
  education: GraduationCapIcon,
  skills: WrenchIcon,
  projects: FolderIcon,
  references: UsersIcon,
  volunteering: VolunteeringIcon,
  certifications: CertificationIcon,
  languages: LanguagesIcon,
};

/* ─── Sortable Item ──────────────────────────────── */

function SortableItem({ id }) {
  const section = sectionDefinitions.find((s) => s.id === id);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-grab active:cursor-grabbing touch-none transition-shadow ${
        isDragging
          ? "border-gray-200 bg-gray-100 shadow-md"
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      <span className="text-gray-400">
        <ListOrderedIcon size={16} />
      </span>
      <span style={{ color: "rgb(37, 99, 235)" }}>
        {sectionIcons[id] && React.createElement(sectionIcons[id], { size: 18 })}
      </span>
      <span className="text-sm font-medium text-gray-700 select-none">
        {section?.label || id}
      </span>
    </div>
  );
}

/* ─── Fixed Item (Personal Information) ──────────── */

function FixedItem() {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-100 bg-gray-50">
      <span className="flex items-center gap-3 ml-7">
        <span style={{ color: "rgb(37, 99, 235)" }}><PersonIcon size={18} /></span>
        <span className="text-sm font-medium text-gray-500 select-none">Personal Information</span>
      </span>
      <span className="text-xs text-gray-400 font-medium">Fixed</span>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────── */

export default function ReorderSections({ sectionOrder, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sectionOrder.indexOf(active.id);
    const newIndex = sectionOrder.indexOf(over.id);
    onReorder(arrayMove(sectionOrder, oldIndex, newIndex));
  };

  return (
    <div className="mx-4 mt-4 mb-4 bg-white border border-gray-200 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <span style={{ color: "rgb(37, 99, 235)" }}> 
          <ListOrderedIcon size={20} />
        </span>
        <h2 className="text-sm font-semibold text-gray-900">Reorder Sections</h2>
      </div>

      {/* Description */}
      <div className="px-5 pt-3 pb-2">
        <p className="text-xs text-gray-500">
          Personal Information stays at top. Drag to reorder.
        </p>
      </div>

      {/* Section List */}
      <div className="px-5 pb-4 flex flex-col gap-2">
        <FixedItem />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sectionOrder}
            strategy={verticalListSortingStrategy}
          >
            {sectionOrder.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
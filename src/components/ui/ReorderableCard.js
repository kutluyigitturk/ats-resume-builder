"use client";

import { MoveUpIcon, MoveDownIcon, TrashIcon } from "@/icons";

// Card wrapper with move up/down and delete controls
// Used by Experience, Education, Skills, and Projects sections
export default function ReorderableCard({
  children,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
}) {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div className="mb-5 p-5 bg-white border border-gray-200 rounded-xl relative">
      {children}

      {/* Reorder & Delete Controls (top-right area) */}
      <div className="absolute top-4 right-4 flex items-center gap-0.5">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => onMoveUp(index)}
            className={`p-1 transition-colors ${isFirst ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-gray-700"}`}
            title="Move up"
            disabled={isFirst}
          >
            <MoveUpIcon />
          </button>
          <button
            onClick={() => onMoveDown(index)}
            className={`p-1 transition-colors ${isLast ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-gray-700"}`}
            title="Move down"
            disabled={isLast}
          >
            <MoveDownIcon />
          </button>
        </div>
        <button
          onClick={() => onRemove(index)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
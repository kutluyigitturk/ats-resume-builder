"use client";

import { MoveUpIcon, MoveDownIcon, TrashIcon } from "@/icons";

export default function ItemControls({
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
  className = "",
}) {
  return (
    <div className={`flex items-start gap-1 ${className}`}>
      <div className="flex flex-col gap-0.5">
        <button
          onClick={onMoveUp}
          className={`p-1 transition-colors ${
            isFirst
              ? "text-gray-200 cursor-not-allowed"
              : "text-gray-400 hover:text-gray-700"
          }`}
          title="Move up"
          disabled={isFirst}
        >
          <MoveUpIcon />
        </button>

        <button
          onClick={onMoveDown}
          className={`p-1 transition-colors ${
            isLast
              ? "text-gray-200 cursor-not-allowed"
              : "text-gray-400 hover:text-gray-700"
          }`}
          title="Move down"
          disabled={isLast}
        >
          <MoveDownIcon />
        </button>
      </div>

      <button
        onClick={onRemove}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        title="Delete"
      >
        <TrashIcon />
      </button>
    </div>
  );
}
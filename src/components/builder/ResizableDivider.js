"use client";

import { GripVerticalIcon } from "@/icons";

export default function ResizableDivider({ onMouseDown }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="relative flex w-1 items-center justify-center bg-gray-300 cursor-col-resize"
      style={{ height: "100vh", position: "sticky", top: 0 }}
    >
      <div className="absolute top-1/2 -translate-y-1/2 z-10 flex h-5 w-3 items-center justify-center rounded-sm border border-gray-400 bg-white">
        <GripVerticalIcon />
      </div>
    </div>
  );
}
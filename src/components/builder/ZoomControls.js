"use client";

import { ZoomInIcon, ZoomOutIcon } from "@/icons";
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from "@/lib/constants";

export default function ZoomControls({ zoom, setZoom }) {
  const zoomIn = () => setZoom((prev) => Math.min(prev + ZOOM_STEP, ZOOM_MAX));
  const zoomOut = () => setZoom((prev) => Math.max(prev - ZOOM_STEP, ZOOM_MIN));

  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-2 py-1">
        <button
          onClick={zoomOut}
          className="p-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ZoomOutIcon />
        </button>

        <span className="px-3 text-sm font-medium text-gray-700 select-none min-w-[48px] text-center">
          {zoom}%
        </span>

        <button
          onClick={zoomIn}
          className="p-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ZoomInIcon />
        </button>
      </div>
    </div>
  );
}
"use client";

import { ZoomInIcon, ZoomOutIcon } from "@/icons";
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from "@/lib/constants";

export default function ZoomControls({ zoom, setZoom }) {
  const zoomIn = () => setZoom((prev) => Math.min(prev + ZOOM_STEP, ZOOM_MAX));
  const zoomOut = () => setZoom((prev) => Math.max(prev - ZOOM_STEP, ZOOM_MIN));

  const isMin = zoom <= ZOOM_MIN;
  const isMax = zoom >= ZOOM_MAX;

  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/95 px-1.5 py-1 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur">
        <button
          type="button"
          onClick={zoomOut}
          disabled={isMin}
          aria-label="Zoom out"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
        >
          <ZoomOutIcon />
        </button>

        <span className="min-w-[54px] select-none text-center text-sm font-semibold tracking-[-0.01em] text-slate-700">
          {zoom}%
        </span>

        <button
          type="button"
          onClick={zoomIn}
          disabled={isMax}
          aria-label="Zoom in"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
        >
          <ZoomInIcon />
        </button>
      </div>
    </div>
  );
}
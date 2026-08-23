"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import Modal from "@/components/ui/Modal";
import Avatar from "@/components/Avatar";
import { PencilIcon, XIcon } from "@/icons";

// Kept in sync with MAX_UPLOAD_BYTES on the server. Checking here as well only
// saves the user a round trip; the server is the one that decides.
const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

// The crop frame is a fixed size rather than a ratio so the circle can be
// drawn over its top square without measuring anything at runtime.
const FRAME_W = 240;
const FRAME_H = 320;
const STAGE_H = 400;

export default function AvatarEditor({ name, email, version, onVersionChange }) {
  const router = useRouter();
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [objectUrl, setObjectUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const src = version ? `/api/account/avatar?v=${version}` : null;

  // An object URL is a live handle on a file; leaving them behind keeps the
  // whole image in memory for as long as the tab is open.
  useEffect(() => {
    if (!objectUrl) return;
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  function pick(event) {
    const chosen = event.target.files?.[0];

    // Reset immediately so choosing the same file twice still fires onChange.
    event.target.value = "";
    if (!chosen) return;

    if (chosen.size > MAX_BYTES) {
      setError("That photo is over 4 MB. Try a smaller one.");
      return;
    }

    setError(null);
    setFile(chosen);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setPixels(null);
    setObjectUrl(URL.createObjectURL(chosen));
  }

  function close() {
    setFile(null);
    setObjectUrl(null);
    setError(null);
  }

  async function save() {
    if (!file || !pixels) return;

    setBusy(true);
    setError(null);

    const body = new FormData();
    // The original file and the rectangle, not the cropped result: the server
    // has to be the one that decides what those pixels become.
    body.append("file", file);
    body.append("crop", JSON.stringify(pixels));

    try {
      const response = await fetch("/api/account/avatar", { method: "POST", body });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error ?? "Could not save that photo. Try again.");
        return;
      }

      onVersionChange(data.updatedAt);
      close();
      // The account menu reads the session from the server layout, so the
      // photo in the navbar only changes once that runs again.
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/account/avatar", { method: "DELETE" });
      if (!response.ok) {
        setError("Could not remove that photo. Try again.");
        return;
      }

      onVersionChange(null);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar name={name} email={email} size={120} src={src} />

        {/* Straddling the avatar's bottom edge, the way the reference does -
            near what they act on without covering the face. */}
        <div className="absolute -bottom-2 flex w-full items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            aria-label={src ? "Change photo" : "Add a photo"}
            title={src ? "Change photo" : "Add a photo"}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-blue-700 text-white ring-2 ring-[#f6f6f4] transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <PencilIcon size={15} />
          </button>

          {/* Only when there is something to remove: a live-looking control
              that does nothing is worse than no control. */}
          {src && (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              aria-label="Remove photo"
              title="Remove photo"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white ring-2 ring-[#f6f6f4] transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        onChange={pick}
        className="sr-only"
        tabIndex={-1}
      />

      {error && !objectUrl && (
        <p role="alert" className="mt-4 text-[13px] text-red-600">
          {error}
        </p>
      )}

      {objectUrl && (
        <Modal
          open
          onClose={busy ? () => {} : close}
          labelledBy="crop-title"
          backdropClass="backdrop:bg-black/25 backdrop:backdrop-blur-sm"
        >
          <div
            className="mx-4 w-full max-w-[460px] rounded-2xl border p-6 shadow-2xl"
            style={{ background: "#fff", borderColor: "#e6e6e3" }}
          >
            <h3 id="crop-title" className="text-base font-bold text-slate-900">
              Position your photo
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
              The circle is what appears beside your name. The full frame is what a resume template
              will use.
            </p>

            <div
              className="relative mt-5 overflow-hidden rounded-xl bg-slate-900"
              style={{ height: STAGE_H }}
            >
              <Cropper
                image={objectUrl}
                crop={crop}
                zoom={zoom}
                minZoom={1}
                maxZoom={4}
                aspect={FRAME_W / FRAME_H}
                cropSize={{ width: FRAME_W, height: FRAME_H }}
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) => setPixels(croppedAreaPixels)}
              />

              {/* The frame is a fixed size and the cropper centres it, so the
                  circle can be placed arithmetically instead of measured. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 rounded-full ring-2 ring-white/70"
                style={{
                  width: FRAME_W,
                  height: FRAME_W,
                  top: (STAGE_H - FRAME_H) / 2,
                  transform: "translateX(-50%)",
                }}
              />
            </div>

            <label className="mt-5 flex items-center gap-3">
              <span className="text-[12.5px] font-medium text-slate-500">Zoom</span>
              <input
                type="range"
                min={1}
                max={4}
                step={0.01}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="avatar-zoom flex-1"
              />
            </label>

            {error && (
              <p role="alert" className="mt-4 text-[13px] text-red-600">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                disabled={busy}
                className="cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ borderColor: "#e6e6e3" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={busy || !pixels}
                className="cursor-pointer rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save photo"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

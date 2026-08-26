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

// Large enough to judge a face, small enough that the fallback tone does not
// become the loudest thing on the page. toneFor() exists to tell people apart
// in a list, and there is exactly one person here.
const AVATAR_SIZE = 104;

const BORDER = "#e5e7eb";
const GROUND = "#f4f5f7";

const BADGE =
  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white ring-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export default function AvatarEditor({ name, email, version, onVersionChange }) {
  const router = useRouter();
  const fileRef = useRef(null);
  const keepRef = useRef(null);

  const [file, setFile] = useState(null);
  const [objectUrl, setObjectUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState(null);
  const [confirmingRemove, setConfirmingRemove] = useState(false);
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
      setConfirmingRemove(false);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}>
        <Avatar name={name} email={email} size={AVATAR_SIZE} src={src} />

        {/* On the circle's lower corners rather than under its chin, so
            neither badge sits over a face. */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          aria-label={src ? "Change photo" : "Add a photo"}
          title={src ? "Change photo" : "Add a photo"}
          className={`${BADGE} absolute -bottom-1 left-0 bg-blue-700 hover:bg-blue-800`}
          style={{ "--tw-ring-color": GROUND }}
        >
          <PencilIcon size={15} />
        </button>

        {/* Only when there is something to remove: a live-looking control
            that does nothing is worse than no control. */}
        {src && (
          <button
            type="button"
            onClick={() => setConfirmingRemove(true)}
            disabled={busy}
            aria-label="Remove photo"
            title="Remove photo"
            className={`${BADGE} absolute right-0 -bottom-1 bg-red-500 hover:bg-red-600`}
            style={{ "--tw-ring-color": GROUND }}
          >
            <XIcon size={16} />
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        onChange={pick}
        className="sr-only"
        tabIndex={-1}
      />

      {error && !objectUrl && !confirmingRemove && (
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
            style={{ background: "#fff", borderColor: BORDER }}
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
                style={{ borderColor: BORDER }}
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

      {/* The stored photo is the only copy and there is no undo, so this one
          asks. Focus opens on the way out, not on the destructive button. */}
      {confirmingRemove && (
        <Modal
          open
          onClose={busy ? () => {} : () => setConfirmingRemove(false)}
          labelledBy="remove-photo-title"
          initialFocusRef={keepRef}
          backdropClass="backdrop:bg-black/20 backdrop:backdrop-blur-sm"
        >
          <div
            className="mx-4 w-full max-w-[400px] rounded-2xl border p-6 shadow-2xl"
            style={{ background: "#fff", borderColor: BORDER }}
          >
            <h3 id="remove-photo-title" className="text-base font-bold text-slate-900">
              Remove your photo?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              This is the only copy. Your initials come back in its place, and putting the photo
              back means uploading it again.
            </p>

            {error && (
              <p role="alert" className="mt-4 text-[13px] text-red-600">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="cursor-pointer rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Removing…" : "Remove photo"}
              </button>
              <button
                ref={keepRef}
                type="button"
                onClick={() => setConfirmingRemove(false)}
                disabled={busy}
                className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

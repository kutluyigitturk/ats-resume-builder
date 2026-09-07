"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import Modal from "@/components/ui/Modal";
import StatusToast from "@/components/ui/StatusToast";
import Avatar from "@/components/Avatar";
import { CropIcon, PencilIcon, RotateLeftIcon, RotateRightIcon, XIcon } from "@/icons";

// Kept in sync with MAX_UPLOAD_BYTES on the server. Checking here as well only
// saves the user a round trip; the server is the one that decides.
const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

// The crop frame is a fixed size rather than a ratio so the circle can be
// drawn over its top square without measuring anything at runtime.
const FRAME_W = 210;
const FRAME_H = 280;
const STAGE_H = 344;

// The reference wraps a 104px image in a 4px neutral-100 ring, so the whole
// disc measures 112. Measured, not chosen.
const AVATAR_SIZE = 104;
const RING = 4;

const BORDER = "#e5e5e5";
const MUTED = "#f5f5f5";
const GROUND = "#ffffff";

// 32px, sitting on the avatar's bottom edge - the reference's own size.
const BADGE =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const TOOL =
  "flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[12.5px] font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

// One rotated copy per quarter turn, reused for every preview frame. Rotating
// a 12-megapixel photo on each drag would turn the crop into a slideshow.
function rotatedCanvas(image, rotation) {
  const swap = rotation === 90 || rotation === 270;
  const canvas = document.createElement("canvas");
  canvas.width = swap ? image.naturalHeight : image.naturalWidth;
  canvas.height = swap ? image.naturalWidth : image.naturalHeight;

  const ctx = canvas.getContext("2d");
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

  return canvas;
}

export default function AvatarEditor({ name, email, version, onVersionChange }) {
  const router = useRouter();
  const fileRef = useRef(null);
  const imageRef = useRef(null);
  const rotatedRef = useRef({ rotation: null, canvas: null });
  const circleRef = useRef(null);
  const frameRef = useRef(null);

  const [file, setFile] = useState(null);
  const [objectUrl, setObjectUrl] = useState(null);
  const [imageReady, setImageReady] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pixels, setPixels] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const src = version ? `/api/account/avatar?v=${version}` : null;

  // An object URL is a live handle on a file; leaving them behind keeps the
  // whole image in memory for as long as the tab is open.
  useEffect(() => {
    if (!objectUrl) return;

    const image = new Image();
    image.onload = () => {
      imageRef.current = image;
      rotatedRef.current = { rotation: null, canvas: null };
      setImageReady(true);
    };
    image.src = objectUrl;

    return () => {
      URL.revokeObjectURL(objectUrl);
      imageRef.current = null;
      rotatedRef.current = { rotation: null, canvas: null };
    };
  }, [objectUrl]);

  // Both previews are the real crop, drawn from the real pixels - not a
  // scaled-down guess. This is the only thing that tells the user what the
  // circle beside their name and the frame in a resume will actually contain.
  const paint = useCallback(() => {
    const image = imageRef.current;
    if (!image || !pixels) return;

    if (rotatedRef.current.rotation !== rotation) {
      rotatedRef.current = { rotation, canvas: rotatedCanvas(image, rotation) };
    }

    const source = rotatedRef.current.canvas;

    for (const canvas of [circleRef.current, frameRef.current]) {
      if (!canvas) continue;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        source,
        pixels.x,
        pixels.y,
        pixels.width,
        // The circle shows the frame's top square; the frame shows all of it.
        canvas === circleRef.current ? pixels.width : pixels.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  }, [pixels, rotation]);

  useEffect(() => {
    if (imageReady) paint();
  }, [imageReady, paint]);

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
    reset();
    setImageReady(false);
    setObjectUrl(URL.createObjectURL(chosen));
  }

  function reset() {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setPixels(null);
  }

  function close() {
    setFile(null);
    setObjectUrl(null);
    setImageReady(false);
    setError(null);
  }

  function turn(delta) {
    setRotation((current) => (current + delta + 360) % 360);
  }

  async function save() {
    if (!file || !pixels) return;

    setBusy(true);
    setError(null);

    const body = new FormData();
    // The original file, the rectangle and the turn - not the cropped result.
    // The server has to be the one that decides what those pixels become.
    body.append("file", file);
    body.append("crop", JSON.stringify(pixels));
    body.append("rotation", String(rotation));

    try {
      const response = await fetch("/api/account/avatar", { method: "POST", body });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error ?? "Could not save that photo. Try again.");
        return;
      }

      onVersionChange(data.updatedAt);
      close();
      setToast({ message: "Profile photo updated", busy: false });
      // The account menu reads the session from the server layout, so the
      // photo in the navbar only changes once that runs again.
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  // No confirmation. Removing is one click and the toast says what happened;
  // the photo is still on the machine it was uploaded from, so the cost of
  // getting this wrong is one more upload.
  async function remove() {
    setBusy(true);
    setError(null);
    setToast({ message: "Removing your avatar", busy: true });

    try {
      const response = await fetch("/api/account/avatar", { method: "DELETE" });

      if (!response.ok) {
        setToast(null);
        setError("Could not remove that photo. Try again.");
        return;
      }

      onVersionChange(null);
      setToast({ message: "Avatar removed", busy: false });
      router.refresh();
    } catch {
      setToast(null);
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-full"
        style={{
          width: AVATAR_SIZE + RING * 2,
          height: AVATAR_SIZE + RING * 2,
          padding: RING,
          background: MUTED,
        }}
      >
        <Avatar name={name} email={email} size={AVATAR_SIZE} src={src} />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          aria-label={src ? "Change photo" : "Add a photo"}
          title={src ? "Change photo" : "Add a photo"}
          className={`${BADGE} absolute bottom-0 left-0 bg-blue-600 hover:bg-blue-700`}
        >
          <PencilIcon size={14} />
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
            className={`${BADGE} absolute right-0 bottom-0 bg-red-500 hover:bg-red-600`}
          >
            <XIcon size={14} />
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

      {error && !objectUrl && (
        <p role="alert" className="mt-4 text-[13px] text-red-600">
          {error}
        </p>
      )}

      {toast && (
        <StatusToast message={toast.message} busy={toast.busy} onDismiss={() => setToast(null)} />
      )}

      {objectUrl && (
        <Modal
          open
          onClose={busy ? () => {} : close}
          labelledBy="crop-title"
          backdropClass="backdrop:bg-black/25 backdrop:backdrop-blur-sm"
        >
          <div
            className="mx-4 max-h-[calc(100vh-3rem)] w-full max-w-[480px] overflow-y-auto rounded-2xl border p-6 shadow-2xl"
            style={{ background: "#fff", borderColor: BORDER }}
          >
            <div className="flex items-start justify-between gap-4">
              <h3
                id="crop-title"
                className="flex items-center gap-2.5 text-base font-bold text-slate-900"
              >
                <span className="text-blue-600">
                  <CropIcon size={18} />
                </span>
                Crop your avatar
              </h3>

              <button
                type="button"
                onClick={close}
                disabled={busy}
                aria-label="Close"
                className="-mt-1 -mr-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <XIcon size={17} />
              </button>
            </div>

            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
              Drag to position, then check both previews. The circle is what appears beside your
              name; the frame is what a resume template will print.
            </p>

            <div
              className="relative mt-4 overflow-hidden rounded-xl bg-slate-900"
              style={{ height: STAGE_H }}
            >
              <Cropper
                image={objectUrl}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                minZoom={1}
                maxZoom={5}
                aspect={FRAME_W / FRAME_H}
                cropSize={{ width: FRAME_W, height: FRAME_H }}
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={(_, croppedAreaPixels) => setPixels(croppedAreaPixels)}
              />

              {/* The frame is a fixed size and the cropper centres it, so the
                  circle can be placed arithmetically instead of measured. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 rounded-full ring-2 ring-blue-500/80"
                style={{
                  width: FRAME_W,
                  height: FRAME_W,
                  top: (STAGE_H - FRAME_H) / 2,
                  transform: "translateX(-50%)",
                }}
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <label className="flex flex-1 items-center gap-3">
                <span className="text-[12.5px] font-medium text-slate-500">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.01}
                  value={zoom}
                  disabled={busy}
                  aria-label="Zoom"
                  onChange={(event) => setZoom(Number(event.target.value))}
                  className="avatar-zoom flex-1"
                />
              </label>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => turn(-90)}
                disabled={busy}
                className={TOOL}
                style={{ borderColor: BORDER }}
              >
                <RotateLeftIcon size={15} />
                Left
              </button>
              <button
                type="button"
                onClick={() => turn(90)}
                disabled={busy}
                className={TOOL}
                style={{ borderColor: BORDER }}
              >
                <RotateRightIcon size={15} />
                Right
              </button>
              <button
                type="button"
                onClick={reset}
                disabled={busy || (zoom === 1 && rotation === 0 && crop.x === 0 && crop.y === 0)}
                className={`${TOOL} ml-auto`}
                style={{ borderColor: BORDER }}
              >
                Reset
              </button>
            </div>

            {/* Preview */}
            <div
              className="mt-5 flex items-center gap-5 rounded-xl border p-4"
              style={{ borderColor: BORDER, background: GROUND }}
            >
              {/* Bottom-aligned so the two labels share a line despite the
                  circle and the frame being different heights. */}
              <div className="flex items-end gap-4">
                <div className="flex flex-col items-center gap-2">
                  <canvas
                    ref={circleRef}
                    width={72}
                    height={72}
                    aria-hidden="true"
                    className="h-[72px] w-[72px] rounded-full bg-white ring-1 ring-slate-200"
                  />
                  <span className="text-[11px] font-medium text-slate-500">Avatar</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <canvas
                    ref={frameRef}
                    width={72}
                    height={96}
                    aria-hidden="true"
                    className="h-[96px] w-[72px] rounded-[4px] bg-white ring-1 ring-slate-200"
                  />
                  <span className="text-[11px] font-medium text-slate-500">Resume</span>
                </div>
              </div>

              <p className="flex-1 text-[12.5px] leading-relaxed text-slate-500">
                Both come from the same photo. Keep your face inside the circle and the frame takes
                care of itself.
              </p>
            </div>

            {error && (
              <p role="alert" className="mt-4 text-[13px] text-red-600">
                {error}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
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
                {busy ? "Saving…" : "Update profile avatar"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

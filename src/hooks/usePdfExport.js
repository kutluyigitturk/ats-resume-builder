"use client";

import { useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { buildPdfHtml } from "@/lib/pdfHtmlBuilder";
import { renameResume } from "@/lib/resumeManager";

// Handles PDF name editing, generation and download
export default function usePdfExport(cv, hideReferences, styleSettings, templateId, resumeId) {
  const [downloading, setDownloading] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const pdfStorageKey = resumeId ? `cv-${resumeId}-pdfName` : "cv-builder-pdfName";
  const [pdfName, setPdfName] = useLocalStorage(pdfStorageKey, "Untitled_CV");
  const [editingName, setEditingName] = useState(false);

  // The header edits the PDF name, but the dashboard card reads the registry.
  // Without this the same resume ends up with two different names.
  const commitPdfName = () => {
    setEditingName(false);
    const trimmed = pdfName.trim();
    if (resumeId && trimmed) renameResume(resumeId, trimmed);
  };

  // The export itself, without any of the surrounding state. Both the button
  // and the retry after signing back in run this; only what they do with the
  // outcome differs.
  const runExport = async () => {
    setDownloading(true);

    try {
      const html = buildPdfHtml(cv, hideReferences, styleSettings, templateId, pdfName);

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only the names travel; the server holds the font files.
        body: JSON.stringify({
          html,
          fonts: [styleSettings?.primaryFont, styleSettings?.secondaryFont],
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        // A tab left open for a month outlives its session. That is the one
        // failure the user can actually fix, so it gets a way to fix it
        // instead of a line of text telling them to go somewhere else.
        if (response.status === 401) return { expired: true };

        return { error: data?.error ?? "Could not build the PDF. Try again in a moment." };
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${pdfName.replace(/\s+/g, "_")}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      return { ok: true };
    } catch (error) {
      console.error("PDF download error:", error);
      return { error: "Could not reach the server. Check your connection and try again." };
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setExportError(null);
    setSessionExpired(false);

    const result = await runExport();

    if (result.expired) setSessionExpired(true);
    else if (result.error) setExportError(result.error);
  };

  // Runs after the user signs back in from the dialog. The dialog stays open
  // until the file is actually handed to the browser: closing first and
  // exporting afterwards left the user watching a dialog disappear with no
  // idea whether the thing they asked for happened.
  const retryAfterSignIn = async () => {
    const result = await runExport();

    if (result.ok) {
      setSessionExpired(false);
      return null;
    }

    return result.error ?? "Your session ended again. Try once more.";
  };

  return {
    pdfName,
    setPdfName,
    editingName,
    setEditingName,
    commitPdfName,
    downloading,
    exportError,
    sessionExpired,
    dismissSessionExpired: () => setSessionExpired(false),
    retryAfterSignIn,
    handleDownloadPDF,
  };
}

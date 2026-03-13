"use client";

import { useState } from "react";
import { buildPdfHtml } from "@/lib/pdfHtmlBuilder";

// Handles PDF name editing, generation and download
export default function usePdfExport(cv, hideReferences, styleSettings) {
  const [downloading, setDownloading] = useState(false);
  const [pdfName, setPdfName] = useState("Untitled_CV");
  const [editingName, setEditingName] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);

    try {
      const html = buildPdfHtml(cv, hideReferences, styleSettings);

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) throw new Error("PDF generation failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${pdfName.replace(/\s+/g, "_")}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error);
      alert("PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setDownloading(false);
    }
  };

  return {
    pdfName,
    setPdfName,
    editingName,
    setEditingName,
    downloading,
    handleDownloadPDF,
  };
}
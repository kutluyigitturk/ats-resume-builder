"use client";

import { useState } from "react";
import Link from "next/link";

export default function Logo({ size = "text-xl" }) {
  const [hovered, setHovered] = useState(false);

  const fontStyle = { fontFamily: "var(--font-montserrat), sans-serif" };
  const transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <Link
      href="/"
      className={`relative select-none ${size} font-extrabold tracking-tight`}
      style={fontStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* "e" — always visible, changes color */}
      <span
        style={{
          transition,
          color: hovered ? "#94a3b8" : "#0f172a",
          display: "inline-block",
        }}
      >
        e
      </span>

      {/* "as" — visible normally, collapses on hover */}
      <span
        style={{
          transition,
          display: "inline-block",
          maxWidth: hovered ? "0px" : "200px",
          opacity: hovered ? 0 : 1,
          overflow: "hidden",
          verticalAlign: "top",
          whiteSpace: "nowrap",
          color: "#0f172a",
        }}
      >
        as
      </span>

      {/* first "y" — the y in "easy", collapses on hover */}
      <span
        style={{
          transition,
          display: "inline-block",
          maxWidth: hovered ? "0px" : "200px",
          opacity: hovered ? 0 : 1,
          overflow: "hidden",
          verticalAlign: "top",
          whiteSpace: "nowrap",
          color: "#0f172a",
        }}
      >
        y
      </span>

      {/* "ATS" — always visible, changes color */}
      <span
        style={{
          transition,
          color: hovered ? "#0f172a" : "#94a3b8",
          display: "inline-block",
        }}
      >
        ATS
      </span>

      {/* second "y" — hidden normally, expands on hover */}
      <span
        style={{
          transition,
          display: "inline-block",
          maxWidth: hovered ? "200px" : "0px",
          opacity: hovered ? 1 : 0,
          overflow: "hidden",
          verticalAlign: "top",
          whiteSpace: "nowrap",
          color: "#94a3b8",
        }}
      >
        y
      </span>
    </Link>
  );
}
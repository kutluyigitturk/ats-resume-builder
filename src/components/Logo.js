"use client";

import { useState } from "react";
import Link from "next/link";
import { brand, accent } from "@/config/brand";

// Name-agnostic wordmark: the brand name in the display face, followed by a
// signal-green accent dot. Works for ANY name — swapping brand.name is enough.
export default function Logo({ size = "text-xl" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/"
      aria-label={brand.name}
      className={`group relative inline-flex select-none items-baseline ${size} font-extrabold tracking-tight`}
      style={{ fontFamily: "var(--font-sora), sans-serif", color: accent.ink }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span>{brand.name}</span>
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          marginLeft: "2px",
          color: accent.signal,
          transform: hovered ? "translateY(-2px) scale(1.25)" : "none",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        .
      </span>
    </Link>
  );
}

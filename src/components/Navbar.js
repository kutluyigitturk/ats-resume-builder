"use client";

import { useState, useEffect } from "react";

/**
 * Shared floating glassmorphism navbar.
 *
 * @param {React.ReactNode} children  — inner content (logo, links, buttons)
 * @param {string}  maxWidth          — CSS max-width value (default "1204px")
 * @param {string}  baseRingClass     — ring class when NOT scrolled (default "ring-transparent")
 * @param {string}  justify           — flexbox justify class (default "justify-between")
 */
export default function Navbar({
  children,
  maxWidth = "1204px",
  baseRingClass = "ring-transparent",
  justify = "justify-between",
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 w-full rounded-2xl transition-all duration-300 ${
        scrolled
          ? "ring-1 ring-slate-900/5 bg-white/60 backdrop-blur-3xl shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
          : `ring-1 ${baseRingClass} bg-white/40 backdrop-blur-3xl`
      }`}
      style={{ maxWidth }}
    >
      <div className={`flex h-[56px] items-center ${justify} px-8`}>
        {children}
      </div>
    </nav>
  );
}
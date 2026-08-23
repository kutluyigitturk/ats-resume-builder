#!/usr/bin/env python3
"""Builds the font files the PDF export embeds.

Why this exists: @fontsource ships each family split into disjoint subsets
(latin, latin-ext, ...). Embedding two of them in one document makes the
renderer switch fonts in the middle of a word - "Türkyiğit" becomes three
separate text runs - and a PDF text extractor then reads it as broken text.
That defeats the whole point of an ATS-friendly resume.

Merging the two subsets into a single file per face keeps every letter in one
font, so the text comes back out of the PDF exactly as it went in.

Run it after changing the font list or upgrading the @fontsource packages:

    pip3 install --user fonttools brotli
    python3 scripts/build-pdf-fonts.py

The output is committed, so a normal install and deploy needs neither Python
nor fonttools.
"""

import os
import shutil
import sys

from fontTools.merge import Merger
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, "node_modules", "@fontsource")
TARGET = os.path.join(ROOT, "assets", "pdf-fonts")

# The name in the style panel is the key; the package is where the glyphs come
# from. Arial, Georgia and Times New Roman cannot be shipped, so each is paired
# with the open family drawn to the same metrics.
PACKAGES = [
    "inter",
    "roboto",
    "open-sans",
    "montserrat",
    "carlito",
    "arimo",
    "tinos",
    "gelasio",
]

SUBSETS = ["latin", "latin-ext"]

FACES = [
    ("400", "normal"),
    ("700", "normal"),
    ("400", "italic"),
    ("700", "italic"),
]

TURKISH = "üğİışŞĞ"


def build_face(pkg, weight, style, tmp_dir):
    parts = []

    for subset in SUBSETS:
        src = os.path.join(SOURCE, pkg, "files", f"{pkg}-{subset}-{weight}-{style}.woff2")
        if not os.path.exists(src):
            raise FileNotFoundError(src)

        # The merger cannot read compressed input, so each subset is unpacked first.
        font = TTFont(src)
        font.flavor = None
        unpacked = os.path.join(tmp_dir, f"{pkg}-{subset}-{weight}-{style}.ttf")
        font.save(unpacked)
        parts.append(unpacked)

    merged = Merger().merge(parts)
    merged.flavor = "woff2"

    out = os.path.join(TARGET, f"{pkg}-{weight}-{style}.woff2")
    merged.save(out)

    # A face that cannot spell a Turkish name is not usable here.
    cmap = TTFont(out).getBestCmap()
    missing = [c for c in TURKISH if ord(c) not in cmap]

    return os.path.getsize(out), missing


def main():
    tmp_dir = os.path.join(TARGET, ".tmp")
    shutil.rmtree(TARGET, ignore_errors=True)
    os.makedirs(tmp_dir, exist_ok=True)

    total = 0
    failed = 0

    for pkg in PACKAGES:
        sizes = []

        for weight, style in FACES:
            try:
                size, missing = build_face(pkg, weight, style, tmp_dir)
            except Exception as error:  # noqa: BLE001 - report and keep going
                print(f"  {pkg} {weight} {style}: FAILED - {error}")
                failed += 1
                continue

            total += size
            sizes.append(size // 1024)

            if missing:
                print(f"  {pkg} {weight} {style}: missing {''.join(missing)}")
                failed += 1

        print(f"{pkg:<12} {len(sizes)}/4 faces  {sizes} KB")

        # The licence travels with the font it covers.
        for name in ("LICENSE", "LICENSE.md", "LICENSE.txt"):
            src = os.path.join(SOURCE, pkg, name)
            if os.path.exists(src):
                shutil.copyfile(src, os.path.join(TARGET, f"{pkg}-{name}"))
                break

    shutil.rmtree(tmp_dir, ignore_errors=True)

    print(f"\n{total // 1024} KB written to assets/pdf-fonts")

    if failed:
        print(f"{failed} face(s) failed")
        sys.exit(1)


if __name__ == "__main__":
    main()

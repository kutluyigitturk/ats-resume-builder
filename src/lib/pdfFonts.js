import { readFileSync } from "node:fs";
import path from "node:path";

// The PDF is rendered by a browser that is not allowed to make a single
// network request, and on a serverless host it starts with almost no fonts
// installed. So whatever the user picked in the style panel has to travel
// inside the HTML itself, or the file comes out in a fallback face - which is
// what used to happen to every export, Inter included.
//
// Arial, Georgia and Times New Roman cannot be shipped: they are proprietary.
// Each is paired with the open family designed to match its metrics, so line
// breaks land in the same places. `local()` comes first in every rule, so a
// machine that really has the font keeps using it and the PDF matches the
// preview exactly; the embedded copy is only reached when it is absent.
const EMBEDDED = {
  Inter: { pkg: "inter", local: "Inter" },
  Roboto: { pkg: "roboto", local: "Roboto" },
  "Open Sans": { pkg: "open-sans", local: "Open Sans" },
  Montserrat: { pkg: "montserrat", local: "Montserrat" },
  Carlito: { pkg: "carlito", local: "Carlito" },
  Arial: { pkg: "arimo", local: "Arial" },
  Georgia: { pkg: "gelasio", local: "Georgia" },
  "Times New Roman": { pkg: "tinos", local: "Times New Roman" },
};

// One file per face, holding latin and latin-ext together. Two separate
// subsets would make the renderer swap fonts mid-word on ğ, İ or ş, and a PDF
// text extractor reads that as broken text - "Türkyiğit" comes out in three
// pieces. Built by scripts/build-pdf-fonts.py; see the note there.
const FONT_DIR = path.join(process.cwd(), "assets", "pdf-fonts");

// Resumes are set in regular and bold, and both templates use italics for
// dates and subtitles.
const FACES = [
  { weight: 400, style: "normal" },
  { weight: 700, style: "normal" },
  { weight: 400, style: "italic" },
  { weight: 700, style: "italic" },
];

// Reading and base64-ing the same file on every export would be wasted work on
// a warm function, and these files never change between requests.
const cache = new Map();

function faceCss(familyName, localName, pkg, face) {
  const key = `${pkg}-${face.weight}-${face.style}`;

  if (!cache.has(key)) {
    const file = path.join(FONT_DIR, `${key}.woff2`);
    cache.set(key, readFileSync(file).toString("base64"));
  }

  // No local() here. Preferring an installed copy would hand the page whatever
  // that machine happens to have, which may not carry the extended letters -
  // the embedded file is the one we know is complete.
  return `@font-face{font-family:"${familyName}";font-style:${face.style};font-weight:${face.weight};font-display:block;src:url(data:font/woff2;base64,${cache.get(key)}) format("woff2");}`;
}

// Returns the @font-face rules for the named fonts, or "" for anything we do
// not recognise. The lookup is a whitelist on purpose: the names arrive from
// the browser, and they end up in a file path.
export function fontFaceCss(names) {
  const wanted = [...new Set((names ?? []).filter((n) => typeof n === "string"))];

  return wanted
    .filter((name) => EMBEDDED[name])
    .map((name) => {
      const { pkg, local } = EMBEDDED[name];

      try {
        return FACES.map((face) => faceCss(name, local, pkg, face)).join("");
      } catch (error) {
        // A missing font file must not cost the user their export - the PDF
        // still renders, just in a fallback face.
        console.error(`Could not embed font "${name}":`, error.message);
        return "";
      }
    })
    .join("");
}

// Puts the rules in the document's head. They have to be inside the HTML
// because the renderer cannot fetch anything.
export function withEmbeddedFonts(html, names) {
  const css = fontFaceCss(names);
  if (!css) return html;

  const style = `<style>${css}</style>`;

  return html.includes("<head>") ? html.replace("<head>", `<head>${style}`) : style + html;
}

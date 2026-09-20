import { Inter, Roboto, Open_Sans, Montserrat, Carlito, Sora, Geist } from "next/font/google";
import "./globals.css";

// The four builder families below carry latin-ext and a real italic face for
// the same reason the PDF embeds a merged file: the preview measures line
// breaks with whatever font it actually has, and a resume set in Inter whose
// ğ and ş come from a fallback wraps at different points than the PDF does.
// A synthetic oblique is not the italic the PDF prints either.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["sans-serif"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-open-sans",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

const carlito = Carlito({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-carlito",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
  variable: "--font-sora",
});

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

import { brand } from "@/config/brand";

export const metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: brand.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} ${openSans.variable} ${montserrat.variable} ${carlito.variable} ${inter.className} ${sora.variable} ${geist.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

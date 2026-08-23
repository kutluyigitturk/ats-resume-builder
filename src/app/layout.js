import { Inter, Roboto, Open_Sans, Montserrat, Carlito, Sora, Geist } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["sans-serif"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

const carlito = Carlito({
  subsets: ["latin"],
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

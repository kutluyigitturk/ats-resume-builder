import { Inter, Roboto, Open_Sans, Lato, Carlito, Sora } from "next/font/google";
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

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-lato",
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
  variable: "--font-montserrat",
});

export const metadata = {
  title: "ATS Resume Builder",
  description: "ATS-friendly resume builder with live preview and text-based PDF export",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${carlito.variable} ${inter.className} ${sora.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
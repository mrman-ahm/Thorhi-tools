import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { InquiryProvider } from "@/components/inquiry-provider";
import "./globals.css";
import "./interaction.css";
import "./v2-skeleton.css";
import "./v2-review-fixes.css";
import "./v2-identity.css";
import "./v2-sector3.css";
import "./v2-sector4.css";
import "./v2-sector5.css";
import "./v2-sector6.css";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex", display: "swap" });

export const metadata: Metadata = {
  title: { default: "THROHI Medical Tools", template: "%s | THROHI" },
  description: "Explore surgical, dental, veterinary, and beauty instruments by division, family, product name, or code.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://throhi.com"),
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${archivo.variable} ${instrument.variable} ${plex.variable}`}><body><InquiryProvider>{children}</InquiryProvider></body></html>;
}

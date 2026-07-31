import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Cormorant_Garamond,
  IBM_Plex_Mono,
  Instrument_Sans,
} from "next/font/google";
import { InquiryProvider } from "@/components/inquiry-provider";
import { MotionShell } from "@/components/motion-shell";
import { SearchCommand } from "@/components/search-command";
import "./globals.css";
import "./interaction.css";
import "./v2-skeleton.css";
import "./v2-review-fixes.css";
import "./v2-identity.css";
import "./v2-sector3.css";
import "./v2-sector4.css";
import "./v2-sector5.css";
import "./v2-sector6.css";
import "./v2-sector6-fixes.css";
import "./v2-sector7.css";
import "./v2-sector8.css";
import "./v2-sector8-fixes.css";
import "./v2-sector9a-readiness.css";
import "./v2-sector9a-fixes.css";
import "./v2-sector9b-motion.css";
import "./v2-sector9c.css";
import "./v2-sector9c-fixes.css";
import "./v2-sector9d.css";
import "./v2-sector9d-fixes.css";
import "./v2-sector9d-refinement.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});
const regal = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-regal",
  display: "swap",
});
const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const metadata: Metadata = {
  applicationName: "THROHI Medical Tools",
  title: { default: "THROHI Medical Tools", template: "%s | THROHI" },
  description:
    "Explore surgical, dental, veterinary, and beauty instruments by division, family, product name, or code.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://throhi.com"),
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf6" },
    { media: "(prefers-color-scheme: dark)", color: "#06131d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrument.variable} ${regal.variable} ${plex.variable}`}
    >
      <body>
        <InquiryProvider>
          <MotionShell>
            <SearchCommand />
            {children}
          </MotionShell>
        </InquiryProvider>
      </body>
    </html>
  );
}

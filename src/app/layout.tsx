import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { InquiryProvider } from "@/components/inquiry-provider";
import "./globals.css";
import "./interaction.css";
import "./v2-skeleton.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex", display: "swap" });

export const metadata: Metadata = {
  title: { default: "THROHI Medical Tools", template: "%s | THROHI" },
  description: "Explore surgical, dental, veterinary, and beauty instruments by division, family, product name, or code.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://throhi.com"),
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${manrope.variable} ${plex.variable}`}><body><InquiryProvider>{children}</InquiryProvider></body></html>;
}

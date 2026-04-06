import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Leano – Optimize Images Without Breaking Your Folder Structure",
  description:
    "Convert JPG/PNG to WebP/AVIF with preserved folder structure. Works in browser, CLI, and GitHub Actions.",

  openGraph: {
    title: "Leano",
    description:
      "Drop your public folder → get optimized images. CLI + GitHub Action included.",
    url: "https://leano.dev",
    siteName: "Leano",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Leano preview",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Leano",
    description: "Optimize images locally. Web app + CLI + GitHub Action.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

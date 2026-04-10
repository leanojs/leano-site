import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const defaultDescription =
  "Convert JPG and PNG files to WebP or AVIF without reorganizing a single folder. Works as a web app, CLI tool, or GitHub Action.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Leano - Image Optimization That Keeps Your Folder Structure",
    template: "%s — Leano",
  },
  description: defaultDescription,

  openGraph: {
    title: "Leano - Image Optimization That Keeps Your Folder Structure",
    description: defaultDescription,
    url: siteUrl,
    siteName: "Leano",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Leano",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Leano - Image Optimization That Keeps Your Folder Structure",
    description: defaultDescription,
    images: ["/images/og-image.png"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Leano",
  url: siteUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

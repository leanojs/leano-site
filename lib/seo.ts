import type { Metadata } from "next";

export const siteUrl = "https://leano.dev";

const ogImage = {
  url: "/images/og-image.png",
  width: 1200,
  height: 630,
  alt: "Leano",
} as const;

/**
 * Per-route metadata with canonical URL and social cards.
 * `title` is the short segment; root layout's template appends " — Leano".
 */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: `/${string}`;
}): Metadata {
  const url = new URL(opts.path, siteUrl).toString();
  const fullTitle = `${opts.title} — Leano`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: fullTitle,
      description: opts.description,
      url,
      siteName: "Leano",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      images: [ogImage.url],
    },
  };
}

<div align="center">

<a href="https://leano.dev">
  <img src="https://raw.githubusercontent.com/meowbeen/webpocalypse/main/public/images/og-image.png" alt="Leano — Image Optimization That Keeps Your Folder Structure" width="100%" />
</a>

<br /><br />

[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Powered by sharp](https://img.shields.io/badge/powered%20by-sharp-99cc00?style=flat-square)](https://sharp.pixelplumbing.com)
[![Deploy on Vercel](https://img.shields.io/badge/deploy-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com)

**High‑impact image optimization for developers.**  
Drop a folder. Get a ZIP. Ship a faster site. That's it.

[**leano.dev →**](https://leano.dev)

</div>

---

## What is Leano?

Leano turns a folder of images into a highly compressed, production‑ready asset bundle in a single pass. Drop a directory of JPG/PNG files, tune quality and output format, and download a ZIP with the converted images — folder structure fully intact.

Built to be **fast, transparent, and developer‑friendly**. No accounts. No cloud storage. No drama.

---

## Features

- **Folder‑aware uploads** — drag & drop a whole directory; original structure is preserved in the output ZIP
- **Multiple output formats** — `WebP`, `AVIF`, or **both** for maximum browser coverage
- **Quality control** — per‑run quality slider (50–100, default 80)
- **Smart concurrency** — bounded to avoid CPU saturation; AVIF tuned for fast encodes without visible quality loss
- **Aggregate stats** — total files, original vs new size, overall savings % at a glance
- **Per‑file results table** — savings per image, highlighted rows for ≥ 50% wins, error tooltips for anything that went sideways
- **Production‑ready ZIP** — includes original `.webp` files unchanged (no double‑encoding, we're not monsters)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn‑style primitives |
| Icons | Lucide |
| Image processing | [`sharp`](https://github.com/lovell/sharp) (WebP / AVIF) |
| Runtime | Node.js |
| Analytics | Vercel Analytics |

---

## Getting Started

**Prerequisites:** Node.js LTS, and whatever package manager you have a personality about.

```bash
# install
npm install

# run dev server
npm run dev
```

Open `http://localhost:3000` and you're in.

---

## Usage

1. **Drop a folder** — drag & drop a directory of JPG/JPEG/PNG images onto the dropzone
2. **Configure** — set quality (50–100) and pick `WebP`, `AVIF`, or `Both`
3. **Convert** — hit **Convert** and watch the progress bar do its thing
4. **Review** — check aggregate stats and the per‑file table; hover failed rows for error details
5. **Download** — grab the ZIP and drop the optimized assets straight into your project

---

## Per‑file Results Table

| Column | Details |
|---|---|
| Filename | Relative path, monospace font, tooltip on truncation |
| Original / New Size | Human‑readable (B / KB / MB), right‑aligned `tabular-nums` |
| Savings % | ≥ 50% → emerald highlight · grew in size → amber · failed → red badge |

Scrollable with a sticky header — handles large folders without breaking the layout.

---

## API

### `POST /api/convert`

**Body** (`multipart/form-data`):

| Field | Type | Description |
|---|---|---|
| `file_{index}` | File blob | Image file |
| `path_{index}` | string | Relative path |
| `quality` | integer | 50–100 |
| `outputFormat` | string | `"webp"` \| `"avif"` \| `"both"` |

**Response** (`ConversionResponse`):

```ts
{
  success: boolean;
  message: string;
  zipBuffer?: string;         // base64-encoded zip
  stats?: {
    totalFiles: number;
    totalOriginalSize: number;    // bytes
    totalConvertedSize: number;   // bytes
    savedBytes: number;
    savedPercentage: number;      // 0–100
  };
  fileResults?: Array<{
    originalPath: string;
    convertedPath: string;
    originalSize: number;
    convertedSize: number;
    success: boolean;
    error?: string;
  }>;
}
```

**Limits:** 50 MB max total upload per run (configurable in the API route).

---

## Roadmap

- [ ] CLI mode for headless CI/CD pipelines
- [ ] Per‑folder aggregate stats
- [ ] Toggle to skip already‑optimized assets
- [ ] GitHub Action

---

## License

MIT — use it, tweak it, ship faster sites.

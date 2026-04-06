## Leano

### High‑impact image optimization for developers

Leano is a Next.js tool that turns a folder of images into a highly compressed, production-ready asset bundle in a single pass. Drop a directory of JPG/PNG files, tune quality and output formats, and download a ZIP with the converted images while preserving your original folder structure.

It’s built to be **fast, transparent, and developer‑friendly**.

---

### Features

- **Folder‑aware uploads**
  - Drag & drop a whole folder of images
  - Original directory structure is preserved in the output ZIP

- **Multiple output formats**
  - `WebP`, `AVIF`, or **both** for maximum browser coverage
  - Per-run quality slider (50–100, default 80)

- **Smart, safe performance**
  - Bounded concurrency to avoid CPU saturation
  - AVIF conversion tuned for much faster encodes with negligible web quality loss

- **Aggregate stats at a glance**
  - Total images converted
  - Original vs new total size (human‑readable)
  - Overall percentage space savings

- **Per-file results table**
  - Relative filename/path
  - Original size and converted size (B / KB / MB)
  - Savings % per image (client‑calculated)
  - Subtle highlights for high‑savings rows (e.g. ≥ 50%)
  - Clear indication of failures with error tooltips
  - Scrollable table to handle very large folders gracefully

- **Production‑ready ZIP**
  - Downloadable ZIP of converted assets
  - Includes original `.webp` files unchanged, if present, to avoid double‑encoding

---

### Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI**:
  - Tailwind CSS
  - Shadcn-style UI primitives (`Card`, `Table`, `Button`, etc.)
  - Lucide icons
- **Image processing**: [`sharp`](https://github.com/lovell/sharp) (WebP/AVIF encoding)
- **Runtime**: Node.js (for server‑side image conversion)

---

### Getting Started

#### Prerequisites

- Node.js (LTS recommended)
- pnpm / npm / yarn (examples use `npm`)

#### Install dependencies

```bash
npm install
```

#### Run the development server

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

### Usage

1. **Drop a folder of images**
   - Use the dropzone to drag & drop a directory containing JPG/JPEG/PNG images.
   - The app automatically filters to supported image formats.

2. **Configure conversion**
   - Adjust the **Quality** slider (50–100).
   - Choose the **Output format**:
     - `WebP`
     - `AVIF`
     - `Both` (generates both formats for each input file)

3. **Convert**
   - Click **Convert**.
   - Watch the progress indicator as your folder uploads, converts, and zips.

4. **Inspect results**
   - Review **aggregate stats**:
     - Total files converted
     - Original vs new total size
     - Overall space saved (%)
   - Inspect the **per‑file results table**:
     - Sort visually by high savings (highlighted rows)
     - Check any failed conversions and hover over the badge for error details

5. **Download assets**
   - Click **Download ZIP** to get your optimized asset bundle.
   - Unzip and drop the optimized assets into your project while preserving paths.

---

### Per-file Results Table Details

The per‑file results table is designed to give you **transparent, granular insight** into conversion impact:

- **Filename**
  - Shows the relative path (e.g. `images/home/hero.webp`)
  - Uses a monospace font and truncation with a tooltip for long paths

- **Original Size / New Size**
  - Human‑readable sizes (B / KB / MB)
  - Right‑aligned with `tabular-nums` for easy scanning

- **Savings %**
  - Calculated on the client from original and converted byte sizes
  - **≥ 50%**: subtle emerald highlight
  - **Negative savings** (file grew): amber highlight with `+X.Y% larger` label
  - **Failed conversions**: red `Failed` badge with error tooltip

- **Scalability**
  - Scrollable container with sticky header
  - Handles large folders without collapsing the layout

---

### API Overview

#### `POST /api/convert`

- **Body**: `multipart/form-data`
  - `file_{index}`: file blobs
  - `path_{index}`: relative paths
  - `quality`: integer (50–100)
  - `outputFormat`: `"webp" | "avif" | "both"`

- **Response** (`ConversionResponse`):

```ts
{
  success: boolean;
  message: string;
  zipBuffer?: string;   // base64-encoded zip
  stats?: {
    totalFiles: number;
    totalOriginalSize: number;   // bytes
    totalConvertedSize: number;  // bytes
    savedBytes: number;          // bytes
    savedPercentage: number;     // 0–100
  };
  fileResults?: Array<{
    originalPath: string;
    convertedPath: string;
    originalSize: number;   // bytes
    convertedSize: number;  // bytes
    success: boolean;
    error?: string;
  }>;
}
```

---

### Development Notes

- **Safety & limits**
  - 50 MB max total upload size per run (configurable in the API route).
  - Conversion is batched with tuned concurrency to keep the server responsive, especially for AVIF.

- **Extensibility ideas**
  - Add CLI mode to run headless in CI/CD.
  - Surface additional metrics (e.g., per‑folder aggregates).
  - Toggle to exclude already optimized assets.

---

### License

MIT. Use it, tweak it, and ship faster sites.

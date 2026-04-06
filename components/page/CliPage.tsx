"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Copy,
  Check,
  ArrowRight,
  Package,
  Settings2,
  FileCode2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/layout/SiteLayout";
import {
  FadeUp,
  HeroReveal,
  Stagger,
  StaggerItem,
} from "@/components/ui/animate";

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  void lang;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group bg-foreground/5 px-4 py-3 border border-border/60 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed">
      <pre className="text-foreground/90 whitespace-pre pr-8">{code}</pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-background/60 hover:bg-background border border-border/40 text-muted-foreground hover:text-foreground"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-500" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <FadeUp>
      <section className="bg-card/70 backdrop-blur-sm p-6 sm:p-8 border border-border/50 rounded-3xl">
        <div className="flex items-center gap-3 mb-5">
          <span className="inline-flex justify-center items-center bg-primary/10 rounded-full w-8 h-8">
            <Icon className="w-4 h-4 text-primary" />
          </span>
          <h2 className="font-semibold text-base">{title}</h2>
        </div>
        {children}
      </section>
    </FadeUp>
  );
}

const cliFlags = [
  {
    flag: "-f, --format <format>",
    default: "webp",
    description: "Output format: webp | avif | both",
  },
  {
    flag: "-q, --quality <number>",
    default: "80",
    description: "Compression quality 1–100",
  },
  {
    flag: "--lossless",
    default: "false",
    description: "Enable lossless compression",
  },
  {
    flag: "--max-width <px>",
    default: "—",
    description: "Maximum output width (no upscaling)",
  },
  {
    flag: "--max-height <px>",
    default: "—",
    description: "Maximum output height (no upscaling)",
  },
  {
    flag: "-o, --out <path>",
    default: "<input>-optimized",
    description: "Output directory",
  },
  {
    flag: "--in-place",
    default: "false",
    description: "Replace source directory safely via temp dir",
  },
  {
    flag: "--json",
    default: "false",
    description: "Output structured JSON results",
  },
];

const examples = [
  { label: "the default — WebP at quality 80", code: "leano ./images" },
  {
    label: "both WebP and AVIF in one go",
    code: "leano ./images --format both --quality 75",
  },
  {
    label: "resize while converting (great for hero images)",
    code: "leano ./public/photos --format webp --max-width 1920 --quality 85",
  },
  {
    label: "lossless WebP — perfect quality, still smaller",
    code: "leano ./assets --format webp --lossless",
  },
  {
    label: "output to a different directory",
    code: "leano ./src/images --format avif --out ./dist/images",
  },
  {
    label: "replace in-place — safe, rolls back on failure",
    code: "leano ./public --format webp --in-place",
  },
];

const outputExample = `leano v1.0.0
  Input:   ./public/images
  Output:  ./public/images-optimized
  Format:  both  Quality: 80
  Files:   42 images found → 84 outputs

File                                   Original    Converted   Savings
───────────────────────────────────────────────────────────────────────
  hero.webp                               1.2 MB       149 KB      88%
  hero.avif                               1.2 MB       218 KB      82%
  icons/logo.webp                          45 KB        12 KB      73%
  icons/logo.avif                          45 KB         9 KB      80%
───────────────────────────────────────────────────────────────────────

✔ 84 files converted
✔ 56.2 MB → 9.1 MB  (84% saved)`;

export function CliPage() {
  return (
    <main className="relative bg-background min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none"
        style={{
          backgroundImage: `url(/images/background.webp)`,
          transform: "scale(1.4)",
          transformOrigin: "top center",
        }}
        aria-hidden="true"
      />

      <SiteLayout>
        <div className="flex-1 px-4 sm:px-6 py-16 md:py-24">
          <div className="space-y-6 mx-auto max-w-3xl">
            {/* Hero */}
            <div className="mb-10 text-center">
              <HeroReveal delay={0.05}>
                <p className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                  CLI Tool
                </p>
              </HeroReveal>

              <HeroReveal delay={0.15}>
                <h1 className="mb-4 font-bold text-4xl sm:text-5xl tracking-tight">
                  leano
                </h1>
              </HeroReveal>

              <HeroReveal delay={0.25}>
                <p className="mx-auto max-w-xl text-muted-foreground text-base">
                  for when you&apos;d rather stay in the terminal than open
                  another browser tab. one command, whole directory, done.
                </p>
              </HeroReveal>

              <HeroReveal delay={0.35}>
                <div className="mx-auto mt-6 max-w-xl">
                  <CodeBlock code="npx leano ./public --format webp --quality 80" />
                </div>
              </HeroReveal>
            </div>

            {/* Install */}
            <Section icon={Package} title="install">
              <div className="space-y-3">
                <div>
                  <p className="mb-1.5 font-medium text-muted-foreground text-xs">
                    global install (so you can run it anywhere)
                  </p>
                  <CodeBlock code="npm install -g leano" />
                </div>
                <div>
                  <p className="mb-1.5 font-medium text-muted-foreground text-xs">
                    or just npx it — no install needed
                  </p>
                  <CodeBlock code="npx leano <input> [options]" />
                </div>
              </div>
              <p className="mt-4 text-muted-foreground text-xs">
                requires Node ≥ 18. works on linux, mac, windows. sharp ships
                pre-built binaries so there&apos;s no native compile step.
              </p>
            </Section>

            {/* Options */}
            <Section icon={Settings2} title="options">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border/50 border-b">
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        Flag
                      </th>
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        Default
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground text-xs text-left">
                        What it does
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {cliFlags.map((row) => (
                      <tr key={row.flag}>
                        <td className="py-2.5 pr-4 align-top">
                          <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs whitespace-nowrap">
                            {row.flag}
                          </code>
                        </td>
                        <td className="py-2.5 pr-4 text-muted-foreground text-xs align-top">
                          {row.default}
                        </td>
                        <td className="py-2.5 text-muted-foreground text-xs align-top">
                          {row.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Examples */}
            <Section icon={FileCode2} title="examples">
              <Stagger className="space-y-4">
                {examples.map((ex) => (
                  <StaggerItem key={ex.label}>
                    <p className="mb-1.5 font-medium text-muted-foreground text-xs">
                      {ex.label}
                    </p>
                    <CodeBlock code={ex.code} />
                  </StaggerItem>
                ))}
              </Stagger>
            </Section>

            {/* Output */}
            <Section icon={Copy} title="what the output looks like">
              <CodeBlock code={outputExample} />
            </Section>

            {/* Behavior */}
            <Section icon={Settings2} title="a few things worth knowing">
              <div className="mb-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border/50 border-b">
                      <th className="pr-6 pb-2 font-medium text-muted-foreground text-xs text-left">
                        Extension
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground text-xs text-left">
                        What happens
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {[
                      { ext: ".jpg / .jpeg", action: "re-encoded via sharp" },
                      { ext: ".png", action: "re-encoded via sharp" },
                      {
                        ext: ".webp / .avif",
                        action: "copied as-is — no re-encoding",
                      },
                    ].map((row) => (
                      <tr key={row.ext}>
                        <td className="py-2.5 pr-6 align-top">
                          <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
                            {row.ext}
                          </code>
                        </td>
                        <td className="py-2.5 text-muted-foreground text-xs align-top">
                          {row.action}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-xs">
                  --in-place is actually safe
                </p>
                <ol className="space-y-1 text-muted-foreground text-xs list-decimal list-inside">
                  <li>everything converts to a temp directory first.</li>
                  <li>
                    only if every single file succeeds, the source gets swapped
                    out.
                  </li>
                  <li>
                    if anything fails, your originals are completely untouched.
                    temp dir is cleaned up.
                  </li>
                </ol>
              </div>
            </Section>

            {/* Also check out */}
            <FadeUp>
              <div className="bg-card/60 backdrop-blur-sm p-5 border border-border/40 rounded-2xl">
                <p className="mb-2 font-medium text-sm">
                  want this to run automatically on every PR?
                </p>
                <p className="mb-4 text-muted-foreground text-sm">
                  the GitHub workflow does exactly that — zero config after
                  setup.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  asChild
                >
                  <Link href="/workflow">
                    View Workflow docs
                    <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </FadeUp>
          </div>
        </div>
      </SiteLayout>
    </main>
  );
}

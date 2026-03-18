import Link from "next/link";
import {
  Terminal,
  Copy,
  ArrowRight,
  Package,
  Settings2,
  FileCode2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import {
  FadeUp,
  HeroReveal,
  Stagger,
  StaggerItem,
} from "@/components/ui/animate";

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  void lang;
  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 bg-foreground/5 px-4 py-3 font-mono text-sm leading-relaxed">
      <pre className="whitespace-pre text-foreground/90">{code}</pre>
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
      <section className="rounded-3xl border border-border/50 bg-card/70 p-6 backdrop-blur-sm sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </span>
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        {children}
      </section>
    </FadeUp>
  );
}

const cliFlags = [
  { flag: "-f, --format <format>", default: "webp", description: "Output format: webp | avif | both" },
  { flag: "-q, --quality <number>", default: "80", description: "Compression quality 1–100" },
  { flag: "--lossless", default: "false", description: "Enable lossless compression" },
  { flag: "--max-width <px>", default: "—", description: "Maximum output width (no upscaling)" },
  { flag: "--max-height <px>", default: "—", description: "Maximum output height (no upscaling)" },
  { flag: "-o, --out <path>", default: "<input>-optimized", description: "Output directory" },
  { flag: "--in-place", default: "false", description: "Replace source directory safely via temp dir" },
  { flag: "--json", default: "false", description: "Output structured JSON results" },
];

const examples = [
  { label: "the default — WebP at quality 80", code: "webpocalypse ./images" },
  { label: "both WebP and AVIF in one go", code: "webpocalypse ./images --format both --quality 75" },
  { label: "resize while converting (great for hero images)", code: "webpocalypse ./public/photos --format webp --max-width 1920 --quality 85" },
  { label: "lossless WebP — perfect quality, still smaller", code: "webpocalypse ./assets --format webp --lossless" },
  { label: "output to a different directory", code: "webpocalypse ./src/images --format avif --out ./dist/images" },
  { label: "replace in-place — safe, rolls back on failure", code: "webpocalypse ./public --format webp --in-place" },
];

const outputExample = `webpocalypse v1.0.0
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
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-60"
        style={{ backgroundImage: `url(/images/background.jpg)` }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <div className="flex-1 px-4 sm:px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Hero */}
            <div className="mb-10 text-center">
              <HeroReveal delay={0.05}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  CLI Tool
                </p>
              </HeroReveal>

              <HeroReveal delay={0.15}>
                <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                  webpocalypse
                </h1>
              </HeroReveal>

              <HeroReveal delay={0.25}>
                <p className="mx-auto max-w-xl text-base text-muted-foreground">
                  for when you&apos;d rather stay in the terminal than open
                  another browser tab. one command, whole directory, done.
                </p>
              </HeroReveal>

              <HeroReveal delay={0.35}>
                <div className="mx-auto mt-6 max-w-xl">
                  <CodeBlock code="npx webpocalypse ./public --format webp --quality 80" />
                </div>
              </HeroReveal>
            </div>

            {/* Install */}
            <Section icon={Package} title="install">
              <div className="space-y-3">
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                    global install (so you can run it anywhere)
                  </p>
                  <CodeBlock code="npm install -g webpocalypse" />
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                    or just npx it — no install needed
                  </p>
                  <CodeBlock code="npx webpocalypse <input> [options]" />
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                requires Node ≥ 18. works on linux, mac, windows.
                sharp ships pre-built binaries so there&apos;s no native compile step.
              </p>
            </Section>

            {/* Options */}
            <Section icon={Settings2} title="options">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Flag</th>
                      <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Default</th>
                      <th className="pb-2 text-left text-xs font-medium text-muted-foreground">What it does</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {cliFlags.map((row) => (
                      <tr key={row.flag}>
                        <td className="py-2.5 pr-4 align-top">
                          <code className="whitespace-nowrap rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                            {row.flag}
                          </code>
                        </td>
                        <td className="py-2.5 pr-4 align-top text-xs text-muted-foreground">{row.default}</td>
                        <td className="py-2.5 align-top text-xs text-muted-foreground">{row.description}</td>
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
                    <p className="mb-1.5 text-xs font-medium text-muted-foreground">{ex.label}</p>
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
                    <tr className="border-b border-border/50">
                      <th className="pb-2 pr-6 text-left text-xs font-medium text-muted-foreground">Extension</th>
                      <th className="pb-2 text-left text-xs font-medium text-muted-foreground">What happens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {[
                      { ext: ".jpg / .jpeg", action: "re-encoded via sharp" },
                      { ext: ".png", action: "re-encoded via sharp" },
                      { ext: ".webp / .avif", action: "copied as-is — no re-encoding" },
                    ].map((row) => (
                      <tr key={row.ext}>
                        <td className="py-2.5 pr-6 align-top">
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{row.ext}</code>
                        </td>
                        <td className="py-2.5 align-top text-xs text-muted-foreground">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold">--in-place is actually safe</p>
                <ol className="list-inside list-decimal space-y-1 text-xs text-muted-foreground">
                  <li>everything converts to a temp directory first.</li>
                  <li>only if every single file succeeds, the source gets swapped out.</li>
                  <li>if anything fails, your originals are completely untouched. temp dir is cleaned up.</li>
                </ol>
              </div>
            </Section>

            {/* Also check out */}
            <FadeUp>
              <div className="rounded-2xl border border-border/40 bg-card/60 p-5 backdrop-blur-sm">
                <p className="mb-2 text-sm font-medium">want this to run automatically on every PR?</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  the GitHub workflow does exactly that — zero config after setup.
                </p>
                <Button size="sm" variant="outline" className="rounded-full" asChild>
                  <Link href="/workflow">
                    View Workflow docs
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </main>
  );
}

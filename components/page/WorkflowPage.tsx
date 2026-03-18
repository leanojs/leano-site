import Link from "next/link";
import { GitBranch, Zap, Settings2, FileCode2, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import {
  FadeUp,
  HeroReveal,
  Stagger,
  StaggerItem,
} from "@/components/ui/animate";

function CodeBlock({ code, lang = "yaml" }: { code: string; lang?: string }) {
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

const inputs = [
  { name: "format", default: "webp", description: "Output format: webp | avif | both" },
  { name: "quality", default: "80", description: "Compression quality (1–100)" },
  { name: "lossless", default: "false", description: "Enable lossless compression" },
  { name: "max-width", default: "—", description: "Maximum output width in pixels" },
  { name: "max-height", default: "—", description: "Maximum output height in pixels" },
  { name: "paths", default: ".", description: "Comma-separated directories to process" },
  { name: "changed-only", default: "true", description: "Only process images changed in this PR or push" },
  { name: "commit-back", default: "false", description: "Push a bot commit with optimized images back to the branch" },
  { name: "commit-message", default: "chore: optimize images [webpocalypse]", description: "Commit message when commit-back is true" },
  { name: "token", default: "${{ github.token }}", description: "GitHub token — only needed when commit-back: true" },
];

const outputs = [
  { name: "files-converted", description: "Number of image files converted" },
  { name: "bytes-saved", description: "Total bytes saved" },
  { name: "savings-percent", description: "Overall size reduction as a percentage" },
];

const quickStartYaml = `# .github/workflows/optimize-images.yml
name: Optimize Images

on:
  pull_request:
    paths:
      - '**.jpg'
      - '**.jpeg'
      - '**.png'
  push:
    branches: [main]
    paths:
      - '**.jpg'
      - '**.jpeg'
      - '**.png'

jobs:
  optimize:
    runs-on: ubuntu-latest
    permissions:
      contents: read

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Optimize images
        uses: your-handle/webpocalypse-action@v1
        with:
          format: webp
          quality: 82`;

const commitBackYaml = `jobs:
  optimize:
    permissions:
      contents: write   # needed for commit-back

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - uses: your-handle/webpocalypse-action@v1
        with:
          format: webp
          quality: 80
          changed-only: true
          commit-back: true
          token: \${{ secrets.GITHUB_TOKEN }}`;

const outputsYaml = `- uses: actions/checkout@v4
  with:
    fetch-depth: 2

- name: Optimize images
  id: optimize
  uses: your-handle/webpocalypse-action@v1

- name: Print savings
  run: |
    echo "Converted: \${{ steps.optimize.outputs.files-converted }} files"
    echo "Saved:     \${{ steps.optimize.outputs.bytes-saved }} bytes"
    echo "Savings:   \${{ steps.optimize.outputs.savings-percent }}%"`;

const fullScanYaml = `- uses: your-handle/webpocalypse-action@v1
  with:
    format: avif
    quality: 70
    paths: public/images,assets
    changed-only: false
    commit-back: true
    commit-message: 'chore(images): convert to AVIF'
    token: \${{ secrets.GITHUB_TOKEN }}`;

const whatItDoes = [
  "detects which image files (.jpg, .jpeg, .png, .webp) were added or changed in the PR.",
  "converts them in-place using npx webpocalypse — no Docker, no pre-installed tools.",
  "reports savings via action outputs and summary logs.",
  "optionally commits the optimized images back to your branch. you can just merge.",
];

export function WorkflowPage() {
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
                  GitHub Action
                </p>
              </HeroReveal>

              <HeroReveal delay={0.15}>
                <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                  set it up once.
                  <br />
                  forget about it.
                </h1>
              </HeroReveal>

              <HeroReveal delay={0.25}>
                <p className="mx-auto max-w-xl text-base text-muted-foreground">
                  a GitHub Action that automatically optimizes images on every
                  PR. detects changed files, converts in-place, commits them
                  back if you want. you literally don&apos;t have to think about
                  images again.
                </p>
              </HeroReveal>
            </div>

            {/* What it does */}
            <Section icon={Zap} title="what it does">
              <Stagger className="space-y-3">
                {whatItDoes.map((step, i) => (
                  <StaggerItem key={i}>
                    <div className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {i + 1}
                      </span>
                      {step}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Section>

            {/* Quick start */}
            <Section icon={FileCode2} title="quick start — copy and paste this">
              <CodeBlock code={quickStartYaml} lang="yaml" />
            </Section>

            {/* Inputs */}
            <Section icon={Settings2} title="inputs">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Input</th>
                      <th className="pb-2 pr-4 text-left text-xs font-medium text-muted-foreground">Default</th>
                      <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {inputs.map((row) => (
                      <tr key={row.name}>
                        <td className="py-2.5 pr-4 align-top">
                          <code className="whitespace-nowrap rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                            {row.name}
                          </code>
                        </td>
                        <td className="py-2.5 pr-4 align-top text-xs text-muted-foreground">
                          <code className="rounded bg-muted/60 px-1 py-0.5 text-xs font-mono">
                            {row.default}
                          </code>
                        </td>
                        <td className="py-2.5 align-top text-xs text-muted-foreground">
                          {row.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Outputs */}
            <Section icon={GitBranch} title="outputs">
              <div className="mb-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="pb-2 pr-6 text-left text-xs font-medium text-muted-foreground">Output</th>
                      <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {outputs.map((row) => (
                      <tr key={row.name}>
                        <td className="py-2.5 pr-6 align-top">
                          <code className="whitespace-nowrap rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                            {row.name}
                          </code>
                        </td>
                        <td className="py-2.5 align-top text-xs text-muted-foreground">
                          {row.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">using the outputs:</p>
              <CodeBlock code={outputsYaml} lang="yaml" />
            </Section>

            {/* Examples */}
            <Section icon={FileCode2} title="more examples">
              <Stagger className="space-y-6">
                <StaggerItem>
                  <p className="mb-2 text-xs font-semibold">convert changed files and commit them back</p>
                  <CodeBlock code={commitBackYaml} lang="yaml" />
                </StaggerItem>
                <StaggerItem>
                  <p className="mb-2 text-xs font-semibold">scan a full directory on every push</p>
                  <CodeBlock code={fullScanYaml} lang="yaml" />
                </StaggerItem>
              </Stagger>
            </Section>

            {/* Notes */}
            <Section icon={Info} title="stuff worth knowing">
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="mb-1 font-semibold text-foreground">use fetch-depth: 2, not 0</p>
                  <p>
                    push events diff{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">HEAD~1..HEAD</code>,
                    which needs exactly 2 commits. full history (depth 0) can
                    add 30–60s on large repos. not worth it.
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-foreground">commit-back defaults to false</p>
                  <p>
                    when you turn it on, a bot commit appears in your PR history. add a path filter on your{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">on:</code> trigger
                    so the bot commit doesn&apos;t re-trigger the action and loop forever.
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-foreground">paths works differently depending on changed-only</p>
                  <p>
                    <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">changed-only: true</code>{" "}
                    — paths is a scope filter. only changed images inside those dirs are processed.
                    <br />
                    <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">changed-only: false</code>{" "}
                    — paths is the scan target. full recursive convert of everything there.
                  </p>
                </div>
              </div>
            </Section>

            {/* Also check out */}
            <FadeUp>
              <div className="rounded-2xl border border-border/40 bg-card/60 p-5 backdrop-blur-sm">
                <p className="mb-2 text-sm font-medium">prefer running it yourself?</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  the CLI does the same thing from your terminal — no CI required.
                </p>
                <Button size="sm" variant="outline" className="rounded-full" asChild>
                  <Link href="/cli">
                    View CLI docs
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

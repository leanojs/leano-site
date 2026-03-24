"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Puzzle,
  FolderTree,
  Command,
  Bell,
  ScrollText,
  Settings2,
  Package,
  Terminal,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/layout/SiteLayout";
import {
  FadeUp,
  HeroReveal,
  Stagger,
  StaggerItem,
} from "@/components/ui/animate";

/** Update to your listing URL when you have a stable marketplace item id */
const MARKETPLACE_SEARCH =
  "https://marketplace.visualstudio.com/search?term=webpocalypse-vscode&target=VSCode";
const OPEN_VSX_SEARCH =
  "https://open-vsx.org/?search=webpocalypse-vscode&sortBy=relevance&sortOrder=desc";

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

const whatItDoes = [
  {
    icon: FolderTree,
    text: "Explorer — right-click a .jpg / .jpeg / .png for Optimize Image, or a folder for Optimize Folder.",
  },
  {
    icon: Command,
    text: "Command palette — Webpocalypse: Optimize Images opens a folder picker (same as a folder right-click).",
  },
  {
    icon: Bell,
    text: "Progress — a short notification, then a summary with file count and approximate total savings from CLI --json.",
  },
  {
    icon: ScrollText,
    text: "Logs — full CLI stdout/stderr in the Webpocalypse output channel.",
  },
];

const requirements = [
  {
    req: "VS Code (or compatible editor)",
    notes: "Engine ^1.85.0 — see engines in the extension package.json.",
  },
  {
    req: "Node.js + npm",
    notes: "Used for npx webpocalypse. Node ≥ 18 matches the CLI.",
  },
  {
    req: "Network (first run)",
    notes: "npx may download the package; npx --yes avoids interactive prompts.",
  },
];

const settingsRows = [
  {
    setting: "webpocalypse.quality",
    default: "80",
    description: "Compression quality 1–100 (-q).",
  },
  {
    setting: "webpocalypse.format",
    default: "webp",
    description: "webp | avif | both (-f).",
  },
  {
    setting: "webpocalypse.maxWidth",
    default: "—",
    description: "Optional max width in px (--max-width).",
  },
  {
    setting: "webpocalypse.maxHeight",
    default: "—",
    description: "Optional max height in px (--max-height).",
  },
  {
    setting: "webpocalypse.lossless",
    default: "false",
    description: "Lossless compression (--lossless).",
  },
  {
    setting: "webpocalypse.inPlace",
    default: "false",
    description:
      "Folder runs: write into the same directory; single-file: merge from in-place temp output.",
  },
];

const cliInvoke = `npx --yes webpocalypse <path> --json [options…]`;

const devCompile = `npm install
npm run compile    # emit out/
npm run watch      # tsc --watch`;

const devVsix = `npm install -g @vscode/vsce   # once
npm run compile
vsce package                    # produces .vsix`;

export function VsCodePage() {
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
            <div className="mb-10 text-center">
              <HeroReveal delay={0.05}>
                <p className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                  VS Code &amp; Cursor
                </p>
              </HeroReveal>

              <HeroReveal delay={0.15}>
                <h1 className="mb-4 font-bold text-4xl sm:text-5xl tracking-tight">
                  webpocalypse-vscode
                </h1>
              </HeroReveal>

              <HeroReveal delay={0.25}>
                <p className="mx-auto max-w-xl text-muted-foreground text-base">
                  Optimize JPG and PNG images inside your editor using the same{" "}
                  <a
                    href="https://www.npmjs.com/package/webpocalypse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
                  >
                    webpocalypse
                  </a>{" "}
                  CLI — right-click in the Explorer, or run a command from the
                  palette. Fully local: no server, no API keys.
                </p>
              </HeroReveal>

              <HeroReveal delay={0.35}>
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  <Button size="sm" className="rounded-full" asChild>
                    <a
                      href={MARKETPLACE_SEARCH}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visual Studio Marketplace
                      <ExternalLink className="ml-1.5 w-3.5 h-3.5 opacity-80" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full" asChild>
                    <a
                      href={OPEN_VSX_SEARCH}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open VSX
                      <ExternalLink className="ml-1.5 w-3.5 h-3.5 opacity-80" />
                    </a>
                  </Button>
                </div>
                <p className="mt-3 text-muted-foreground text-xs max-w-md mx-auto">
                  Same toolchain as the CLI and GitHub Action — batch conversion
                  with sharp, optional WebP / AVIF, resize caps, and preserved
                  directory layout. Works on Linux, macOS, and Windows.
                </p>
              </HeroReveal>
            </div>

            <Section icon={Puzzle} title="what it does">
              <Stagger className="space-y-4">
                {whatItDoes.map((item, i) => {
                  const ItemIcon = item.icon;
                  return (
                  <StaggerItem key={i}>
                    <div className="flex items-start gap-3 text-muted-foreground text-sm">
                      <span className="inline-flex justify-center items-center bg-primary/10 mt-0.5 rounded-full w-8 h-8 shrink-0">
                        <ItemIcon className="w-4 h-4 text-primary" />
                      </span>
                      <span>
                        <span className="font-semibold text-foreground">
                          {i + 1}.{" "}
                        </span>
                        {item.text}
                      </span>
                    </div>
                  </StaggerItem>
                  );
                })}
              </Stagger>
            </Section>

            <Section icon={Package} title="requirements">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border/50 border-b">
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        Requirement
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground text-xs text-left">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {requirements.map((row) => (
                      <tr key={row.req}>
                        <td className="py-2.5 pr-4 align-top font-medium text-xs">
                          {row.req}
                        </td>
                        <td className="py-2.5 text-muted-foreground text-xs align-top">
                          {row.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section icon={FolderTree} title="explorer">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border/50 border-b">
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        Target
                      </th>
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        Menu
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground text-xs text-left">
                        Behaviour
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <tr>
                      <td className="py-2.5 pr-4 align-top">
                        <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs whitespace-nowrap">
                          .jpg / .jpeg / .png
                        </code>
                      </td>
                      <td className="py-2.5 pr-4 text-xs align-top font-medium">
                        Optimize Image
                      </td>
                      <td className="py-2.5 text-muted-foreground text-xs align-top">
                        Runs the CLI on a temporary folder with that file, then
                        merges outputs into the file&apos;s parent (the CLI only
                        accepts directories).
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 align-top">
                        <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
                          Any folder
                        </code>
                      </td>
                      <td className="py-2.5 pr-4 text-xs align-top font-medium">
                        Optimize Folder
                      </td>
                      <td className="py-2.5 text-muted-foreground text-xs align-top">
                        Runs the CLI on that path directly.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section icon={Command} title="command palette">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border/50 border-b">
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        Command
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground text-xs text-left">
                        When not invoked from Explorer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {[
                      {
                        cmd: "Optimize Image",
                        when: "Opens an image file picker.",
                      },
                      {
                        cmd: "Optimize Folder",
                        when: "Opens a folder picker.",
                      },
                      {
                        cmd: "Webpocalypse: Optimize Images",
                        when: "Opens a folder picker (same as folder flow).",
                      },
                    ].map((row) => (
                      <tr key={row.cmd}>
                        <td className="py-2.5 pr-4 align-top text-xs font-medium">
                          {row.cmd}
                        </td>
                        <td className="py-2.5 text-muted-foreground text-xs align-top">
                          {row.when}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section icon={Settings2} title="folder output &amp; inPlace">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border/50 border-b">
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        Setting
                      </th>
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        CLI flag
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground text-xs text-left">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <tr>
                      <td className="py-2.5 pr-4 align-top text-xs">
                        <code className="bg-muted px-1.5 py-0.5 rounded font-mono">
                          webpocalypse.inPlace
                        </code>{" "}
                        off (default)
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground text-xs align-top">
                        (none)
                      </td>
                      <td className="py-2.5 text-muted-foreground text-xs align-top">
                        CLI writes to a sibling{" "}
                        <code className="bg-muted/80 px-1 py-0.5 rounded font-mono text-[11px]">
                          &lt;folder&gt;-optimized
                        </code>{" "}
                        directory.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 align-top text-xs">
                        <code className="bg-muted px-1.5 py-0.5 rounded font-mono">
                          webpocalypse.inPlace
                        </code>{" "}
                        on
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground text-xs align-top">
                        <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
                          --in-place
                        </code>
                      </td>
                      <td className="py-2.5 text-muted-foreground text-xs align-top">
                        Replaces folder contents safely (temp dir + rollback on
                        failure). For single-file runs,{" "}
                        <code className="bg-muted/80 px-1 py-0.5 rounded font-mono text-[11px]">
                          inPlace
                        </code>{" "}
                        controls where merged outputs are read from after the CLI
                        run.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-muted-foreground text-xs">
                All settings live under{" "}
                <strong className="text-foreground font-medium">Webpocalypse</strong>{" "}
                in editor settings (<code className="bg-muted px-1 py-0.5 rounded font-mono text-[11px]">webpocalypse.*</code>).
              </p>
            </Section>

            <Section icon={Settings2} title="settings">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border/50 border-b">
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        Setting
                      </th>
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        Default
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground text-xs text-left">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {settingsRows.map((row) => (
                      <tr key={row.setting}>
                        <td className="py-2.5 pr-4 align-top">
                          <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs whitespace-nowrap">
                            {row.setting}
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

            <Section icon={Terminal} title="how the CLI is invoked">
              <p className="mb-3 text-muted-foreground text-sm">
                The extension runs something like the following. Options come
                from your settings. Structured results are parsed from the{" "}
                <strong className="text-foreground font-medium">
                  last JSON object line
                </strong>{" "}
                on stdout (the CLI also prints a human-readable table before
                that line).
              </p>
              <CodeBlock code={cliInvoke} />
            </Section>

            <Section icon={Copy} title="development">
              <p className="mb-3 text-muted-foreground text-sm">
                Open the extension repo in VS Code and use{" "}
                <strong className="text-foreground font-medium">
                  Run Extension
                </strong>{" "}
                (F5) to launch an Extension Development Host.
              </p>
              <p className="mb-2 font-medium text-muted-foreground text-xs">
                build
              </p>
              <CodeBlock code={devCompile} />
              <p className="mt-4 mb-2 font-medium text-muted-foreground text-xs">
                package a .vsix (local install)
              </p>
              <CodeBlock code={devVsix} />
              <p className="mt-4 text-muted-foreground text-xs">
                Install the{" "}
                <code className="bg-muted px-1 py-0.5 rounded font-mono text-[11px]">
                  .vsix
                </code>{" "}
                via{" "}
                <strong className="text-foreground font-medium">
                  Extensions → … → Install from VSIX…
                </strong>
                . To publish to the Marketplace, use{" "}
                <code className="bg-muted px-1 py-0.5 rounded font-mono text-[11px]">
                  @vscode/vsce
                </code>{" "}
                with a publisher account and a PAT scoped to{" "}
                <strong className="text-foreground font-medium">
                  Marketplace (Manage)
                </strong>
                — see the{" "}
                <a
                  href="https://code.visualstudio.com/api/working-with-extensions/publishing-extension"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-border hover:decoration-foreground"
                >
                  Publishing Extensions
                </a>{" "}
                guide.
              </p>
            </Section>

            <FadeUp>
              <div className="bg-card/60 backdrop-blur-sm p-5 border border-border/40 rounded-2xl">
                <p className="mb-2 font-medium text-sm">related</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-border/30">
                      <tr>
                        <td className="py-2.5 pr-4 align-top">
                          <Link
                            href="https://www.npmjs.com/package/webpocalypse"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-foreground hover:underline underline-offset-4"
                          >
                            webpocalypse (npm)
                          </Link>
                        </td>
                        <td className="py-2.5 text-muted-foreground text-xs align-top">
                          CLI — encoding,{" "}
                          <code className="bg-muted/80 px-1 py-0.5 rounded font-mono text-[11px]">
                            --json
                          </code>
                          ,{" "}
                          <code className="bg-muted/80 px-1 py-0.5 rounded font-mono text-[11px]">
                            --in-place
                          </code>
                          .
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 align-top">
                          <Link
                            href="/workflow"
                            className="font-medium text-foreground hover:underline underline-offset-4"
                          >
                            webpocalypse-action
                          </Link>
                        </td>
                        <td className="py-2.5 text-muted-foreground text-xs align-top">
                          Optimize images in GitHub Actions.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 align-top">
                          <Link
                            href="/cli"
                            className="font-medium text-foreground hover:underline underline-offset-4"
                          >
                            CLI docs on this site
                          </Link>
                        </td>
                        <td className="py-2.5 text-muted-foreground text-xs align-top">
                          Flags, examples, and behaviour in one place.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 rounded-full"
                  asChild
                >
                  <Link href="/cli">
                    View CLI docs
                    <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </FadeUp>

            <FadeUp>
              <p className="text-center text-muted-foreground text-xs">
                License: MIT — see the extension repository&apos;s LICENSE file.
              </p>
            </FadeUp>
          </div>
        </div>
      </SiteLayout>
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FolderTree,
  Command,
  Settings2,
  Package,
  Terminal,
  ArrowRight,
  Copy,
  Check,
  Zap,
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
  "explorer — right-click a .jpg / .jpeg / .png → optimize image. folder → optimize folder.",
  "command palette — Webpocalypse: Optimize Images opens a folder picker (same flow as a folder right-click).",
  "you get a short notification, then a summary with file count and rough total savings from the CLI’s --json line.",
  "stdout / stderr go to the Webpocalypse output channel so you can actually read what happened.",
];

const requirements = [
  {
    req: "VS Code (or compatible editor)",
    notes: "^1.85 engines field — same as the extension’s package.json.",
  },
  {
    req: "Node + npm",
    notes: "extension shells out to npx webpocalypse. Node ≥ 18, same as the CLI.",
  },
  {
    req: "network (first run)",
    notes: "npx might download stuff once. npx --yes skips the annoying prompts.",
  },
];

const settingsRows = [
  {
    setting: "webpocalypse.quality",
    default: "80",
    description: "compression quality 1–100 (-q)",
  },
  {
    setting: "webpocalypse.format",
    default: "webp",
    description: "webp | avif | both (-f)",
  },
  {
    setting: "webpocalypse.maxWidth",
    default: "—",
    description: "optional max width in px (--max-width)",
  },
  {
    setting: "webpocalypse.maxHeight",
    default: "—",
    description: "optional max height in px (--max-height)",
  },
  {
    setting: "webpocalypse.lossless",
    default: "false",
    description: "lossless mode (--lossless)",
  },
  {
    setting: "webpocalypse.inPlace",
    default: "false",
    description:
      "folders: actually replace contents safely; single file: where merged outputs get read from after the run",
  },
];

const cliInvoke = `npx --yes webpocalypse <path> --json [options…]`;

const devCompile = `npm install
npm run compile    # emit out/
npm run watch      # tsc --watch`;

const devVsix = `npm install -g @vscode/vsce   # once
npm run compile
vsce package                    # produces .vsix`;

const heroCommand = `npx --yes webpocalypse ./public --format webp --quality 80 --json`;

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
                  VS Code extension
                </p>
              </HeroReveal>

              <HeroReveal delay={0.15}>
                <h1 className="mb-4 font-bold text-4xl sm:text-5xl tracking-tight">
                  stay in the editor.
                  <br />
                  same CLI underneath.
                </h1>
              </HeroReveal>

              <HeroReveal delay={0.25}>
                <p className="mx-auto max-w-xl text-muted-foreground text-base">
                  right-click in the sidebar or hit the command palette — it’s
                  still{" "}
                  <a
                    href="https://www.npmjs.com/package/webpocalypse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
                  >
                    webpocalypse
                  </a>
                  , just wired up for lazy people (complimentary). fully local.
                  no server. no API keys.
                </p>
              </HeroReveal>

              <HeroReveal delay={0.35}>
                <div className="mx-auto mt-6 max-w-xl">
                  <CodeBlock code={heroCommand} />
                </div>
              </HeroReveal>

              <HeroReveal delay={0.4}>
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
              </HeroReveal>

              <HeroReveal delay={0.45}>
                <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-xs">
                  search{" "}
                  <code className="bg-muted/80 px-1 py-0.5 rounded font-mono text-[11px]">
                    webpocalypse-vscode
                  </code>{" "}
                  if the store&apos;s being weird. linux, mac, windows — same as
                  the CLI.
                </p>
              </HeroReveal>
            </div>

            <FadeUp>
              <section className="bg-card/70 backdrop-blur-sm p-6 sm:p-8 border border-border/50 rounded-3xl">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex justify-center items-center bg-primary/10 rounded-full w-8 h-8">
                    <Zap className="w-4 h-4 text-primary" />
                  </span>
                  <h2 className="font-semibold text-base">what it does</h2>
                </div>
                <Stagger className="space-y-3">
                  {whatItDoes.map((step, i) => (
                    <StaggerItem key={i}>
                      <div className="flex items-start gap-3 text-muted-foreground text-sm">
                        <span className="inline-flex justify-center items-center bg-primary/10 mt-0.5 rounded-full w-5 h-5 font-bold text-[10px] text-primary shrink-0">
                          {i + 1}
                        </span>
                        {step}
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </section>
            </FadeUp>

            <Section icon={Package} title="what you need">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border/50 border-b">
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        Thing
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground text-xs text-left">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {requirements.map((row) => (
                      <tr key={row.req}>
                        <td className="py-2.5 pr-4 align-top text-muted-foreground text-xs">
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

            <Section icon={FolderTree} title="sidebar right-clicks">
              <p className="mb-4 text-muted-foreground text-xs">
                the CLI only eats directories, so a single image run uses a temp
                folder under the hood — then outputs get merged back next to your
                file.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border/50 border-b">
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        You click
                      </th>
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        Menu
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground text-xs text-left">
                        What happens
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
                      <td className="py-2.5 pr-4 text-muted-foreground text-xs align-top">
                        Optimize Image
                      </td>
                      <td className="py-2.5 text-muted-foreground text-xs align-top">
                        temp folder with that one file → run CLI → merge into the
                        parent directory.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 align-top">
                        <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
                          a folder
                        </code>
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground text-xs align-top">
                        Optimize Folder
                      </td>
                      <td className="py-2.5 text-muted-foreground text-xs align-top">
                        CLI runs on that path directly. boring. reliable.
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
                        If you didn’t start from the sidebar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {[
                      {
                        cmd: "Optimize Image",
                        when: "opens an image picker.",
                      },
                      {
                        cmd: "Optimize Folder",
                        when: "opens a folder picker.",
                      },
                      {
                        cmd: "Webpocalypse: Optimize Images",
                        when: "folder picker — same as the folder flow.",
                      },
                    ].map((row) => (
                      <tr key={row.cmd}>
                        <td className="py-2.5 pr-4 align-top text-muted-foreground text-xs">
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

            <Section icon={Settings2} title="output folder & in-place">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border/50 border-b">
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        webpocalypse.inPlace
                      </th>
                      <th className="pr-4 pb-2 font-medium text-muted-foreground text-xs text-left">
                        CLI
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground text-xs text-left">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <tr>
                      <td className="py-2.5 pr-4 align-top text-muted-foreground text-xs">
                        off (default)
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground text-xs align-top">
                        (no flag)
                      </td>
                      <td className="py-2.5 text-muted-foreground text-xs align-top">
                        you get a sibling{" "}
                        <code className="bg-muted/80 px-1 py-0.5 rounded font-mono text-[11px]">
                          &lt;folder&gt;-optimized
                        </code>{" "}
                        directory. classic webpocalypse behaviour.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 align-top text-muted-foreground text-xs">
                        on
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground text-xs align-top">
                        <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
                          --in-place
                        </code>
                      </td>
                      <td className="py-2.5 text-muted-foreground text-xs align-top">
                        swaps folder contents via temp dir, rolls back if
                        anything blows up. for single-file runs, inPlace changes
                        where merged outputs are read from afterward.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-muted-foreground text-xs">
                everything hangs off{" "}
                <code className="bg-muted px-1 py-0.5 rounded font-mono text-[11px]">
                  webpocalypse.*
                </code>{" "}
                in settings. one namespace, less chaos.
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
                        What it does
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

            <Section icon={Terminal} title="under the hood">
              <p className="mb-3 text-muted-foreground text-sm">
                the extension basically spawns what you’d type yourself.
                options map from settings. it parses the last JSON object on
                stdout for the summary (the CLI prints the pretty table first,
                then JSON — yeah, it’s a little quirky).
              </p>
              <CodeBlock code={cliInvoke} />
            </Section>

            <Section icon={Copy} title="hacking on it">
              <p className="mb-3 text-muted-foreground text-sm">
                clone the repo, hit F5 (Run Extension), stare at breakpoints.
                you know the drill.
              </p>
              <p className="mb-1.5 font-medium text-muted-foreground text-xs">
                build
              </p>
              <CodeBlock code={devCompile} />
              <p className="mt-4 mb-1.5 font-medium text-muted-foreground text-xs">
                ship a .vsix for local installs
              </p>
              <CodeBlock code={devVsix} />
              <p className="mt-4 text-muted-foreground text-xs">
                install via{" "}
                <span className="text-foreground/90">
                  Extensions → … → Install from VSIX…
                </span>
                . publishing is normal vsce + marketplace token stuff — read the
                official{" "}
                <a
                  href="https://code.visualstudio.com/api/working-with-extensions/publishing-extension"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
                >
                  publishing guide
                </a>{" "}
                when you’re ready.
              </p>
            </Section>

            <FadeUp>
              <div className="bg-card/60 backdrop-blur-sm p-5 border border-border/40 rounded-2xl">
                <p className="mb-2 font-medium text-sm">
                  miss the terminal already?
                </p>
                <p className="mb-4 text-muted-foreground text-sm">
                  same flags, same sharp pipeline — just without a GUI holding
                  your hand. or go full CI if you’re allergic to both.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    asChild
                  >
                    <Link href="/cli">
                      CLI docs
                      <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    asChild
                  >
                    <Link href="/workflow">
                      GitHub Action
                      <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeUp>

            <FadeUp>
              <p className="text-center text-muted-foreground text-xs">
                MIT license — same deal as the CLI.
              </p>
            </FadeUp>
          </div>
        </div>
      </SiteLayout>
    </main>
  );
}

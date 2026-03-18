import Link from "next/link";
import { Zap, Terminal, GitBranch, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import {
  FadeUp,
  HeroReveal,
  Stagger,
  StaggerItem,
} from "@/components/ui/animate";

const products = [
  {
    icon: Zap,
    title: "Web App",
    description:
      "Drop a folder, pick a format, click convert. Everything runs in your browser — nothing touches a server. Genuinely zero effort.",
    href: "/",
    cta: "Try it",
  },
  {
    icon: Terminal,
    title: "CLI",
    description:
      "One command and your whole directory is done. Plug it into your build script and never think about it again.",
    href: "/cli",
    cta: "View CLI docs",
  },
  {
    icon: GitBranch,
    title: "GitHub Workflow",
    description:
      "A GitHub Action that auto-optimizes images in every PR. Basically set it up once and let the bot do the work while you nap.",
    href: "/workflow",
    cta: "View workflow",
  },
];

const stats = [
  { value: "80%+", label: "typical size reduction" },
  { value: "100%", label: "runs locally, no uploads" },
  { value: "WebP + AVIF", label: "modern format support" },
];

export function AboutPage() {
  return (
    <main className="relative bg-background min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none"
        style={{ backgroundImage: `url(/images/background.webp)` }}
        aria-hidden="true"
      />

      <div className="z-10 relative flex flex-col min-h-screen">
        <Header />

        <div className="flex-1 px-4 sm:px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            {/* Hero */}
            <div className="mb-16 text-center">
              <HeroReveal delay={0.05}>
                <p className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                  the origin story
                </p>
              </HeroReveal>

              <HeroReveal delay={0.15}>
                <h1 className="mb-5 font-bold text-4xl sm:text-5xl tracking-tight">
                  I got tired of
                  <br />
                  doing it manually.
                </h1>
              </HeroReveal>

              <HeroReveal delay={0.25}>
                <p className="mx-auto max-w-xl text-muted-foreground text-base sm:text-lg">
                  Converting images one by one is genuinely one of the worst
                  tasks in web dev. So I built Webpocalypse — a tool (actually
                  three tools) that batch converts your entire folder of JPGs
                  and PNGs to WebP or AVIF. Locally. No uploads. No waiting.
                </p>
              </HeroReveal>
            </div>

            {/* Stats */}
            <FadeUp className="mb-16">
              <Stagger className="gap-4 grid grid-cols-3 bg-card/70 backdrop-blur-sm p-6 border border-border/50 rounded-3xl">
                {stats.map((stat) => (
                  <StaggerItem key={stat.label} className="text-center">
                    <p className="font-bold text-xl sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-muted-foreground text-xs">
                      {stat.label}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </FadeUp>

            {/* Why section */}
            <FadeUp className="mb-16">
              <div className="space-y-4 bg-card/70 backdrop-blur-sm p-6 sm:p-8 border border-border/50 rounded-3xl">
                <h2 className="font-semibold text-lg">okay but why though</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Images are almost always the heaviest thing on a webpage.
                  We&apos;re talking JPEGs and PNGs that are 10x larger than
                  they need to be. WebP and AVIF cut that by 70–90% — same
                  quality, fraction of the size. Your site loads faster, your
                  Lighthouse score goes up, users don&apos;t bounce.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The problem is converting them is annoying. Every tool either
                  makes you upload to some random server (weird), handles one
                  file at a time (unacceptable), or completely destroys your
                  folder structure (criminal). Webpocalypse does none of that.
                  It runs in your browser or terminal, handles whole directories
                  in one shot, and keeps your file layout exactly as-is.
                </p>
              </div>
            </FadeUp>

            {/* Products */}
            <FadeUp className="mb-16">
              <h2 className="mb-6 font-semibold text-lg">
                three ways to use it
              </h2>
              <Stagger className="space-y-3">
                {products.map((product) => {
                  const Icon = product.icon;
                  return (
                    <StaggerItem key={product.title}>
                      <div className="flex items-start gap-4 bg-card/70 hover:bg-card/90 backdrop-blur-sm p-5 border border-border/50 rounded-2xl transition-colors">
                        <span className="inline-flex justify-center items-center bg-primary/10 rounded-full w-9 h-9 shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="mb-1 font-semibold">{product.title}</p>
                          <p className="text-muted-foreground text-sm">
                            {product.description}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full shrink-0"
                          asChild
                        >
                          <Link href={product.href}>
                            {product.cta}
                            <ArrowRight className="ml-1 w-3 h-3" />
                          </Link>
                        </Button>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </FadeUp>

            {/* CTA */}
            <FadeUp className="text-center">
              <Button size="lg" className="px-8 rounded-full" asChild>
                <Link href="/">try the web app, it&apos;s free</Link>
              </Button>
            </FadeUp>
          </div>
        </div>
      </div>
    </main>
  );
}

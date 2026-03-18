import Link from "next/link";
import { ShieldCheck, Eye, Server, BarChart2, Mail } from "lucide-react";
import { FadeUp, HeroReveal } from "@/components/ui/animate";
import SiteLayout from "@/components/layout/SiteLayout";

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
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex justify-center items-center bg-primary/10 rounded-full w-8 h-8 shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </span>
          <h2 className="font-semibold text-base">{title}</h2>
        </div>
        <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
          {children}
        </div>
      </section>
    </FadeUp>
  );
}

export function PrivacyPage() {
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
                  Legal
                </p>
              </HeroReveal>

              <HeroReveal delay={0.15}>
                <h1 className="mb-4 font-bold text-4xl sm:text-5xl tracking-tight">
                  Privacy Policy
                </h1>
              </HeroReveal>

              <HeroReveal delay={0.25}>
                <p className="mx-auto max-w-xl text-muted-foreground text-base">
                  The short version: your images never leave your browser. Here
                  is everything else worth knowing.
                </p>
              </HeroReveal>

              <HeroReveal delay={0.3}>
                <p className="mt-3 text-muted-foreground text-xs">
                  Last updated:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </HeroReveal>
            </div>

            {/* What we collect */}
            <Section icon={Eye} title="what we collect">
              <p>
                We collect very little. There are no accounts, no sign-ups, and
                no forms that capture personal data.
              </p>
              <p>
                The only data collected automatically is{" "}
                <strong className="text-foreground">
                  anonymous usage analytics
                </strong>{" "}
                — things like which pages were visited, what browser you used,
                and rough geographic region (country-level). This data contains
                no personally identifiable information.
              </p>
            </Section>

            {/* Your images */}
            <Section
              icon={ShieldCheck}
              title="your images stay on your machine"
            >
              <p>
                Image conversion runs entirely in your browser using the Web
                APIs built into your device. Your files are{" "}
                <strong className="text-foreground">
                  never uploaded to any server
                </strong>
                . They are read locally, converted locally, and downloaded
                locally.
              </p>
              <p>
                The same is true of the CLI tool — it runs entirely on your
                machine using Node.js and Sharp. No network requests are made
                during conversion.
              </p>
            </Section>

            {/* Server-side processing */}
            <Section icon={Server} title="the /api/convert endpoint">
              <p>
                The web app has a server-side{" "}
                <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">
                  /api/convert
                </code>{" "}
                route that handles conversion for browsers that cannot run Sharp
                natively. If this path is used, your image data is sent to and
                processed on a Vercel serverless function.
              </p>
              <p>
                Files processed this way are{" "}
                <strong className="text-foreground">
                  not stored, logged, or retained
                </strong>{" "}
                beyond the single conversion request. They exist in memory for
                the duration of the function invocation only.
              </p>
            </Section>

            {/* Analytics */}
            <Section icon={BarChart2} title="analytics">
              <p>
                This site uses{" "}
                <Link
                  href="https://vercel.com/analytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-2 hover:no-underline"
                >
                  Vercel Analytics
                </Link>
                , a privacy-focused analytics product. It does not use cookies,
                does not fingerprint users, and does not sell data to third
                parties.
              </p>
              <p>
                Data collected includes: page URL, referrer, device type,
                browser, and approximate country. No IP addresses are stored.
                You can read{" "}
                <Link
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-2 hover:no-underline"
                >
                  Vercel&apos;s full Privacy Policy
                </Link>{" "}
                for more detail.
              </p>
            </Section>

            {/* Contact */}
            <Section icon={Mail} title="contact">
              <p>
                Questions about this policy? Reach out and I&apos;ll respond as
                soon as possible.
              </p>
              <p>
                You can open an issue on{" "}
                <Link
                  href="https://github.com/meowbeen/webpocalypse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-2 hover:no-underline"
                >
                  GitHub
                </Link>{" "}
                or send a message through the repository.
              </p>
            </Section>
          </div>
        </div>
      </SiteLayout>
    </main>
  );
}

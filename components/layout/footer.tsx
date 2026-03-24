"use client";

import Link from "next/link";
import Logo from "../ui/logo";
import { FadeUp, Stagger, StaggerItem } from "@/components/ui/animate";

const productLinks = [
  { href: "/", label: "Web App" },
  { href: "/cli", label: "CLI" },
  { href: "/vscode", label: "VS Code extension" },
  { href: "/workflow", label: "GitHub Workflow" },
];

const resourceLinks = [
  { href: "/about", label: "About" },
  {
    href: "https://www.npmjs.com/package/webpocalypse",
    label: "npm",
    external: true,
  },
  {
    href: "https://github.com/meowbeen/webpocalypse-cli",
    label: "GitHub",
    external: true,
  },
];

const legalLinks = [{ href: "/privacy", label: "Privacy Policy" }];

export default function Footer() {
  return (
    <footer className="z-50 relative flex justify-center px-4 pt-6 pb-4">
      <FadeUp className="w-full max-w-3xl">
        <div className="bg-card shadow-sm backdrop-blur-md px-6 py-6 border border-border/40 rounded-3xl">
          <div className="flex sm:flex-row flex-col gap-8 pb-6 border-border/30 border-b">
            {/* Brand */}
            <FadeUp delay={0.05} className="flex-1 min-w-0">
              <Logo
                src="/images/webpocalypse-secondary.svg"
                alt="Webpocalypse"
                width={20}
                height={20}
                title="Webpocalypse"
              />
              <p className="mt-3 max-w-xs text-muted-foreground text-xs leading-relaxed">
                Batch convert JPG & PNG to WebP and AVIF — locally, in your
                browser or terminal. Nothing leaves your machine.
              </p>
            </FadeUp>

            {/* Links */}
            <div className="flex gap-10 sm:gap-12 shrink-0">
              <div>
                <FadeUp delay={0.1}>
                  <p className="mb-3 font-semibold text-xs uppercase tracking-wider">
                    Product
                  </p>
                </FadeUp>
                <Stagger className="space-y-2">
                  {productLinks.map((l) => (
                    <StaggerItem key={l.href}>
                      <Link
                        href={l.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {l.label}
                      </Link>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>

              <div>
                <FadeUp delay={0.15}>
                  <p className="mb-3 font-semibold text-xs uppercase tracking-wider">
                    Resources
                  </p>
                </FadeUp>
                <Stagger className="space-y-2">
                  {resourceLinks.map((l) => (
                    <StaggerItem key={l.href}>
                      <Link
                        href={l.href}
                        {...(l.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {l.label}
                      </Link>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <FadeUp delay={0.2}>
            <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-2 pt-4">
              <p className="text-muted-foreground text-xs">
                &copy; {new Date().getFullYear()} Webpocalypse. All rights
                reserved.
              </p>
              <div className="flex items-center gap-4">
                {legalLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </FadeUp>
    </footer>
  );
}

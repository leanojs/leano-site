"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "../ui/logo";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/cli", label: "CLI" },
  { href: "/vscode", label: "VS Code" },
  { href: "/workflow", label: "Workflow" },
];

const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="z-50 relative flex justify-center px-4 pt-4 pb-2">
      <motion.div
        className="flex justify-between items-center gap-4 bg-card shadow-sm backdrop-blur-md px-4 py-2 border border-border/40 rounded-full w-full max-w-3xl"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Logo */}
        <Logo
          src="/images/leano-secondary.svg"
          alt="Leano"
          width={22}
          height={22}
          title="Leano"
        />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3.5 py-1.5 rounded-full font-medium text-sm transition-colors",
                pathname === link.href
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile menu toggle */}
        <div className="flex items-center gap-2">
          <Button size="sm" className="hidden md:inline-flex rounded-full" asChild>
            <Link href="/">Try it free</Link>
          </Button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden inline-flex justify-center items-center hover:bg-muted rounded-full w-8 h-8"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-4 h-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* Mobile nav dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden top-[calc(100%-0.5rem)] right-4 left-4 z-50 absolute bg-background/95 shadow-lg backdrop-blur-md p-2 border border-border/40 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 rounded-xl font-medium text-sm transition-colors",
                    pathname === link.href
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div className="mt-1 pt-1 border-border/30 border-t">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block hover:bg-muted px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                Try it free →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

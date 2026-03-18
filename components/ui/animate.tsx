"use client";

import { motion, type Variants } from "motion/react";

// ─── Shared easing ────────────────────────────────────────────────────────────
const ease = [0.25, 0.1, 0.25, 1] as const;

// ─── Variants ─────────────────────────────────────────────────────────────────
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

// ─── Primitives ───────────────────────────────────────────────────────────────

/** Fades up when it enters the viewport. Use for most content blocks. */
export function FadeUp({
  children,
  className,
  delay = 0,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={fadeUpVariants}
      transition={{ duration: 0.45, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Fades in (no y movement). Good for backgrounds or overlays. */
export function FadeIn({
  children,
  className,
  delay = 0,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={fadeInVariants}
      transition={{ duration: 0.5, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wraps a list of items; each direct child should be a `<StaggerItem>`.
 * The container triggers staggered animation for children.
 */
export function Stagger({
  children,
  className,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={staggerContainerVariants}
    >
      {children}
    </motion.div>
  );
}

/** A single item inside a `<Stagger>` container. */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUpVariants}
      transition={{ duration: 0.45, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Animates immediately on mount — use for above-the-fold hero content. */
export function HeroReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      transition={{ duration: 0.5, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

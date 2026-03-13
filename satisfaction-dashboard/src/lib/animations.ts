import { Variants } from "framer-motion";

// ─── Entrance Animations ─────────────────────────────────────────────────────

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export const scaleInSpring: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

// ─── Stagger Systems ─────────────────────────────────────────────────────────

/** Wrap a list with this and each child gets stagger-animated via `staggerItem` */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const staggerItemRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
  },
};

// ─── Slide In ────────────────────────────────────────────────────────────────

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// ─── Hover / Tap Presets (inline motion props) ───────────────────────────────

/** Lift + shadow on hover */
export const cardHoverProps = {
  whileHover: { y: -4, scale: 1.01, transition: { duration: 0.2 } },
  whileTap: { scale: 0.99, transition: { duration: 0.1 } },
};

/** Subtle scale on hover */
export const subtleHoverProps = {
  whileHover: { scale: 1.02, transition: { duration: 0.18 } },
  whileTap: { scale: 0.98 },
};

/** Row hover (slide-in accent) */
export const rowHoverProps = {
  whileHover: { x: 3, transition: { duration: 0.18 } },
};

/** Icon bounce */
export const iconHoverProps = {
  whileHover: { scale: 1.15, rotate: 8, transition: { duration: 0.2 } },
  whileTap: { scale: 0.9 },
};

// ─── Page / Panel Transitions ─────────────────────────────────────────────────

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25 },
  },
};

// ─── Specific Presets ─────────────────────────────────────────────────────────

/** Animated progress bar – use as `custom` */
export const progressBar: Variants = {
  hidden: { width: 0 },
  visible: (pct: number) => ({
    width: `${pct}%`,
    transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 },
  }),
};

/** Badge pop */
export const badgePop: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 18 },
  },
};

// ─── Transition Presets ───────────────────────────────────────────────────────

export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const smoothTransition = {
  duration: 0.3,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
};

// ─── Legacy aliases (kept for backward compat) ───────────────────────────────

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.2, ease: "easeOut" } },
  tap: { scale: 0.98 },
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

export const sidebarVariants: Variants = {
  expanded: {
    width: "var(--sidebar-width)",
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  collapsed: {
    width: "var(--sidebar-collapsed-width)",
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

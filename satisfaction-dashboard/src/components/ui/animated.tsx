"use client";

import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import {
  fadeIn,
  fadeInUp,
  scaleIn,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

// Animated container with fade effect
export const FadeIn = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & { children: ReactNode }
>(({ children, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial="hidden"
    animate="visible"
    variants={fadeIn}
    {...props}
  >
    {children}
  </motion.div>
));
FadeIn.displayName = "FadeIn";

// Animated container with fade + slide up effect
export const FadeInUp = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & { children: ReactNode; delay?: number }
>(({ children, delay = 0, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay },
      },
    }}
    {...props}
  >
    {children}
  </motion.div>
));
FadeInUp.displayName = "FadeInUp";

// Animated scale in effect
export const ScaleIn = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & { children: ReactNode; delay?: number }
>(({ children, delay = 0, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0, scale: 0.95 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3, ease: "easeOut", delay },
      },
    }}
    {...props}
  >
    {children}
  </motion.div>
));
ScaleIn.displayName = "ScaleIn";

// Stagger animation container
interface StaggerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  staggerDelay?: number;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerProps>(
  ({ children, staggerDelay = 0.1, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
);
StaggerContainer.displayName = "StaggerContainer";

// Stagger item (use as child of StaggerContainer)
export const StaggerItem = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & { children: ReactNode }
>(({ children, ...props }, ref) => (
  <motion.div ref={ref} variants={staggerItem} {...props}>
    {children}
  </motion.div>
));
StaggerItem.displayName = "StaggerItem";

// Animated card with hover effect
interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  hoverEffect?: boolean;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, hoverEffect = true, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
);
AnimatedCard.displayName = "AnimatedCard";

// Page transition wrapper
export const PageTransition = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & { children: ReactNode }
>(({ children, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    {...props}
  >
    {children}
  </motion.div>
));
PageTransition.displayName = "PageTransition";

// Counter animation (for metric numbers)
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatFn?: (value: number) => string;
}

export function AnimatedCounter({
  value,
  duration = 1,
  formatFn = (v) => v.toLocaleString(),
}: AnimatedCounterProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {formatFn(value)}
      </motion.span>
    </motion.span>
  );
}

// Animated progress bar
interface AnimatedProgressProps {
  value: number;
  className?: string;
}

export function AnimatedProgress({ value, className }: AnimatedProgressProps) {
  return (
    <motion.div
      className={className}
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
    />
  );
}

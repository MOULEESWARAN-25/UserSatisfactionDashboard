"use client";

import { useEffect, useRef } from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDelta, getDeltaColor } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  delta?: number;
  icon: LucideIcon;
  iconColor?: string;
  index?: number;
}

/** Animated number counter — only for purely numeric values */
function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 80, damping: 20 });

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });
  }, [spring]);

  return <span ref={ref}>0</span>;
}

export function MetricCard({
  title,
  value,
  description,
  delta,
  icon: Icon,
  iconColor = "text-muted-foreground",
  index = 0,
}: MetricCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const DeltaIcon =
    delta === undefined
      ? null
      : delta > 0
        ? TrendingUp
        : delta < 0
          ? TrendingDown
          : Minus;

  const isNumeric = typeof value === "number";

  return (
    <motion.div
      ref={ref}
      className="h-full"
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-xl hover:shadow-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <motion.p
                className="text-sm font-medium text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.08 + 0.15 }}
              >
                {title}
              </motion.p>
              <div className="space-y-1">
                <motion.p
                  className="text-2xl font-semibold tracking-tight"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08 + 0.2,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  {isNumeric ? <AnimatedNumber value={value as number} /> : value}
                </motion.p>
                {(description || delta !== undefined) && (
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.08 + 0.3 }}
                  >
                    {DeltaIcon && delta !== undefined && (
                      <motion.span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium",
                          delta > 0
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                            : delta < 0
                              ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                              : "bg-muted text-muted-foreground"
                        )}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 18,
                          delay: index * 0.08 + 0.35,
                        }}
                      >
                        <DeltaIcon className="h-3 w-3" />
                        {formatDelta(delta)}
                      </motion.span>
                    )}
                    {description && (
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
            <motion.div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/80 dark:bg-muted transition-colors group-hover:bg-primary/10 dark:group-hover:bg-primary/20",
                iconColor
              )}
              whileHover={{ scale: 1.18, rotate: 10, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, rotate: -15, scale: 0.7 }}
              animate={inView ? { opacity: 1, rotate: 0, scale: 1 } : {}}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 22,
                delay: index * 0.08 + 0.1,
              }}
            >
              <Icon className="h-5 w-5 text-foreground/80 dark:text-foreground" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

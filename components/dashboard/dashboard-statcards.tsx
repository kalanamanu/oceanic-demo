"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardItem {
  label: string;
  value: number;
  color: "blue" | "orange" | "green" | "cyan" | "violet";
  icon: LucideIcon;
}

interface StatCardsProps {
  stats: StatCardItem[];
}

const colorStyles = {
  blue: {
    light: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    glow: "group-hover:shadow-blue-200/50 dark:group-hover:shadow-blue-900/30",
  },
  orange: {
    light:
      "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
    iconBg: "bg-orange-100 dark:bg-orange-900/50",
    iconColor: "text-orange-600 dark:text-orange-400",
    glow: "group-hover:shadow-orange-200/50 dark:group-hover:shadow-orange-900/30",
  },
  green: {
    light:
      "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    iconBg: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
    glow: "group-hover:shadow-green-200/50 dark:group-hover:shadow-green-900/30",
  },
  cyan: {
    light: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300",
    border: "border-cyan-200 dark:border-cyan-800",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/50",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    glow: "group-hover:shadow-cyan-200/50 dark:group-hover:shadow-cyan-900/30",
  },
  violet: {
    light:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    glow: "group-hover:shadow-violet-200/50 dark:group-hover:shadow-violet-900/30",
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5"
    >
      {stats.map((s, index) => {
        const styles = colorStyles[s.color];
        const Icon = s.icon;

        return (
          <motion.div
            key={s.label}
            variants={item}
            whileHover={{
              scale: 1.05,
              y: -5,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 17,
              },
            }}
            whileTap={{ scale: 0.98 }}
            className="group"
          >
            <div
              className={cn(
                "rounded-xl border p-5 shadow-sm transition-all cursor-pointer h-full",
                styles.light,
                styles.border,
                styles.glow,
                "hover:shadow-lg",
              )}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <motion.div
                    className="text-3xl font-bold tracking-tight"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                    }}
                  >
                    {s.value}
                  </motion.div>
                  <div className="text-sm font-medium opacity-80">
                    {s.label}
                  </div>
                </div>

                <motion.div
                  whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    styles.iconBg,
                  )}
                >
                  <Icon className={cn("h-5 w-5", styles.iconColor)} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // if you don't have this, create a simple utility or use clsx

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
  },
  orange: {
    light:
      "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
    iconBg: "bg-orange-100 dark:bg-orange-900/50",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  green: {
    light:
      "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    iconBg: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
  },
  cyan: {
    light: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300",
    border: "border-cyan-200 dark:border-cyan-800",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/50",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  violet: {
    light:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
};

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
      {stats.map((s) => {
        const styles = colorStyles[s.color];
        const Icon = s.icon;

        return (
          <div
            key={s.label}
            className={cn(
              "rounded-xl border p-5 shadow-sm transition-all hover:shadow-md",
              styles.light,
              styles.border,
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-bold tracking-tight">
                  {s.value}
                </div>
                <div className="mt-1 text-sm font-medium opacity-80">
                  {s.label}
                </div>
              </div>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  styles.iconBg,
                )}
              >
                <Icon className={cn("h-5 w-5", styles.iconColor)} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

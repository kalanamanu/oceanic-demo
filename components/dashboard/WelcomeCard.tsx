"use client";

import { useEffect, useState } from "react";

interface WelcomeCardProps {
  name: string;
  department: string;
}

export default function WelcomeCard({ name, department }: WelcomeCardProps) {
  const [dateTime, setDateTime] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime({
        date: now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/95">
      {/* Ocean waves – anchored to right side */}
      <div className="absolute -right-16 bottom-0 h-32 w-[150%] rounded-[50%] bg-gradient-to-r from-cyan-200/40 via-blue-200/30 to-transparent blur-3xl dark:from-cyan-500/20 dark:via-blue-500/15 dark:to-transparent animate-wave-slow" />
      <div className="absolute -right-20 bottom-8 h-28 w-[160%] rounded-[50%] bg-gradient-to-r from-blue-200/30 via-indigo-200/25 to-transparent blur-2xl dark:from-blue-500/15 dark:via-indigo-500/15 dark:to-transparent animate-wave-medium" />
      <div className="absolute -right-24 bottom-16 h-24 w-[170%] rounded-[50%] bg-gradient-to-r from-sky-200/25 via-cyan-200/20 to-transparent blur-2xl dark:from-sky-500/10 dark:via-cyan-500/10 dark:to-transparent animate-wave-fast" />

      {/* Content */}
      <div className="relative z-10 px-8 py-6">
        {/* Top Section: Welcome + Date/Time */}
        <div className="flex items-start justify-between gap-6 mb-6">
          {/* Left: Welcome Message */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Welcome, {name}!
              </h1>
              <span className="text-3xl animate-wave-hand" aria-hidden="true">
                👋
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {department} Department
              </span>
            </div>
          </div>

          {/* Right: Date & Time */}
          {dateTime.date && (
            <div className="flex-shrink-0 text-right space-y-1">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {dateTime.date}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {dateTime.time} <span className="opacity-70">local</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section: Status Message */}
        <div className="pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Here&apos;s what&apos;s happening with your inquiries today.
          </p>
        </div>
      </div>
    </div>
  );
}

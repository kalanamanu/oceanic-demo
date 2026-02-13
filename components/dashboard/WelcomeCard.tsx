"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface WelcomeCardProps {
  name: string;
  department: string;
  accountType?: "admin" | "management" | "team_head" | "user";
}

export default function WelcomeCard({
  name,
  department,
  accountType,
}: WelcomeCardProps) {
  const [dateTime, setDateTime] = useState({
    date: "",
    time: "",
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

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
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Format account type for display
  const formatAccountType = (type?: string) => {
    if (!type) return "";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get badge color based on account type
  const getBadgeColor = (type?: string) => {
    switch (type) {
      case "admin":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "management":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "team_head":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/95 transition-shadow hover:shadow-md"
    >
      {/* Ocean waves with parallax effect */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute -right-16 bottom-0 h-32 w-[150%] rounded-[50%] bg-gradient-to-r from-cyan-200/40 via-blue-200/30 to-transparent blur-3xl dark:from-cyan-500/20 dark:via-blue-500/15 dark:to-transparent"
        style={{
          x: useTransform(mouseX, [-300, 300], [-10, 10]),
        }}
      />
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
        className="absolute -right-20 bottom-8 h-28 w-[160%] rounded-[50%] bg-gradient-to-r from-blue-200/30 via-indigo-200/25 to-transparent blur-2xl dark:from-blue-500/15 dark:via-indigo-500/15 dark:to-transparent"
        style={{
          x: useTransform(mouseX, [-300, 300], [-15, 15]),
        }}
      />
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }}
        className="absolute -right-24 bottom-16 h-24 w-[170%] rounded-[50%] bg-gradient-to-r from-sky-200/25 via-cyan-200/20 to-transparent blur-2xl dark:from-sky-500/10 dark:via-cyan-500/10 dark:to-transparent"
        style={{
          x: useTransform(mouseX, [-300, 300], [-20, 20]),
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-8 py-6">
        {/* Top Section: Welcome + Date/Time */}
        <div className="flex items-start justify-between gap-6 mb-6">
          {/* Left: Welcome Message */}
          <div className="flex-1 space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Welcome,{" "}
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="inline-block"
                >
                  {name}!
                </motion.span>
              </h1>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.6,
                  type: "spring",
                  stiffness: 300,
                }}
                whileHover={{
                  rotate: [0, 14, -8, 14, -4, 10, 0],
                  transition: {
                    duration: 0.6,
                    ease: "easeInOut",
                  },
                }}
                className="text-3xl cursor-pointer inline-block"
                aria-hidden="true"
              >
                👋
              </motion.span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {department} Department
              </span>
              {accountType && (
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${getBadgeColor(accountType)}`}
                >
                  {formatAccountType(accountType)}
                </span>
              )}
            </motion.div>
          </div>

          {/* Right: Date & Time */}
          {dateTime.date && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex-shrink-0 text-right space-y-1"
            >
              <motion.div
                key={dateTime.date}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                {dateTime.date}
              </motion.div>
              <motion.div
                key={dateTime.time}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono tabular-nums"
              >
                {dateTime.time} <span className="opacity-70">local</span>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Bottom Section: Status Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="pt-3 border-t border-slate-200/50 dark:border-slate-700/50"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Here&apos;s what&apos;s happening with your inquiries today.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

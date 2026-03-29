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
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const sriLankaTime = new Date(utc + 5.5 * 60 * 60 * 1000);

      const pad = (n: number) => n.toString().padStart(2, "0");
      const time24 = `${pad(sriLankaTime.getHours())}:${pad(
        sriLankaTime.getMinutes(),
      )}:${pad(sriLankaTime.getSeconds())}`;

      setDateTime({
        date: sriLankaTime.toLocaleDateString("en-GB"),
        time: time24,
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

  const formatAccountType = (type?: string) => {
    if (!type) return "";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Badge styles tuned to look good on the green theme (still role-distinct)
  const getBadgeColor = (type?: string) => {
    switch (type) {
      case "admin":
        return "bg-destructive/15 text-destructive border border-destructive/25";
      case "management":
        return "bg-primary/12 text-primary border border-primary/20";
      case "team_head":
        return "bg-accent/35 text-accent-foreground border border-accent/40";
      default:
        return "bg-muted text-muted-foreground border border-border";
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
      className={[
        "relative overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md glass",
        "border-border bg-gradient-to-br from-card to-secondary/35",
      ].join(" ")}
    >
      {/* Maritime “sea glow” (green/teal) with parallax */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute -right-16 bottom-0 h-32 w-[150%] rounded-[50%] blur-3xl
                   bg-gradient-to-r from-primary/18 via-accent/18 to-transparent"
        style={{
          x: useTransform(mouseX, [-300, 300], [-10, 10]),
        }}
      />
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
        className="absolute -right-20 bottom-8 h-28 w-[160%] rounded-[50%] blur-2xl
                   bg-gradient-to-r from-primary/14 via-primary/8 to-transparent"
        style={{
          x: useTransform(mouseX, [-300, 300], [-15, 15]),
        }}
      />
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }}
        className="absolute -right-24 bottom-16 h-24 w-[170%] rounded-[50%] blur-2xl
                   bg-gradient-to-r from-accent/16 via-primary/10 to-transparent"
        style={{
          x: useTransform(mouseX, [-300, 300], [-20, 20]),
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-8 py-6">
        {/* Top Section */}
        <div className="flex items-start justify-between gap-6 mb-6">
          {/* Left */}
          <div className="flex-1 space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
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
                  transition: { duration: 0.6, ease: "easeInOut" },
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
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {department}
              </span>

              {accountType && (
                <span
                  className={[
                    "text-xs font-semibold px-2 py-1 rounded-full",
                    getBadgeColor(accountType),
                  ].join(" ")}
                >
                  {formatAccountType(accountType)} Account
                </span>
              )}
            </motion.div>
          </div>

          {/* Right */}
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
                className="text-sm font-semibold text-foreground/85"
              >
                {dateTime.date}
              </motion.div>

              <motion.div
                key={dateTime.time}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-xs font-medium text-muted-foreground font-mono tabular-nums"
              >
                {dateTime.time}{" "}
                <span className="opacity-70">Sri Lanka Time</span>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="pt-3 border-t border-border/60"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            Here&apos;s what&apos;s happening with your inquiries today.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

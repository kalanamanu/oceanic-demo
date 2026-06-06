"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import AppShell from "@/components/AppShell";
import { ThemeProvider } from "@/components/theme-provider";
import { ProfileService } from "@/services/profile.service";

/**
 * GLOBAL BACKGROUND MANAGER
 * Runs once on app load + theme change
 */
function BackgroundManager() {
  const { resolvedTheme } = useTheme();

  const applyBackground = React.useCallback(async () => {
    try {
      let bgUrl: string | null = null;

      // STEP 1: Try cached background first (FASTEST)
      const cached = localStorage.getItem("user_background_url");

      if (cached) {
        bgUrl = cached;
      }

      // STEP 2: Try API only if user exists
      const storedUser = localStorage.getItem("user_data");

      if (storedUser) {
        const userId = JSON.parse(storedUser)?.id;

        if (userId) {
          try {
            const res = await ProfileService.getProfileBackground(userId);

            if (res?.backgroundImageUrl) {
              bgUrl = res.backgroundImageUrl;

              // cache new value
              localStorage.setItem("user_background_url", bgUrl);
            }
          } catch (err) {
            console.warn("Background API failed, using cached/default");
          }
        }
      }

      // STEP 3: fallback system background
      if (!bgUrl) {
        bgUrl =
          resolvedTheme === "dark" ? "/background2.png" : "/background.png";
      }

      // APPLY immediately
      document.documentElement.style.setProperty(
        "--app-background-image",
        `url("${bgUrl}")`,
      );
    } catch (error) {
      console.error("Failed to apply background", error);
    }
  }, [resolvedTheme]);

  /**
   * 🔥 RUN IMMEDIATELY ON MOUNT (NO WAIT)
   */
  React.useEffect(() => {
    applyBackground();
  }, [applyBackground]);

  /**
   * Listen for updates (profile change, upload, reset)
   */
  React.useEffect(() => {
    window.addEventListener("profile-updated", applyBackground);

    return () => {
      window.removeEventListener("profile-updated", applyBackground);
    };
  }, [applyBackground]);

  return null;
}

/* =========================
   MAIN LAYOUT
========================= */

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const publicRoutes = [
    "/login",
    "/login-otp",
    "/forgot-password",
    "/reset-password",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname?.startsWith(route),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* GLOBAL BACKGROUND SYSTEM */}
      <BackgroundManager />

      {isPublicRoute ? children : <AppShell>{children}</AppShell>}
    </ThemeProvider>
  );
}

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import AppShell from "@/components/AppShell";
import { ThemeProvider } from "@/components/theme-provider";
import { ProfileService } from "@/services/profile.service";

/* =====================================================
   GLOBAL BACKGROUND MANAGER (SAFE VERSION)
===================================================== */
function BackgroundManager() {
  const { resolvedTheme } = useTheme();

  const applyBackground = React.useCallback(async () => {
    try {
      let bgUrl: string | null = null;

      // STEP 1: Default fallback (always safe)
      const defaultBg =
        resolvedTheme === "dark" ? "/background2.png" : "/background.png";

      // STEP 2: Read cached background (safe sync)
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("user_background_url");
        if (cached) {
          bgUrl = cached;
        }
      }

      // STEP 3: Try API only if user exists (non-blocking)
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user_data");

        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            const userId = parsed?.id;

            if (userId) {
              try {
                const res = await ProfileService.getProfileBackground(userId);

                if (res?.backgroundImageUrl) {
                  bgUrl = res.backgroundImageUrl;

                  localStorage.setItem("user_background_url", bgUrl);
                }
              } catch (err) {
                console.warn("Background API failed, using fallback");
              }
            }
          } catch {
            console.warn("Invalid user_data in localStorage");
          }
        }
      }

      // STEP 4: final fallback
      if (!bgUrl) {
        bgUrl = defaultBg;
      }

      // APPLY
      document.documentElement.style.setProperty(
        "--app-background-image",
        `url("${bgUrl}")`,
      );
    } catch (error) {
      console.error("Failed to apply background", error);
    }
  }, [resolvedTheme]);

  /* run on mount */
  React.useEffect(() => {
    applyBackground();
  }, [applyBackground]);

  /* listen for updates */
  React.useEffect(() => {
    window.addEventListener("profile-updated", applyBackground);

    return () => {
      window.removeEventListener("profile-updated", applyBackground);
    };
  }, [applyBackground]);

  return null;
}

/* =====================================================
   MAIN LAYOUT
===================================================== */

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

      {/* ROUTING LAYOUT CONTROL */}
      {isPublicRoute ? children : <AppShell>{children}</AppShell>}
    </ThemeProvider>
  );
}

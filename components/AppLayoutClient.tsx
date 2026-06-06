"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import AppShell from "@/components/AppShell";
import { ThemeProvider } from "@/components/theme-provider";
import { ProfileService } from "@/services/profile.service";

function BackgroundManager() {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    const applyBackground = async () => {
      try {
        const storedUser = localStorage.getItem("user_data");

        let userId: string | null = null;

        if (storedUser) {
          try {
            userId = JSON.parse(storedUser).id;
          } catch {
            userId = null;
          }
        }

        let bgUrl: string | null = null;

        // 1. TRY API (REAL SOURCE)
        if (userId) {
          try {
            const res = await ProfileService.getProfileBackground(userId);

            if (res?.backgroundImageUrl) {
              bgUrl = res.backgroundImageUrl;

              // cache it
              localStorage.setItem("user_background_url", bgUrl);
            }
          } catch (err) {
            console.warn("Profile background API failed, using fallback");
          }
        }

        // 2. FALLBACK LOCAL CACHE
        if (!bgUrl) {
          const cached = localStorage.getItem("user_background_url");
          if (cached) {
            bgUrl = cached;
          }
        }

        // 3. FINAL FALLBACK (SYSTEM DEFAULT)
        if (!bgUrl) {
          bgUrl =
            resolvedTheme === "dark" ? "/background2.png" : "/background.png";
        }

        document.documentElement.style.setProperty(
          "--app-background-image",
          `url("${bgUrl}")`,
        );
      } catch (error) {
        console.error("Failed to apply background", error);
      }
    };

    applyBackground();

    window.addEventListener("profile-updated", applyBackground);

    return () => {
      window.removeEventListener("profile-updated", applyBackground);
    };
  }, [resolvedTheme]);

  return null;
}

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
      <BackgroundManager />

      {isPublicRoute ? children : <AppShell>{children}</AppShell>}
    </ThemeProvider>
  );
}

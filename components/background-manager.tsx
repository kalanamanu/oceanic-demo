"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { ProfileService } from "@/services/profile.service";

function getUserId() {
  const stored = localStorage.getItem("user_data");
  if (!stored) return null;

  try {
    return JSON.parse(stored).id;
  } catch {
    return null;
  }
}

export default function BackgroundManager() {
  const { resolvedTheme } = useTheme();

  const applyBackground = async () => {
    const userId = getUserId();

    let bgUrl: string | null = null;

    try {
      // 1. Try user profile background
      if (userId) {
        try {
          const res = await ProfileService.getProfileBackground(userId);

          if (res?.backgroundImageUrl) {
            bgUrl = res.backgroundImageUrl;
          }
        } catch {
          // ignore API failure
        }
      }

      // 2. fallback to system default backgrounds
      if (!bgUrl) {
        bgUrl =
          resolvedTheme === "dark" ? "/background2.png" : "/background.png";
      }

      document.documentElement.style.setProperty(
        "--app-background-image",
        `url("${bgUrl}")`,
      );
    } catch (err) {
      console.error("Background load failed", err);
    }
  };

  // initial + theme change
  useEffect(() => {
    applyBackground();
  }, [resolvedTheme]);

  // global sync
  useEffect(() => {
    const handler = () => applyBackground();

    window.addEventListener("auth-user-changed", handler);

    return () => {
      window.removeEventListener("auth-user-changed", handler);
    };
  }, [resolvedTheme]);

  return null;
}

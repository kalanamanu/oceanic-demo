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

    try {
      let bgUrl = "";

      // 1. Try profile background
      if (userId) {
        try {
          const res = await ProfileService.getProfileBackground(userId);
          if (res?.backgroundImageUrl) {
            bgUrl = res.backgroundImageUrl;
          }
        } catch (e) {
          // ignore profile error → fallback
        }
      }

      // 2. fallback to default system backgrounds
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

  useEffect(() => {
    applyBackground();
  }, [resolvedTheme]);

  useEffect(() => {
    window.addEventListener("auth-user-changed", applyBackground);
    return () => window.removeEventListener("profile-updated", applyBackground);
  }, []);

  return null;
}

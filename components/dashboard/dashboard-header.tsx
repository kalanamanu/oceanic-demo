"use client";

import { Sun, Moon, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import type { UserData } from "@/types/auth.types";
import { ProfileService } from "@/services/profile.service";
import { Bell } from "lucide-react";
import { NotificationDropdown } from "@/components/notification/notification-dropdown";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const appVersionInfo = {
    buildVersion: "v1.3.3 - Pre Alpha",
    environment: "Production",
    lastSynced: "Just now",
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "U";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatRole = (role?: string) => {
    if (!role) return "";
    return role
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  // ===================== INITIAL LOAD =====================
  useEffect(() => {
    setMounted(true);

    const userData = AuthService.getCurrentUser();
    setUser(userData);

    const loadAvatar = async () => {
      try {
        if (!userData?.id) return;

        const res = await ProfileService.getProfileAvatar(userData.id);
        setAvatarUrl(res?.profilePictureUrl || null);
      } catch {
        console.log("Avatar load failed");
      } finally {
        setIsLoading(false);
      }
    };

    loadAvatar();
  }, []);

  // ===================== GLOBAL SYNC LISTENER =====================
  useEffect(() => {
    const handleUpdate = async () => {
      const userData = AuthService.getCurrentUser();
      setUser(userData);

      if (!userData?.id) return;

      try {
        const res = await ProfileService.getProfileAvatar(userData.id);
        setAvatarUrl(res?.profilePictureUrl || null);
      } catch {
        console.log("Avatar refresh failed");
      }
    };

    window.addEventListener("auth-user-changed", handleUpdate);

    return () => {
      window.removeEventListener("auth-user-changed", handleUpdate);
    };
  }, []);

  return (
    <div className="border-b border-border bg-card sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-6 py-5">
        {/* LOGO */}
        <div className="flex items-center gap-4">
          <img
            src={
              mounted && theme === "dark"
                ? "/oceanic-logo.png"
                : "/oceanic-logo-black.png"
            }
            alt="Oceanic Logo"
            className="h-10 w-auto object-contain"
          />

          <div className="hidden md:flex items-center gap-2 border-l pl-4 border-border h-5">
            <span className="text-[11px] font-mono font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded">
              {appVersionInfo.buildVersion}
            </span>
          </div>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <NotificationDropdown />
          {/* THEME */}
          <Toggle
            aria-label="Toggle theme"
            pressed={mounted ? theme === "dark" : false}
            onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
            size="sm"
            variant="outline"
            className="h-9 w-9 rounded-md p-0"
          >
            {mounted && theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Toggle>

          <div className="h-6 w-px bg-border mx-1" />

          {/* USER SECTION */}
          <div
            onClick={() => router.push("/profile")}
            className="flex items-center gap-3 cursor-pointer hover:bg-muted/40 px-2 py-1 rounded-lg transition"
          >
            {/* AVATAR */}
            <div className="h-9 w-9 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : user ? (
                <span className="text-xs font-bold text-primary">
                  {getUserInitials(user.firstName, user.lastName)}
                </span>
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            {/* NAME + ROLE */}
            <div className="text-left hidden sm:block max-w-[160px]">
              {isLoading ? (
                <>
                  <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-2.5 w-14 bg-muted animate-pulse rounded mt-1" />
                </>
              ) : user ? (
                <>
                  <p className="text-xs font-semibold text-foreground truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {formatRole(user.role)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold">Guest</p>
                  <p className="text-[10px] text-muted-foreground">
                    Not logged in
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

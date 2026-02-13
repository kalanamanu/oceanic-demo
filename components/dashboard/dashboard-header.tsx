"use client";

import { Ship, Sun, Moon, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useState } from "react";
import { AuthService } from "@/services/auth.service";
import type { UserData } from "@/types/auth.types";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const userData = AuthService.getCurrentUser();
    setUser(userData);
  }, []);

  // Format account type for display
  const formatAccountType = (type?: string) => {
    if (!type) return "";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Ship className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Oceanic Inquiry Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Maritime Services System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Toggle
            aria-label="Toggle theme"
            pressed={theme === "dark"}
            onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
            size="sm"
            variant="outline"
          >
            {theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Toggle>

          {/* User Info */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* User Details */}
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatAccountType(user.role)}
                </p>
              </div>
              {/* User Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
            </div>
          ) : (
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">
                Loading...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

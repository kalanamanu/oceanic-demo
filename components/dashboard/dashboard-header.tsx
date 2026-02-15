"use client";

import { Sun, Moon, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useState } from "react";
import { AuthService } from "@/services/auth.service";
import type { UserData } from "@/types/auth.types";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = AuthService.getCurrentUser();
    setUser(userData);
    setIsLoading(false);
  }, []);

  // Format account type for display
  const formatAccountType = (type?: string) => {
    if (!type) return "";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get user's initials for fallback avatar
  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "U";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="border-b border-border bg-card sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img
            src={
              theme === "dark" ? "/oceanic-logo-white.png" : "/oceanic-logo.png"
            }
            alt="Oceanic Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Right Section: Theme Toggle + Profile */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Toggle
            aria-label="Toggle theme"
            pressed={theme === "dark"}
            onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
            size="sm"
            variant="outline"
            className="h-9 w-9 rounded-md p-0 hover:bg-primary hover:text-primary-foreground cursor-pointer"
          >
            {theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Toggle>

          {/* Profile Section */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            {isLoading ? (
              // Loading state
              <div className="text-right">
                <div className="h-4 w-24 bg-muted animate-pulse rounded mb-1"></div>
                <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
              </div>
            ) : user ? (
              // User data loaded
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {user.department || formatAccountType(user.role)}
                </p>
              </div>
            ) : (
              // Fallback if no user
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground leading-tight">
                  Guest User
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  No Role
                </p>
              </div>
            )}

            {/* Profile Picture with Fallback */}
            <div className="relative">
              {user ? (
                // Try to load user profile picture, fallback to initials
                <div className="h-9 w-9 rounded-full border-2 border-border ring-2 ring-background overflow-hidden bg-primary/10 flex items-center justify-center">
                  <img
                    src="/profile-picture.png"
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Hide image on error and show initials
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-sm font-semibold text-primary">${getUserInitials(user.firstName, user.lastName)}</span>`;
                      }
                    }}
                  />
                </div>
              ) : (
                // Fallback avatar icon
                <div className="h-9 w-9 rounded-full border-2 border-border ring-2 ring-background overflow-hidden bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

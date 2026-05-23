"use client";

import {
  Sun,
  Moon,
  User,
  ChevronDown,
  ShieldCheck,
  HardDrive,
  Info,
  LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useState } from "react";
import { AuthService } from "@/services/auth.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { UserData } from "@/types/auth.types";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // App Meta Information Parameters
  const appVersionInfo = {
    buildVersion: "v2.4.1-stable",
    environment: "Production",
    lastSynced: "Just now",
  };

  useEffect(() => {
    setMounted(true);
    const userData = AuthService.getCurrentUser();
    setUser(userData);
    setIsLoading(false);
  }, []);

  const formatAccountType = (type?: string) => {
    if (!type) return "";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "U";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="border-b border-border bg-card sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* LOGO SECTION */}
        <div className="flex items-center gap-4">
          <img
            src={
              mounted && theme === "dark"
                ? "/oceanic-logo.png"
                : "/oceanic-logo-black.png"
            }
            alt="Oceanic Logo"
            className="h-10 w-auto object-contain transition-all"
          />
          <div className="hidden md:flex items-center gap-2 border-l pl-4 border-border h-5">
            <span className="text-[11px] font-mono font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded">
              {appVersionInfo.buildVersion}
            </span>
          </div>
        </div>

        {/* INTERACTIVE CONTROLS SECTION */}
        <div className="flex items-center gap-3">
          {/* THEME TOGGLE WORKFLOW */}
          <Toggle
            aria-label="Toggle theme"
            pressed={mounted ? theme === "dark" : false}
            onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
            size="sm"
            variant="outline"
            className="h-9 w-9 rounded-md p-0 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            {mounted && theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Toggle>

          {/* STANDALONE IDENTITY CONSOLE DROPDOWN */}
          <div className="h-6 w-px bg-border mx-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-1 pr-2 rounded-lg hover:bg-muted/60 transition-all flex items-center gap-3 border border-transparent data-[state=open]:border-border data-[state=open]:bg-muted/50"
              >
                {/* Visual Profile Avatar Block */}
                <div className="relative shrink-0">
                  {user ? (
                    <div className="h-8 w-8 rounded-full border border-border overflow-hidden bg-primary/10 flex items-center justify-center">
                      <img
                        src="/profile-picture.png"
                        alt={`${user.firstName} ${user.lastName}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-xs font-bold text-primary">${getUserInitials(user.firstName, user.lastName)}</span>`;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Inline Profile Label Context */}
                <div className="text-left hidden sm:block max-w-[140px]">
                  {isLoading ? (
                    <div className="space-y-1 py-1">
                      <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                      <div className="h-2.5 w-14 bg-muted animate-pulse rounded" />
                    </div>
                  ) : user ? (
                    <>
                      <p className="text-xs font-semibold text-foreground truncate leading-tight">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate leading-none mt-0.5">
                        {user.department || formatAccountType(user.role)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-foreground leading-tight">
                        Guest Profile
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                        Anonymous
                      </p>
                    </>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

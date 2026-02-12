import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
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
            className="h-9 w-9 rounded-md p-0 hover:bg-accent hover:text-accent-foreground"
          >
            {theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Toggle>

          {/* Profile Section */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground leading-tight">
                Demo User
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Management
              </p>
            </div>
            <img
              src="/profile-picture.png"
              alt="Profile Picture"
              className="h-9 w-9 rounded-full object-cover border-2 border-border ring-2 ring-background"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Ship, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="border-b border-border bg-card sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={
              theme === "dark" ? "/oceanic-logo-white.png" : "/oceanic-logo.png"
            }
            alt="Oceanic Logo"
            className="h-12 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-4">
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
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground">
              Demo User
            </p>
            <p className="text-xs text-muted-foreground">Management</p>
          </div>
        </div>
      </div>
    </div>
  );
}

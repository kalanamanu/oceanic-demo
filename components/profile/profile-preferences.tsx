"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ProfilePreferencesProps {
  theme?: "light" | "dark";
  notificationsEnabled?: boolean;

  onThemeChange: (theme: "light" | "dark") => void;
  onNotificationsChange: (enabled: boolean) => void;
}

export default function ProfilePreferences({
  theme = "light",
  notificationsEnabled = true,
  onThemeChange,
  onNotificationsChange,
}: ProfilePreferencesProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const handleThemeChange = async (value: "light" | "dark") => {
    setCurrentTheme(value);

    // UI update immediately
    setTheme(value);

    // backend + parent sync
    await onThemeChange(value);

    // update localStorage sync
    const stored = localStorage.getItem("user_data");

    if (stored) {
      const user = JSON.parse(stored);

      const updated = {
        ...user,
        profile: {
          ...user.profile,
          theme: value,
        },
      };

      localStorage.setItem("user_data", JSON.stringify(updated));
    }

    window.dispatchEvent(new Event("profile-updated"));
  };

  const resetBackground = () => {
    try {
      // remove custom background
      localStorage.removeItem("user_background_url");

      const defaultBg =
        (resolvedTheme || currentTheme) === "dark"
          ? "/background2.png"
          : "/background.png";

      document.documentElement.style.setProperty(
        "--app-background-image",
        `url("${defaultBg}")`,
      );

      window.dispatchEvent(new Event("profile-updated"));
    } catch (err) {
      console.error("Failed to reset background", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Manage your application settings and notification preferences
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-2">
          <Label>Theme</Label>

          <Select value={currentTheme} onValueChange={handleThemeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="light">Light Theme</SelectItem>
              <SelectItem value="dark">Dark Theme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between border rounded-lg p-4">
          <div>
            <h4 className="font-medium">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Receive system notifications and updates
            </p>
          </div>

          <Switch
            checked={notificationsEnabled}
            onCheckedChange={onNotificationsChange}
          />
        </div>

        {/* RESET BACKGROUND */}
        {/* <div className="pt-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={resetBackground}
          >
            Reset Background to Default
          </Button>
        </div> */}
      </CardContent>
    </Card>
  );
}

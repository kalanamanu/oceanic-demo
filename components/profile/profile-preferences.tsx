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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

          <Select
            value={theme}
            onValueChange={(value) => onThemeChange(value as "light" | "dark")}
          >
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
      </CardContent>
    </Card>
  );
}

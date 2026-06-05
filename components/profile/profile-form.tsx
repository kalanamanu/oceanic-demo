"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { User } from "@/types/user.types";
import { UserService } from "@/services/user.service";

import ProfileHeader from "./profile-header";
import ProfilePersonalInfo from "./profile-personal-info";
import ProfileOrganizationInfo from "./profile-organization-info";
import ProfilePreferences from "./profile-preferences";

import { Button } from "@/components/ui/button";

interface Props {
  user: User;
}

export default function ProfileForm({ user }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: user.id,

    // User fields
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    department: user.department,
    accountType: user.accountType,

    // Profile fields
    phone_number: user.profile?.phone_number || "",
    dob: user.profile?.dob || "",
    theme: user.profile?.theme || "light",
    notificationsEnabled: user.profile?.notificationsEnabled ?? true,
  });

  /**
   * Generic field update handler
   */
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await UserService.updateUser({
        id: form.id,

        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: form.role,
        department: form.department,
        accountType: form.accountType,

        phone_number: form.phone_number,
        dob: form.dob,
        theme: form.theme,
        notificationsEnabled: form.notificationsEnabled,
      });

      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <ProfileHeader user={user} />

      {/* PERSONAL INFO */}
      <ProfilePersonalInfo
        firstName={form.firstName}
        lastName={form.lastName}
        email={form.email}
        phone_number={form.phone_number}
        dob={form.dob}
        onChange={handleChange}
      />

      {/* ORGANIZATION INFO */}
      <ProfileOrganizationInfo
        role={form.role}
        department={form.department}
        accountType={form.accountType}
      />

      {/* PREFERENCES */}
      <ProfilePreferences
        theme={form.theme}
        notificationsEnabled={form.notificationsEnabled}
        onThemeChange={(theme) => handleChange("theme", theme)}
        onNotificationsChange={(value) =>
          handleChange("notificationsEnabled", value)
        }
      />

      {/* SAVE BUTTON */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

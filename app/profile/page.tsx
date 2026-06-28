"use client";

import * as React from "react";
import { toast } from "sonner";

import { User } from "@/types/user.types";
import { UserService } from "@/services/user.service";

import ProfileForm from "@/components/profile/profile-form";
import ProfileChangePassword from "@/components/profile/profile-change-password";

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  /**
   * SAFE USER ID LOADER
   */
  const getUserId = () => {
    if (typeof window === "undefined") return null;

    try {
      const raw = localStorage.getItem("user_data");
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      return parsed?.id || null;
    } catch (e) {
      console.error("Invalid user_data in localStorage");
      return null;
    }
  };

  /**
   * Load profile safely
   */
  const loadProfile = async () => {
    try {
      setLoading(true);

      const userId = getUserId();

      if (!userId) {
        throw new Error("User ID not found. Please login again.");
      }

      const data = await UserService.getUserById(userId);

      setUser(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadProfile();
  }, []);

  /**
   * LOADING STATE
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  /**
   * ERROR / EMPTY STATE
   */
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            Profile not found. Please login again.
          </p>
        </Card>
      </div>
    );
  }

  /**
   * MAIN UI
   */
  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6">
      {/* PROFILE DETAILS */}
      <ProfileForm user={user} />
    </div>
  );
}

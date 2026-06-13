"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "@/services/auth.service";
import { UserStorage } from "@/lib/user-storage";
import { useRouter } from "next/navigation";

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accountType: "admin" | "user" | "management" | "team_head";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await AuthService.checkAuth();

      if (currentUser) {
        setUser(currentUser);
      } else {
        // fallback to cached user
        const cachedUser = UserStorage.getUser();
        setUser(cachedUser || null);
      }
    } catch {
      const cachedUser = UserStorage.getUser();
      setUser(cachedUser || null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔥 IMPORTANT FIX:
   * Notify the whole app (background, header, layout, etc.)
   * whenever auth state changes.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.dispatchEvent(new Event("auth-user-changed"));
  }, [user]);

  const logout = async () => {
    try {
      await AuthService.logout();

      setUser(null);

      // trigger global sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-user-changed"));
      }

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isAdmin = user?.accountType === "admin";
  const isManager = user?.accountType === "management";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        logout,
        isAdmin,
        isManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

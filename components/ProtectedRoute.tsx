"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAccountTypes?: Array<"admin" | "user" | "manager">;
  fallbackUrl?: string;
}

export function ProtectedRoute({
  children,
  requiredAccountTypes,
  fallbackUrl = "/dashboard",
}: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAuthAndPermissions();
  }, []);

  const checkAuthAndPermissions = async () => {
    try {
      // First check local storage for quick check
      if (!AuthService.isAuthenticated()) {
        router.push("/login");
        return;
      }

      // Validate with server (checks cookie and gets fresh user data)
      const currentUser = await AuthService.checkAuth();

      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      // If no specific account types required, grant access
      if (!requiredAccountTypes || requiredAccountTypes.length === 0) {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      // Check if user's account type is in the required list
      const userHasPermission = requiredAccountTypes.includes(
        currentUser.accountType,
      );
      setHasAccess(userHasPermission);
      setLoading(false);
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/login");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // User doesn't have required permissions
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-xl border border-border bg-card p-8 text-center shadow-lg">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-2">
            You don't have permission to access this page.
          </p>
          {requiredAccountTypes && (
            <p className="text-sm text-muted-foreground mb-6">
              This module is restricted to:{" "}
              <span className="font-semibold text-foreground">
                {requiredAccountTypes.join(", ")}
              </span>
            </p>
          )}
          <div className="space-y-2">
            <Button onClick={() => router.push(fallbackUrl)} className="w-full">
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // User has access
  return <>{children}</>;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  if (!AuthService.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}

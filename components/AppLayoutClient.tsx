"use client";

import { usePathname } from "next/navigation";
import AppShell from "@/components/AppShell";
import { ThemeProvider } from "@/components/theme-provider";

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const publicRoutes = [
    "/login",
    "/login-otp",
    "/forgot-password",
    "/reset-password",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname?.startsWith(route),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {isPublicRoute ? children : <AppShell>{children}</AppShell>}
    </ThemeProvider>
  );
}

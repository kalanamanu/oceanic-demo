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
  const isAuthPage = pathname === "/login" || pathname === "/login-otp";

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {isAuthPage ? children : <AppShell>{children}</AppShell>}
    </ThemeProvider>
  );
}

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
  const isLoginPage = pathname === "/login";

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {isLoginPage ? children : <AppShell>{children}</AppShell>}
    </ThemeProvider>
  );
}

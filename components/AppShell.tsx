"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Analytics } from "@vercel/analytics/next";

const SIDEBAR_EXPANDED_WIDTH = "14rem";
const SIDEBAR_COLLAPSED_WIDTH = "4rem";
const HEADER_HEIGHT = "4rem";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
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

  const [collapsed, setCollapsed] = React.useState(false);

  const sidebarWidth = collapsed
    ? SIDEBAR_COLLAPSED_WIDTH
    : SIDEBAR_EXPANDED_WIDTH;

  // 🚨 IMPORTANT: Do NOT render shell for public pages
  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {/* HEADER */}
      <div
        className="fixed top-0 left-0 right-0 z-40 bg-card"
        style={{ height: HEADER_HEIGHT }}
      >
        <DashboardHeader />
      </div>

      {/* SIDEBAR */}
      <div
        style={{
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
          zIndex: 30,
          height: `calc(100vh - ${HEADER_HEIGHT})`,
          width: sidebarWidth,
          transition: "width 0.2s",
        }}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* MAIN CONTENT */}
      <div
        className="min-h-screen transition-all duration-200"
        style={{
          marginLeft: sidebarWidth,
          paddingTop: HEADER_HEIGHT,
        }}
      >
        <div className="p-6">{children}</div>
        <Analytics />
      </div>
    </>
  );
}

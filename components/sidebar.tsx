"use client";

import { useState } from "react";
import {
  FileText,
  ListChecks,
  BarChart,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

const sidebarItems = [
  { value: "dashboard", label: "Dashboard", icon: Gauge, path: "/dashboard" },
  { value: "inquiries", label: "Inquiries", icon: FileText, path: "/inquiry" },
  {
    value: "audit",
    label: "Audit Trail",
    icon: ListChecks,
    path: "/audit-trail",
  },
  { value: "reports", label: "Reports", icon: BarChart, path: "/reports" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Determine the activeTab based on current path
  const activeTab =
    sidebarItems.find((i) => pathname.startsWith(i.path))?.value || "dashboard";

  return (
    <aside
      className={`relative min-h-full bg-card border-r border-border py-4 flex flex-col transition-all duration-200 ${
        collapsed ? "w-16 px-2" : "w-56 px-4"
      }`}
      data-collapsed={collapsed}
    >
      {/* Floating middle toggle button on sidebar border */}
      <button
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setCollapsed((c) => !c)}
        className={`
          absolute
          top-1/2
          -right-3
          z-20
          w-7 h-7 flex items-center justify-center
          rounded-full
          bg-primary
          text-white
          border border-border
          opacity-20
          hover:opacity-100 focus:opacity-100
          shadow
          transition-all duration-200
          group
          pointer-events-auto
        `}
        style={{ transform: "translateY(-50%)" }}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Nav items */}
      <nav className="flex flex-col gap-2 flex-1 mt-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.value}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 text-sm rounded-md py-2 font-medium transition-colors
                ${
                  activeTab === item.value
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-muted-foreground"
                }
                ${collapsed ? "justify-center px-0" : "justify-start px-4"}`}
              data-testid={`sidebar-item-${item.value}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-border flex flex-col items-center">
        <Button
          variant="ghost"
          size={collapsed ? "icon-sm" : "default"}
          className="w-full justify-center"
          aria-label="Logout"
          onClick={() => alert("Logged out!")}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}

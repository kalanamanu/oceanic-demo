"use client";

import {
  FileText,
  ListChecks,
  BarChart,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Package,
  Clipboard,
  Users,
  BadgeDollarSign,
  Truck,
  Tags,
  ListTodo,
  ClipboardList,
  FilePenLine,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { AuthService } from "@/services/auth.service";

// Role-based sidebar configuration
const sidebarConfig = {
  admin: [
    { value: "dashboard", label: "Dashboard", icon: Gauge, path: "/dashboard" },
    {
      value: "audit",
      label: "Audit Trail",
      icon: ListChecks,
      path: "/audit-trail",
    },
    { value: "users", label: "Users", icon: Users, path: "/users" },
    { value: "basis", label: "Basis", icon: BadgeDollarSign, path: "/basis" },
    { value: "vendors", label: "Vendors", icon: Truck, path: "/vendors" },
    {
      value: "categories",
      label: "Categories",
      icon: Tags,
      path: "/categories",
    },
    {
      value: "picTasks",
      label: "PIC Tasks",
      icon: ClipboardList,
      path: "/pic-tasks",
    },
    {
      value: "inquiries",
      label: "Inquiries",
      icon: FileText,
      path: "/inquiry",
    },
    { value: "myTasks", label: "My Tasks", icon: ListTodo, path: "/my-tasks" },
    {
      value: "preCost",
      label: "Pre Cost",
      icon: FilePenLine,
      path: "/quotation",
    },
  ],

  management: [
    { value: "dashboard", label: "Dashboard", icon: Gauge, path: "/dashboard" },
    { value: "basis", label: "Basis", icon: BadgeDollarSign, path: "/basis" },
    { value: "vendors", label: "Vendors", icon: Truck, path: "/vendors" },
    {
      value: "categories",
      label: "Categories",
      icon: Tags,
      path: "/categories",
    },
    {
      value: "picTasks",
      label: "PIC Tasks",
      icon: ClipboardList,
      path: "/pic-tasks",
    },
    {
      value: "inquiries",
      label: "Inquiries",
      icon: FileText,
      path: "/inquiry",
    },
    { value: "myTasks", label: "My Tasks", icon: ListTodo, path: "/my-tasks" },
    {
      value: "preCost",
      label: "Pre Cost",
      icon: FilePenLine,
      path: "/quotation",
    },
  ],

  team_head: [
    { value: "dashboard", label: "Dashboard", icon: Gauge, path: "/dashboard" },
    {
      value: "categories",
      label: "Categories",
      icon: Tags,
      path: "/categories",
    },
    {
      value: "picTasks",
      label: "PIC Tasks",
      icon: ClipboardList,
      path: "/pic-tasks",
    },
    {
      value: "inquiries",
      label: "Inquiries",
      icon: FileText,
      path: "/inquiry",
    },
    { value: "myTasks", label: "My Tasks", icon: ListTodo, path: "/my-tasks" },
    {
      value: "preCost",
      label: "Pre Cost",
      icon: FilePenLine,
      path: "/quotation",
    },
  ],

  staff: [
    { value: "dashboard", label: "Dashboard", icon: Gauge, path: "/dashboard" },
    {
      value: "inquiries",
      label: "Inquiries",
      icon: FileText,
      path: "/inquiry",
    },
    { value: "myTasks", label: "My Tasks", icon: ListTodo, path: "/my-tasks" },
    {
      value: "preCost",
      label: "Pre Cost",
      icon: FilePenLine,
      path: "/quotation",
    },
  ],
};

// Map backend values if needed
const roleMap: Record<string, keyof typeof sidebarConfig> = {
  admin: "admin",
  management: "management",
  team_head: "team_head",
  staff: "staff",
};

export interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  headerHeight?: string;
}

export function Sidebar({
  collapsed,
  setCollapsed,
  headerHeight = "4rem",
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Get user from backend (more reliable than localStorage only)
  useEffect(() => {
    AuthService.checkAuth().then(setUser);
  }, []);

  const userAccountType = user?.accountType;

  // Get sidebar items based on role
  const sidebarItems = useMemo(() => {
    if (!userAccountType) return [];

    const roleKey = roleMap[userAccountType] || "staff";
    return sidebarConfig[roleKey] || [];
  }, [userAccountType]);

  const activeTab =
    sidebarItems.find((i) => pathname.startsWith(i.path))?.value || "dashboard";

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await AuthService.logout();
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ⚠️ Prevent rendering before auth loads
  if (!userAccountType) return null;

  return (
    <aside
      className={`fixed left-0 bg-card border-r border-border py-4 flex flex-col transition-all duration-200 z-30
      ${collapsed ? "w-16 px-2" : "w-56 px-4"} mt-4`}
      data-collapsed={collapsed}
      style={{
        minHeight: "0",
        height: `calc(100vh - ${headerHeight})`,
        top: headerHeight,
      }}
    >
      {/* Toggle Button */}
      <button
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-1/2 -right-3 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white border border-border opacity-20 hover:opacity-100 shadow transition-all"
        style={{ transform: "translateY(-50%)" }}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Nav */}
      <nav className="flex flex-col gap-2 flex-1 mt-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.value}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 text-sm rounded-md py-2 px-3 transition-colors font-medium
                ${collapsed ? "justify-center" : "justify-start"}
                ${
                  activeTab === item.value
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mb-2 mt-8 border-t border-border/70 pt-6">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center gap-3 rounded-md py-2 px-3 w-full transition-colors font-medium
            hover:bg-destructive/10 hover:text-destructive text-muted-foreground
            ${collapsed ? "justify-center" : "justify-start"}
            disabled:opacity-50`}
        >
          <LogOut
            className={`h-5 w-5 ${isLoggingOut ? "animate-pulse" : ""}`}
          />
          {!collapsed && (
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}

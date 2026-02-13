"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import StatCards from "@/components/dashboard/dashboard-statcards";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import DashboardTable from "@/components/dashboard/dashboard-table";
import { VesselInquiryDialog } from "@/components/inquiry/AddVesselInquiryDialog";
import { FileText, Clock, CheckCircle, Building2, Package } from "lucide-react";
import { AuthService } from "@/services/auth.service";
import type { UserData } from "@/types/auth.types";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!AuthService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Get user data
    const userData = AuthService.getCurrentUser();
    if (userData) {
      setUser(userData);
    } else {
      // User data missing, redirect to login
      router.push("/login");
    }

    setIsLoading(false);
  }, [router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if no user
  if (!user) {
    return null;
  }

  const stats = [
    {
      label: "Total Inquiries",
      value: 120,
      color: "blue" as const,
      icon: FileText,
    },
    {
      label: "Pending Inquiries",
      value: 24,
      color: "orange" as const,
      icon: Clock,
    },
    {
      label: "Confirmed Inquiries",
      value: 52,
      color: "green" as const,
      icon: CheckCircle,
    },
    {
      label: "Active Vendors",
      value: 12,
      color: "cyan" as const,
      icon: Building2,
    },
    {
      label: "Active Products",
      value: 47,
      color: "violet" as const,
      icon: Package,
    },
  ];

  const activities = [
    {
      id: "1",
      activity: "Inquiry OMS-2026-005 created",
      by: "Maria Santos",
      time: "2 hours ago",
    },
    {
      id: "2",
      activity: "OMS-2026-003 confirmed by vendor",
      by: "John Silva",
      time: "4 hours ago",
    },
    {
      id: "3",
      activity: "New vendor 'Pacific Supplies' activated",
      by: "Purchasing Head",
      time: "Yesterday",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl space-y-8">
        {/* Welcome Card */}
        <section>
          <WelcomeCard
            name={`${user.firstName} ${user.lastName}`}
            department={user.department || user.role}
            accountType={user.accountType}
          />
        </section>

        {/* Stat Cards */}
        <section className="pt-2">
          <StatCards stats={stats} />
        </section>

        {/* Recent Activities Section */}
        <section className="pt-4">
          {/* Enhanced Table Card */}
          <DashboardTable activities={activities} />
        </section>

        {/* Bottom Spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}

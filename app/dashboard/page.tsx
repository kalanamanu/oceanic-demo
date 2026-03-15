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
      //router.push("/login");
    }

    setIsLoading(false);
  }, [router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="relative min-h-screen bg-backgroundColor">
      {/* Background layers */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Base dark maritime gradient */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/10" /> */}

        {/* Teal wave glows */}
        <div className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/3 -right-48 h-[36rem] w-[36rem] rounded-full bg-accent/18 blur-3xl" />
        <div className="absolute -bottom-56 left-1/4 h-[40rem] w-[40rem] rounded-full bg-primary/12 blur-3xl" />

        {/* Subtle mesh/grid lines (gives that “network” feel like the image) */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* Vignette to keep edges darker */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl space-y-8">
        <section>
          <WelcomeCard
            name={`${user.firstName} ${user.lastName}`}
            department={user.department || user.role}
            accountType={user.accountType}
          />
        </section>

        <section className="pt-2">
          <StatCards stats={stats} />
        </section>

        <section className="pt-4">
          <DashboardTable activities={activities} />
        </section>

        <div className="h-8" />
      </div>
    </div>
  );
}

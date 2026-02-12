"use client";

import { Button } from "@/components/ui/button";
import StatCards from "@/components/dashboard/dashboard-statcards";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import DashboardTable from "@/components/dashboard/dashboard-table";
import { VesselInquiryDialog } from "@/components/inquiry/AddVesselInquiryDialog";
import { FileText, Clock, CheckCircle, Building2, Package } from "lucide-react";

export default function Dashboard() {
  const name = "Jane Doe";
  const department = "Operations";

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
          <WelcomeCard name={name} department={department} />
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

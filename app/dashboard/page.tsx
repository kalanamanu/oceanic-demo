"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { StatsCards } from "@/components/stats-cards";
import { InquiryTable } from "@/components/inquiry-table";
import { InquiryDetailPanel } from "@/components/inquiry-detail-panel";
import { FilterBar } from "@/components/filter-bar";
import { AuditLog } from "@/components/audit-log";
import { sampleInquiries, sampleRemarks } from "@/lib/data";
import type { Inquiry } from "@/lib/types";
import { Sidebar } from "@/components/sidebar";

export default function Dashboard() {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("inquiries");

  // Calculate dashboard stats
  const stats = {
    totalInquiries: sampleInquiries.length,
    pendingCount: sampleInquiries.filter((i) => i.status === "Pending").length,
    activeCount: sampleInquiries.filter((i) => i.status === "Active").length,
    confirmedCount: sampleInquiries.filter((i) => i.status === "Confirmed")
      .length,
    rejectedCount: sampleInquiries.filter((i) => i.status === "Rejected")
      .length,
  };

  // Sample audit log entries
  const auditEntries = [
    {
      id: "1",
      action: "Created",
      user: "Admin User",
      timestamp: "2026-01-10T09:00:00Z",
      details: "New inquiry OMS-2026-001 created for MV Pacific Star",
    },
    {
      id: "2",
      action: "Assigned",
      user: "Purchasing Head",
      timestamp: "2026-01-10T09:15:00Z",
      details: "OMS-2026-001 assigned to John Silva",
    },
    {
      id: "3",
      action: "Updated",
      user: "Maria Santos",
      timestamp: "2026-01-11T15:20:00Z",
      details: "OMS-2026-002 quotation submitted",
    },
    {
      id: "4",
      action: "Status Changed",
      user: "Maria Santos",
      timestamp: "2026-01-11T15:30:00Z",
      details: "OMS-2026-002 status changed to Active",
    },
    {
      id: "5",
      action: "Status Changed",
      user: "Ahmed Hassan",
      timestamp: "2026-01-09T16:30:00Z",
      details: "OMS-2026-003 confirmed by client",
    },
  ];

  const handleSelectInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setDetailPanelOpen(true);
  };

  const handleExport = () => {
    alert(
      "Export feature would generate Excel/PDF reports with selected filters"
    );
  };

  const handleCreateNew = () => {
    alert("Create new inquiry form would open");
  };

  // Main content for each tab
  function renderTabContent() {
    if (activeTab === "inquiries")
      return (
        <>
          <FilterBar onExport={handleExport} onCreateNew={handleCreateNew} />
          <InquiryTable
            inquiries={sampleInquiries}
            onSelectInquiry={handleSelectInquiry}
          />
        </>
      );
    if (activeTab === "audit") return <AuditLog entries={auditEntries} />;
    if (activeTab === "reports")
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border p-6 bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Inquiry Performance Report
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              View metrics on inquiry processing times and PIC performance
            </p>
            <button className="text-sm text-primary hover:underline font-medium">
              Generate Report →
            </button>
          </div>
          <div className="rounded-lg border border-border p-6 bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Status Summary Report
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Export inquiry status distribution by date range, port, or agent
            </p>
            <button className="text-sm text-primary hover:underline font-medium">
              Generate Report →
            </button>
          </div>
        </div>
      );
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />

      <main className="flex flex-1">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main content */}
        <div className="flex-1 space-y-6 p-6">
          {/* Stats Cards */}
          <section>
            <StatsCards stats={stats} />
          </section>

          {/* Content changes based on active sidebar tab */}
          <section className="space-y-4">{renderTabContent()}</section>
        </div>
      </main>

      {/* Detail Panel */}
      {detailPanelOpen && (
        <InquiryDetailPanel
          inquiry={selectedInquiry}
          remarks={sampleRemarks}
          onClose={() => setDetailPanelOpen(false)}
        />
      )}
    </div>
  );
}

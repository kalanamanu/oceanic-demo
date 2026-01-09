"use client";

import { useState } from "react";
import { StatsCards } from "@/components/inquiry/stats-cards";
import { FilterBar } from "@/components/inquiry/filter-bar";
import { InquiryTable } from "@/components/inquiry/inquiry-table";
import { InquiryDetailPanel } from "@/components/inquiry/inquiry-detail-panel";

// Sample/mock data imports
import { sampleInquiries, sampleRemarks } from "@/lib/data";
import type { Inquiry } from "@/lib/types";

export default function InquiryPage() {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  // Calculate dashboard stats from sampleInquiries
  const stats = {
    totalInquiries: sampleInquiries.length,
    pendingCount: sampleInquiries.filter((i) => i.status === "Pending").length,
    activeCount: sampleInquiries.filter((i) => i.status === "Active").length,
    confirmedCount: sampleInquiries.filter((i) => i.status === "Confirmed")
      .length,
    rejectedCount: sampleInquiries.filter((i) => i.status === "Rejected")
      .length,
  };

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex flex-1">
        <div className="flex-1 p-6 space-y-6">
          {/* Stat Cards */}
          <StatsCards stats={stats} />

          {/* Filter and Table */}
          <section className="space-y-4">
            <FilterBar onExport={handleExport} onCreateNew={handleCreateNew} />
            <InquiryTable
              inquiries={sampleInquiries}
              onSelectInquiry={handleSelectInquiry}
            />
          </section>
        </div>
      </main>
      {/* Inquiry Detail Panel */}
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

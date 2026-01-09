"use client";

import { useState } from "react";
import { StatsCards } from "@/components/inquiry/stats-cards";
import { FilterBar } from "@/components/inquiry/filter-bar";
import { InquiryTable } from "@/components/inquiry/inquiry-table";
import { InquiryDetailDialog } from "@/components/inquiry/InquiryDetailDialog";

// Sample/mock data imports
import { sampleInquiries, sampleRemarks } from "@/lib/data";
import type { Inquiry } from "@/lib/types";

export default function InquiryPage() {
  // Keep inquiries in state so edits can update them!
  const [inquiries, setInquiries] = useState<Inquiry[]>(sampleInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  // Calculate dashboard stats from inquiries in state
  const stats = {
    totalInquiries: inquiries.length,
    pendingCount: inquiries.filter((i) => i.status === "Pending").length,
    activeCount: inquiries.filter((i) => i.status === "Active").length,
    confirmedCount: inquiries.filter((i) => i.status === "Confirmed").length,
    rejectedCount: inquiries.filter((i) => i.status === "Rejected").length,
  };

  // Select an inquiry
  const handleSelectInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setDetailPanelOpen(true);
  };

  // Update an inquiry after editing
  const handleEditInquiry = (updatedInquiry: Inquiry) => {
    // Update the inquiry in state
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === updatedInquiry.id ? updatedInquiry : inq))
    );
    setSelectedInquiry(updatedInquiry);
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
              inquiries={inquiries}
              onSelectInquiry={handleSelectInquiry}
            />
          </section>
        </div>
      </main>
      {/* Inquiry Detail Dialog with Edit support */}
      {detailPanelOpen && selectedInquiry && (
        <InquiryDetailDialog
          inquiry={selectedInquiry}
          remarks={sampleRemarks}
          open={detailPanelOpen}
          onClose={() => setDetailPanelOpen(false)}
          onEditInquiry={handleEditInquiry}
        />
      )}
    </div>
  );
}

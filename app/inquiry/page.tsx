"use client";

import { useState, useEffect } from "react";
import { StatsCards } from "@/components/inquiry/stats-cards";
import { FilterBar } from "@/components/inquiry/filter-bar";
import { InquiryTable } from "@/components/inquiry/inquiry-table";
import { InquiryDetailDialog } from "@/components/inquiry/InquiryDetailDialog";
import { InquiryService } from "@/services/inquiry.service";
import type { Inquiry } from "@/types/inquiry.types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// sampleRemarks can stay from data since remarks aren't fetched yet.
import { sampleRemarks } from "@/lib/data";

export default function InquiryPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const statusOptions = Array.from(
    new Set(inquiries.map((i) => i.status || "Pending")),
  );

  const portOptions = Array.from(
    new Set(inquiries.map((i) => i.port).filter(Boolean)),
  );

  const picOptions = Array.from(
    new Set(
      inquiries
        .flatMap((i) => [
          i.key_pic?.name,
          ...(i.other_pics?.map((p) => p.name) || []),
        ])
        .filter(
          (name): name is string => typeof name === "string" && name.length > 0,
        ),
    ),
  );

  const filteredInquiries = inquiries.filter((inq) => {
    const q = searchQuery.toLowerCase();

    return (
      inq.vessel_name?.toLowerCase().includes(q) ||
      inq.agent?.toLowerCase().includes(q) ||
      inq.port?.toLowerCase().includes(q) ||
      inq.inq_id?.toLowerCase().includes(q)
    );
  });
  useEffect(() => {
    fetchInquiries(page);
  }, [page]);

  const fetchInquiries = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await InquiryService.getAllInquiries({
        page: pageNumber,
        pageSize: 10,
      });
      if (response.success && response.data) {
        setInquiries(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

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
      prev.map((inq) => (inq.id === updatedInquiry.id ? updatedInquiry : inq)),
    );
    setSelectedInquiry(updatedInquiry);
  };

  const handleExport = () => {
    alert(
      "Export feature would generate Excel/PDF reports with selected filters",
    );
  };

  const handleCreateNew = () => {
    alert("Create new inquiry form would open");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-1">
        <div className="flex-1 p-6 space-y-6">
          {/* Stat Cards */}
          <StatsCards stats={stats} />

          {/* Filter and Table */}
          <section className="space-y-4">
            <FilterBar
              onExport={handleExport}
              onCreateNew={handleCreateNew}
              onSearch={(value) => setSearchQuery(value)}
              statusOptions={statusOptions}
              portOptions={portOptions}
              picOptions={picOptions}
            />

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
                <span className="ml-3 text-sm text-muted-foreground font-medium">
                  Loading inquiries...
                </span>
              </div>
            ) : (
              <>
                <InquiryTable
                  inquiries={filteredInquiries}
                  onSelectInquiry={handleSelectInquiry}
                />

                {/* Pagination Controls */}
                <div className="flex justify-end items-center space-x-2 mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground mr-4">
                    Page {page} of {totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages || 1, p + 1))
                    }
                    disabled={page >= (totalPages || 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
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

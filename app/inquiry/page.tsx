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

  // Options for filters
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

  // Client-side search filtering
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

  // Dashboard stats
  const stats = {
    totalInquiries: inquiries.length,
    pendingCount: inquiries.filter((i) => i.status === "Pending").length,
    activeCount: inquiries.filter((i) => i.status === "Active").length,
    confirmedCount: inquiries.filter((i) => i.status === "Confirmed").length,
    rejectedCount: inquiries.filter((i) => i.status === "Rejected").length,
  };

  const handleSelectInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setDetailPanelOpen(true);
  };

  const handleEditInquiry = (updatedInquiry: Inquiry) => {
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
    /* flex-1 ensure the page takes full height without clipping content */
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Dashboard Header/Stats */}
          <StatsCards stats={stats} />

          {/* Action and Filter Bar */}
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
              <div className="flex flex-col justify-center items-center py-32 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
                <span className="text-sm text-muted-foreground font-medium animate-pulse">
                  Loading inquiries...
                </span>
              </div>
            ) : (
              <div className="rounded-xl border bg-card shadow-sm">
                <InquiryTable
                  inquiries={filteredInquiries}
                  onSelectInquiry={handleSelectInquiry}
                />

                {/* Pagination Controls */}
                <div className="flex justify-between items-center px-6 py-4 border-t border-border bg-muted/5">
                  <p className="text-xs text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {filteredInquiries.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                      {inquiries.length}
                    </span>{" "}
                    results
                  </p>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground mr-2">
                      Page {page} of {totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages || 1, p + 1))
                      }
                      disabled={page >= (totalPages || 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 
          Inquiry Detail Dialog
          Rendered via React Portal (Radix Dialog) 
      */}
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

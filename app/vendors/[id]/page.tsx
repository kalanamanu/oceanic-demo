"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { VendorService } from "@/services/vendor.service";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { VendorStatusBadge } from "@/components/vendor/VendorStatusBadge";

// Refactored Section Components
import { VendorGeneralInfo } from "@/components/vendor/VendorGeneralInfo";
import { VendorPICSection } from "@/components/vendor/VendorPICSection";
import { VendorCategoryCard } from "@/components/vendor/VendorCategoryCard";
import { VendorApprovalCard } from "@/components/vendor/VendorApprovalCard";

// Using the View Only version of the document section
import { VendorDocumentViewOnly } from "@/components/vendor/VendorDocumentViewOnly";

export default function VendorViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [vendor, setVendor] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const loadVendor = async () => {
    try {
      setLoading(true);
      const res = await VendorService.getVendorById(id as string);
      setVendor(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load vendor");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) loadVendor();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen animate-pulse">
        Loading vendor...
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Vendor not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background">
      {/* ================= HEADER ================= */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{vendor.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground font-mono">
                  ID: {vendor.vendor_id}
                </span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/vendors/edit/${vendor.vendor_id}`)}
          >
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Core Info & PICs */}
          <div className="lg:col-span-2 space-y-6">
            <VendorGeneralInfo vendor={vendor} />
            <VendorPICSection pics={vendor.pics} />
          </div>

          {/* RIGHT COLUMN: Metadata & Status */}
          <div className="space-y-6">
            <VendorCategoryCard categories={vendor.categories} />

            <VendorApprovalCard
              vendorId={vendor.vendor_id}
              status={vendor.status}
              onRefresh={loadVendor}
            />
          </div>
        </div>

        {/* BOTTOM SECTION: Documents (View Only Mode) */}
        <VendorDocumentViewOnly vendorId={vendor.vendor_id} />
      </main>
    </div>
  );
}

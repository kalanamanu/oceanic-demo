"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { VendorService } from "@/services/vendor.service";
import { VendorForm } from "@/components/vendor/VendorForm";
import { VendorDocumentSection } from "@/components/vendor/VendorDocumentSection";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditVendorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [vendor, setVendor] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const response = await VendorService.getVendorById(id as string);

        // 🔍 DEBUG: log full API response
        console.log("RAW Vendor API Response:", response);

        // if API returns wrapped object { data: {...} }
        const vendorData =
          (response as unknown as { data?: any })?.data ?? response;

        // 🔍 DEBUG: log extracted vendor
        console.log("EXTRACTED Vendor Data:", vendorData);

        setVendor(vendorData);
      } catch (err) {
        console.error("Load vendor error:", err);
        toast.error("Failed to load vendor");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  const handleSuccess = () => {
    router.push(`/vendors`);
  };

  // 🔍 DEBUG: watch vendor state changes
  React.useEffect(() => {
    console.log("VENDOR STATE UPDATED:", vendor);
  }, [vendor]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen animate-pulse">
        Loading vendor data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Header */}
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
            <h1 className="text-2xl font-bold">Edit Vendor</h1>
            <p className="text-sm text-muted-foreground">
              Modify vendor details and manage documents.
            </p>
          </div>
        </div>

        {/* 1. General Info Form */}
        <div className="border rounded-xl p-6 bg-card shadow-sm">
          <h2 className="text-lg font-semibold mb-4">General Details</h2>

          <VendorForm
            mode="edit"
            initialData={vendor}
            onSuccess={handleSuccess}
          />
        </div>

        {/* 2. Document Management Section */}
        <div className="border rounded-xl p-6 bg-card shadow-sm">
          <VendorDocumentSection vendorId={id as string} />
        </div>
      </div>
    </div>
  );
}

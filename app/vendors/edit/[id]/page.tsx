"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { VendorService } from "@/services/vendor.service";
import { VendorForm } from "@/components/vendor/VendorForm";
import { VendorDocumentSection } from "@/components/vendor/VendorDocumentSection"; // Full functionality
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
        const data = await VendorService.getVendorById(id as string);
        setVendor(data);
      } catch (err) {
        toast.error("Failed to load vendor");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  const handleSuccess = () => {
    toast.success("Vendor updated successfully");
    router.push(`/vendors/view/${id}`); // Redirect back to view page
  };

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
          <VendorForm initialData={vendor} onSuccess={handleSuccess} />
        </div>

        {/* 2. Document Management Section (Upload, Edit, Delete, View) */}
        <div className="border rounded-xl p-6 bg-card shadow-sm">
          <VendorDocumentSection vendorId={id as string} />
        </div>
      </div>
    </div>
  );
}

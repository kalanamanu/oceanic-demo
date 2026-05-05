"use client";

import * as React from "react";
import { VendorForm } from "@/components/vendor/VendorForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateVendorPage() {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success("Vendor created successfully");

    // small delay for UX
    setTimeout(() => {
      router.push("/vendors");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Create Vendor</h1>
          <p className="text-sm text-muted-foreground">
            Add vendor details, categories and contact persons (PICs)
          </p>
        </div>

        {/* FORM */}
        <div className="border rounded-xl p-6 bg-card">
          <VendorForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { VendorService } from "@/services/vendor.service";
import { VendorForm } from "@/components/vendor/VendorForm";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

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

    load();
  }, [id]);

  const handleSuccess = () => {
    toast.success("Vendor updated successfully");
    router.push("/vendors");
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Edit Vendor</h1>

        <div className="border rounded-xl p-6 bg-card">
          <VendorForm initialData={vendor} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}

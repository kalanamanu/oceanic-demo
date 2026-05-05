"use client";

import * as React from "react";
import { VendorService } from "@/services/vendor.service";
import { VendorStatusBadge } from "@/components/vendor/VendorStatusBadge";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Eye, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VendorsPage() {
  const router = useRouter();

  const [vendors, setVendors] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  /* ================= LOAD ================= */
  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await VendorService.getAllVendors();
      setVendors(data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadVendors();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;

    try {
      await VendorService.deleteVendor(id);
      toast.success("Vendor deleted");
      loadVendors();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete vendor");
    }
  };

  /* ================= FILTER ================= */
  const filteredVendors = vendors.filter((v) =>
    v.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vendors</h1>

        <Button onClick={() => router.push("/vendors/create")}>
          <Plus className="w-4 h-4 mr-2" />
          New Vendor
        </Button>
      </div>

      {/* ================= SEARCH ================= */}
      <div>
        <input
          className="border p-2 rounded w-full md:w-1/3"
          placeholder="Search vendor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="border rounded-lg overflow-hidden bg-card">
        {/* HEADER ROW */}
        <div className="grid grid-cols-6 bg-muted p-3 text-sm font-semibold">
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Categories</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* BODY */}
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">
            Loading vendors...
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No vendors found
          </div>
        ) : (
          filteredVendors.map((v) => (
            <div
              key={v.vendor_id}
              className="grid grid-cols-6 p-3 border-t text-sm items-center"
            >
              {/* NAME */}
              <div className="font-medium">{v.name}</div>

              {/* EMAIL */}
              <div className="text-muted-foreground">{v.email}</div>

              {/* PHONE */}
              <div className="text-muted-foreground">{v.phone_number}</div>

              {/* CATEGORIES */}
              <div className="flex flex-wrap gap-1">
                {v.categories?.slice(0, 2).map((c: any) => (
                  <span
                    key={c.cte_id}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                  >
                    {c.cte_name}
                  </span>
                ))}

                {v.categories?.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{v.categories.length - 2}
                  </span>
                )}
              </div>

              {/* STATUS */}
              <div>
                <VendorStatusBadge status={v.status} />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/vendors/${v.vendor_id}`)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/vendors/edit/${v.vendor_id}`)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(v.vendor_id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

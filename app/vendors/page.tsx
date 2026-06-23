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

      const sortedVendors = [...data].sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
      );

      setVendors(sortedVendors);
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Vendors</h1>

          <p className="text-sm text-muted-foreground">
            Manage all registered vendors
          </p>
        </div>

        <Button onClick={() => router.push("/vendors/create")}>
          <Plus className="w-4 h-4 mr-2" />
          New Vendor
        </Button>
      </div>

      {/* ================= SEARCH ================= */}
      <div>
        <input
          className="
            w-full
            md:w-[350px]
            border
            bg-background
            rounded-xl
            px-4
            py-2
            text-sm
            outline-none
            focus:ring-2
            focus:ring-primary/20
          "
          placeholder="Search vendor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        {/* HEADER */}
        <div
          className="
            grid
            grid-cols-[1.2fr_1.5fr_1fr_1.2fr_0.8fr_1fr]
            gap-4
            bg-muted/60
            px-4
            py-3
            text-sm
            font-semibold
          "
        >
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Categories</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* BODY */}
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">
            Loading vendors...
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            No vendors found
          </div>
        ) : (
          filteredVendors.map((v) => (
            <div
              key={v.vendor_id}
              className="
                grid
                grid-cols-[1.2fr_1.5fr_1fr_1.2fr_0.8fr_1fr]
                gap-4
                px-4
                py-4
                border-t
                items-center
                text-sm
                hover:bg-muted/30
                transition-colors
              "
            >
              {/* NAME */}
              <div className="min-w-0">
                <p className="font-medium truncate" title={v.name}>
                  {v.name}
                </p>
              </div>

              {/* EMAIL */}
              <div className="min-w-0">
                <p className="text-muted-foreground truncate" title={v.email}>
                  {v.email}
                </p>
              </div>

              {/* PHONE */}
              <div className="min-w-0">
                <p
                  className="truncate text-muted-foreground"
                  title={v.phone_number}
                >
                  {v.phone_number}
                </p>
              </div>

              {/* CATEGORIES */}
              <div className="flex flex-wrap gap-1 min-w-0">
                {v.categories?.slice(0, 2).map((c: any) => (
                  <span
                    key={c.cte_id}
                    title={c.cte_name}
                    className="
                      text-xs
                      bg-blue-100
                      text-blue-700
                      dark:bg-blue-950
                      dark:text-blue-300
                      px-2
                      py-1
                      rounded-md
                      max-w-[120px]
                      truncate
                      overflow-hidden
                      whitespace-nowrap
                    "
                  >
                    {c.cte_name}
                  </span>
                ))}

                {v.categories?.length > 2 && (
                  <span className="text-xs text-muted-foreground self-center">
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
                  size="icon"
                  variant="outline"
                  onClick={() => router.push(`/vendors/${v.vendor_id}`)}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => router.push(`/vendors/edit/${v.vendor_id}`)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
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

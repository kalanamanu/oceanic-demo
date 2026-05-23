"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { PreCostVendorService } from "@/services/precost-vendor.service";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Tag,
  RefreshCcw,
  ArrowRight,
} from "lucide-react";

import type { PreCostVendor } from "@/types/precost-vendor.types";

export default function ConfirmedVendorsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const preCostId = searchParams.get("id");

  const [loading, setLoading] = React.useState(true);
  const [vendors, setVendors] = React.useState<PreCostVendor[]>([]);

  /* ================= FETCH ================= */

  const loadVendors = async () => {
    if (!preCostId) return;

    try {
      setLoading(true);

      const data = await PreCostVendorService.getVendorsByPreCostId(preCostId);

      setVendors(data || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadVendors();
  }, [preCostId]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading vendors...</p>
      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (!vendors.length) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          No vendors found for this PreCost
        </p>

        <Button onClick={loadVendors} variant="outline">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Confirmed Pre-Cost Vendors</h1>

            <p className="text-sm text-muted-foreground">
              PreCost ID: {preCostId}
            </p>
          </div>

          <Button variant="outline" onClick={loadVendors}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Separator />

        {/* VENDOR GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {vendors.map((vendor) => (
            <Card
              key={vendor.vendor_id}
              className="p-5 space-y-4 hover:shadow-md transition"
            >
              {/* HEADER */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    {vendor.name}
                  </h2>

                  <p className="text-xs text-muted-foreground mt-1">
                    {vendor.company_type}
                  </p>
                </div>

                <Badge
                  className={
                    vendor.status?.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                >
                  {vendor.status?.status || "Pending"}
                </Badge>
              </div>

              {/* CONTACT */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {vendor.address}
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {vendor.phone_number}
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {vendor.email}
                </div>
              </div>

              <Separator />

              {/* CATEGORIES */}
              <div>
                <h3 className="text-xs font-semibold flex items-center gap-1 mb-2">
                  <Tag className="w-3 h-3" />
                  Categories
                </h3>

                <div className="flex flex-wrap gap-2">
                  {vendor.categories?.map((cat) => (
                    <Badge key={cat.id} variant="secondary" className="text-xs">
                      {cat.cte_name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* PICs */}
              <div>
                <h3 className="text-xs font-semibold flex items-center gap-1 mb-2">
                  <User className="w-3 h-3" />
                  Contact Persons
                </h3>

                <div className="space-y-2">
                  {vendor.pics?.map((pic) => (
                    <div
                      key={pic.pic_id}
                      className="text-xs border rounded p-2 bg-muted/30"
                    >
                      <div className="font-medium">
                        {pic.firstName} {pic.lastName}
                      </div>

                      <div className="text-muted-foreground">{pic.email}</div>

                      <div className="text-muted-foreground">
                        {pic.phone_number}
                      </div>

                      <Badge variant="outline" className="mt-1 text-[10px]">
                        {pic.picType}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* REMARK */}
              {vendor.remark && (
                <div className="text-xs text-muted-foreground italic border-t pt-3">
                  "{vendor.remark}"
                </div>
              )}

              {/* ACTION BUTTON */}
              <div className="pt-2">
                <Button
                  className="w-full gap-2"
                  variant="default"
                  onClick={() =>
                    router.push(
                      `/confirmed-orders/vendors/${preCostId}/vendor/${vendor.vendor_id}/items`,
                    )
                  }
                >
                  View Vendor Items
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

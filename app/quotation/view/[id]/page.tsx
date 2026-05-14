"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { PreCostService } from "@/services/precost.service";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ChevronLeft, Edit, Package, DollarSign, Ship } from "lucide-react";
import { PreCostDownloadDialog } from "@/components/quatation/PreCostDownloadDialog";

export default function PreCostViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [downloadOpen, setDownloadOpen] = React.useState(false);

  /* ================= FETCH ================= */
  React.useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await PreCostService.getPreCostById(id as string);
        setData(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load PreCost");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No data found
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="-ml-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">PreCost Details</h1>
            </div>
            <p className="text-muted-foreground ml-8">ID: {data.pre_cost_id}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Back to List
            </Button>
            <Button
              onClick={() => router.push(`/quotation/edit/${data.pre_cost_id}`)}
              className="gap-2"
            >
              <Edit className="w-4 h-4" /> Edit
            </Button>
            <Button variant="default" onClick={() => setDownloadOpen(true)}>
              Download
            </Button>
          </div>
        </div>

        <Separator />

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-xl p-5 space-y-3 bg-card">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Ship className="w-4 h-4" /> Vessel Info
            </div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <b>Vessel:</b> <span>{data.vessel_name}</span>
              </div>
              <div className="flex justify-between">
                <b>Status:</b>{" "}
                <span className="capitalize px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                  {data.status}
                </span>
              </div>
              <div className="flex justify-between">
                <b>Arrival:</b>{" "}
                <span>
                  {data.date_arrived
                    ? new Date(data.date_arrived).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <b>Sailed:</b>{" "}
                <span>
                  {data.date_saild
                    ? new Date(data.date_saild).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-5 space-y-3 bg-card">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <DollarSign className="w-4 h-4" /> Financials
            </div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <b>USD Rate:</b> <span>{data.usd_rate}</span>
              </div>
              <div className="flex justify-between">
                <b>Discount:</b> <span>{data.discount} LKR</span>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-5 space-y-3 bg-card">
            <div className="flex items-center gap-2 font-semibold text-primary">
              Remark
            </div>
            <p className="text-sm text-muted-foreground italic">
              {data.remark || "No remarks provided for this record."}
            </p>
          </div>
        </div>

        {/* ITEMS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Items List</h2>
          </div>

          {data.preCostData?.length === 0 ? (
            <p className="text-sm text-muted-foreground border rounded-lg p-10 text-center">
              No items attached
            </p>
          ) : (
            <div className="space-y-3">
              {data.preCostData.map((item: any, index: number) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-bold">
                        Item Name
                      </p>{" "}
                      {item.item_name}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-bold">
                        Qty / Unit
                      </p>{" "}
                      {item.quantity} {item.unit}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-bold">
                        IMPA
                      </p>{" "}
                      {item.impa || "-"}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-bold">
                        Unit Price
                      </p>{" "}
                      {item.unit_price}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-bold">
                        Total LKR
                      </p>{" "}
                      {item.total_price}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-bold">
                        USD Rate
                      </p>{" "}
                      {item.unit_rate_usd}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-bold">
                        Total USD
                      </p>{" "}
                      {item.total_price_usd}
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="grid md:grid-cols-2 gap-4 text-sm pt-1">
                    <div>
                      <b>Remark:</b>{" "}
                      <span className="text-muted-foreground">
                        {item.customer_remark || "-"}
                      </span>
                    </div>
                    <div>
                      <b>Vendor:</b>{" "}
                      {(() => {
                        // 1. Verified vendor
                        if (item.vendorDetails) {
                          return (
                            <span className="text-primary">
                              {item.vendorDetails.name} (
                              {item.vendorDetails.email})
                            </span>
                          );
                        }

                        // 2. Temporary vendor match
                        const tempVendor = data.tempVendors?.find(
                          (tv: any) => tv.vendor_id === item.vendor_id,
                        );

                        if (tempVendor) {
                          return (
                            <span className="text-blue-600">
                              {tempVendor.vendor_name} ({tempVendor.email})
                              <span className="ml-2 text-xs text-muted-foreground">
                                [Temporary]
                              </span>
                            </span>
                          );
                        }

                        // 3. No vendor
                        return (
                          <span className="text-muted-foreground">
                            Not Assigned
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADDITIONAL CHARGES & TOTALS */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Additional Charges</h2>
            {data.additionalCharges?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No additional charges
              </p>
            ) : (
              <div className="space-y-2">
                {data.additionalCharges.map((c: any, i: number) => (
                  <div
                    key={i}
                    className="border rounded p-3 flex justify-between text-sm bg-card"
                  >
                    <span>{c.charge_name}</span>
                    <span className="font-mono">
                      {Number(c.amount).toLocaleString()} {c.currency}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border rounded-xl p-6 bg-muted/50 space-y-4 h-fit">
            <h2 className="text-lg font-semibold border-b pb-2">
              Final Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-lg">
                <span className="text-muted-foreground">Total (LKR)</span>
                <span className="font-bold text-primary">
                  {Number(data.total_cost || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="text-muted-foreground">Total (USD)</span>
                <span className="font-bold text-primary">
                  $
                  {Number(data.total_cost_usd || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* DOWNLOAD DIALOG */}
        <PreCostDownloadDialog
          open={downloadOpen}
          onOpenChange={setDownloadOpen}
          precostData={data}
        />
      </main>
    </div>
  );
}

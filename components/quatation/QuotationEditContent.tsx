"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { InquiryService } from "@/services/inquiry.service";
import { VendorService } from "@/services/vendor.service";
import { PreCostService } from "@/services/precost.service";
import { BasisService } from "@/services/basis.service";

import { QuotationCalculator } from "@/calculations/quotation-calculator";

import type { QuotationItem } from "@/types/quotation.types";

import { QuotationHeader } from "@/components/quatation/quotation-header";
import { QuotationUploadSection } from "@/components/quatation/quotation-upload-section";
import { QuotationSummaryCard } from "@/components/quatation/QuotationSummaryCard";
import { QuotationFooterActions } from "@/components/quatation/quotation-footer-actions";
import { QuotationPreviewDialog } from "@/components/quatation/quotation-preview-dialog";
import { TempVendorDialog } from "@/components/quatation/TempVendorDialog";

export function QuotationEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const precostId = searchParams.get("id");

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [inquiry, setInquiry] = React.useState<any | null>(null);
  const [items, setItems] = React.useState<QuotationItem[]>([]);
  const [vendors, setVendors] = React.useState<any[]>([]);
  const [basis, setBasis] = React.useState<any>(null);

  const [additionalCharges, setAdditionalCharges] = React.useState<
    { name: string; amount: string; currency: string }[]
  >([]);

  const [discountLKR, setDiscountLKR] = React.useState("");
  const [dateArrived, setDateArrived] = React.useState<Date | undefined>();
  const [dateSailed, setDateSailed] = React.useState<Date | undefined>();
  const [remark, setRemark] = React.useState("");

  const [previewOpen, setPreviewOpen] = React.useState(false);

  const [tempVendorOpen, setTempVendorOpen] = React.useState(false);
  const [tempVendorLoading, setTempVendorLoading] = React.useState(false);
  const [activeItemIndex, setActiveItemIndex] = React.useState<number | null>(
    null,
  );

  /* ================= LOAD VENDORS ================= */
  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await VendorService.getAllVendors();
        setVendors(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  /* ================= LOAD BASIS ================= */
  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await BasisService.getActiveBasis();
        setBasis(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  /* ================= LOAD PRE COST ================= */
  React.useEffect(() => {
    if (!precostId) {
      setLoading(false);
      toast.error("PreCost ID not found");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);

        const raw = await PreCostService.getPreCostById(precostId);

        // 🔥 FIX: handle both API shapes
        const data = raw?.data || raw;

        console.log("PRECOST DATA:", data);

        setRemark(data?.remark || "");
        setDiscountLKR(String(data?.discount || ""));

        if (data?.date_arrived) setDateArrived(new Date(data.date_arrived));
        if (data?.date_saild) setDateSailed(new Date(data.date_saild));

        /* ================= ITEMS ================= */
        const mappedItems: QuotationItem[] = (data?.preCostData || []).map(
          (item: any, index: number) => ({
            item_no: String(index + 1),
            description: item.item_name || "",
            quantity: String(item.quantity || ""),
            unit: item.unit || "",
            impa_code: item.impa || "",
            supplier_id: item.vendor_id || "",
            price: String(item.unit_price || ""),
            additional_charges: String(item.additional_charges || ""),
            total_rs: String(item.total_price || ""),
            conva_basis: item.basis || "",
            unit_rate_usd: String(item.unit_rate_usd || ""),
            total_usd: String(item.total_price_usd || ""),
            osc_remark: item.oms_remark || "",
            customer_remark: item.customer_remark || "",
          }),
        );

        setItems(mappedItems);

        /* ================= CHARGES ================= */
        const mappedCharges = (data?.additionalCharges || []).map((c: any) => ({
          name: c.charge_name || "",
          amount: String(c.amount || ""),
          currency: c.currency || "USD",
        }));

        setAdditionalCharges(mappedCharges);

        /* ================= INQUIRY ================= */
        if (data?.inquiryID) {
          try {
            const inq = await InquiryService.getInquiryById(data.inquiryID);
            setInquiry(inq);
          } catch (e) {
            console.error(e);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load PreCost");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [precostId]);

  /* ================= UPDATE ITEM ================= */
  const updateItem = (index: number, field: string, value: string) => {
    setItems((prev) => {
      const copy = [...prev];

      copy[index] = {
        ...copy[index],
        [field]: value,
      };

      if (basis) {
        copy[index] = QuotationCalculator.calculate(copy[index], basis);
      }

      return copy;
    });
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= CHARGES ================= */
  const addCharge = () => {
    setAdditionalCharges((p) => [
      ...p,
      { name: "", amount: "", currency: "USD" },
    ]);
  };

  const updateCharge = (index: number, field: string, value: string) => {
    setAdditionalCharges((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeCharge = (index: number) => {
    setAdditionalCharges((p) => p.filter((_, i) => i !== index));
  };

  /* ================= TOTALS ================= */
  const totalLKR = React.useMemo(() => {
    if (!basis) return 0;
    return QuotationCalculator.calculateGrandTotalLKR(
      items,
      basis,
      additionalCharges,
      discountLKR,
    );
  }, [items, basis, additionalCharges, discountLKR]);

  const totalUSD = React.useMemo(() => {
    if (!basis) return 0;
    return QuotationCalculator.calculateGrandTotalUSD(
      items,
      basis,
      additionalCharges,
      discountLKR,
    );
  }, [items, basis, additionalCharges, discountLKR]);

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!precostId) return;

    try {
      setSaving(true);

      const payload = {
        vessel_name: inquiry?.vessel_name,
        date_arrived: dateArrived?.toISOString().split("T")[0] || null,
        date_saild: dateSailed?.toISOString().split("T")[0] || null,
        discount: Number(discountLKR || 0),
        usd_rate: Number(basis?.USDRate || 0),
        total_cost: Number(totalLKR || 0),
        total_cost_usd: Number(totalUSD || 0),
        status: "PENDING",
        remark,

        items: items.map((item) => {
          const vendor = vendors.find((v) => v.vendor_id === item.supplier_id);

          return {
            item_name: item.description,
            customer_remark: item.customer_remark,
            quantity: Number(item.quantity),
            unit: item.unit,
            impa: item.impa_code,
            vendor_id: vendor?.vendor_id || null,
            is_verified_vendor: vendor?.is_verified ?? false,
            oms_remark: item.osc_remark,
            unit_price: Number(item.price || 0),
            additional_charges: Number(item.additional_charges || 0),
            total_price: Number(item.total_rs || 0),
            basis: item.conva_basis,
            unit_rate_usd: Number(item.unit_rate_usd || 0),
            total_price_usd: Number(item.total_usd || 0),
          };
        }),

        additional_charges: additionalCharges.map((c) => ({
          charge_name: c.name,
          amount: Number(c.amount || 0),
          currency: c.currency,
        })),
      };

      await PreCostService.updatePreCost(precostId, payload);

      toast.success("PreCost updated successfully");

      router.push("/quotation");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update PreCost");
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading quotation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <QuotationHeader inquiry={inquiry} basis={basis} />

        <Separator />

        <QuotationUploadSection
          uploading={false}
          handleFileUpload={() => {}}
          items={items}
          updateItem={updateItem}
          removeItem={removeItem}
          vendors={vendors}
          setActiveItemIndex={setActiveItemIndex}
          setTempVendorOpen={setTempVendorOpen}
        />

        <QuotationSummaryCard
          additionalCharges={additionalCharges}
          addCharge={addCharge}
          updateCharge={updateCharge}
          removeCharge={removeCharge}
          discountLKR={discountLKR}
          setDiscountLKR={setDiscountLKR}
          dateArrived={dateArrived}
          setDateArrived={setDateArrived}
          dateSailed={dateSailed}
          setDateSailed={setDateSailed}
          remark={remark}
          setRemark={setRemark}
          totalLKR={totalLKR}
          totalUSD={totalUSD}
        />

        <QuotationFooterActions onSave={() => setPreviewOpen(true)} />

        <QuotationPreviewDialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          onConfirm={handleUpdate}
          inquiry={inquiry}
          items={items}
          additionalCharges={additionalCharges}
          discountLKR={discountLKR}
          totalLKR={totalLKR}
          totalUSD={totalUSD}
          basis={basis}
          dateArrived={dateArrived}
          dateSailed={dateSailed}
          remark={remark}
        />

        <TempVendorDialog
          open={tempVendorOpen}
          onClose={() => setTempVendorOpen(false)}
          onSave={handleCreateTempVendor}
          loading={tempVendorLoading}
        />
      </main>
    </div>
  );
}

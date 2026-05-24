"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import { PreCostService } from "@/services/precost.service";
import { VendorService } from "@/services/vendor.service";
import { BasisService } from "@/services/basis.service";

import { QuotationCalculator } from "@/calculations/quotation-calculator";

import type { QuotationItem } from "@/types/quotation.types";

import { QuotationHeader } from "@/components/quatation/quotation-header";
import { QuotationUploadSection } from "@/components/quatation/quotation-upload-section";
import QuotationItemsTable from "@/components/quatation/quotation-items-table";
import { QuotationSummaryCard } from "@/components/quatation/QuotationSummaryCard";
import { QuotationFooterActions } from "@/components/quatation/quotation-footer-actions";

export default function PreCostEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  /* ================= STATE ================= */
  const [loading, setLoading] = React.useState(true);

  const [preCost, setPreCost] = React.useState<any>(null);
  const [items, setItems] = React.useState<QuotationItem[]>([]);
  const [vendors, setVendors] = React.useState<any[]>([]);
  const [basis, setBasis] = React.useState<any>(null);

  const [additionalCharges, setAdditionalCharges] = React.useState<
    { name: string; amount: string; currency: string }[]
  >([]);

  const [discountLKR, setDiscountLKR] = React.useState<string>("");
  const [dateArrived, setDateArrived] = React.useState<Date | undefined>();
  const [dateSailed, setDateSailed] = React.useState<Date | undefined>();
  const [remark, setRemark] = React.useState<string>("");

  /* ================= LOAD VENDORS ================= */
  React.useEffect(() => {
    VendorService.getAllVendors().then(setVendors).catch(console.error);
  }, []);

  /* ================= LOAD BASIS ================= */
  React.useEffect(() => {
    BasisService.getActiveBasis()
      .then((data) => setBasis(Array.isArray(data) ? data[0] : data))
      .catch(console.error);
  }, []);

  /* ================= LOAD PRE COST ================= */
  React.useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);

        const data = await PreCostService.getPreCostById(id);

        setPreCost(data);

        /* ================= MAP ITEMS ================= */
        setItems(
          (data.preCostData || []).map((item: any) => ({
            item_no: "",
            description: item.item_name,
            quantity: item.quantity,
            unit: item.unit,
            impa_code: item.impa,
            supplier_id: item.vendor_id,
            price: item.unit_price,
            additional_charges: item.additional_charges,
            total_rs: item.total_price,
            conva_basis: item.basis,
            unit_rate_usd: item.unit_rate_usd,
            total_usd: item.total_price_usd,
            osc_remark: item.oms_remark,
            customer_remark: item.customer_remark,
          })),
        );

        /* ================= CHARGES ================= */
        setAdditionalCharges(
          (data.additionalCharges || []).map((c: any) => ({
            name: c.charge_name,
            amount: String(c.amount),
            currency: c.currency,
          })),
        );

        setDiscountLKR(data.discount ? String(data.discount) : "");
        setRemark(data.remark || "");

        setDateArrived(
          data.date_arrived ? new Date(data.date_arrived) : undefined,
        );

        setDateSailed(data.date_saild ? new Date(data.date_saild) : undefined);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load PreCost");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* ================= ITEM UPDATE ================= */
  const updateItem = (index: number, field: string, value: string) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };

      if (basis) {
        copy[index] = QuotationCalculator.calculate(copy[index], basis);
      }

      return copy;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= CHARGES ================= */
  const addCharge = () => {
    setAdditionalCharges((prev) => [
      ...prev,
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
    setAdditionalCharges((prev) => prev.filter((_, i) => i !== index));
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
    try {
      const payload = {
        vessel_name: preCost?.vessel_name,

        date_arrived: dateArrived?.toISOString().split("T")[0],
        date_saild: dateSailed?.toISOString().split("T")[0],

        discount: Number(discountLKR || 0),
        usd_rate: Number(basis?.USDRate || 0),

        total_cost: Number(totalLKR || 0),
        total_cost_usd: Number(totalUSD || 0),

        status: preCost?.status || "PENDING",
        remark,

        items: items.map((item) => ({
          item_name: item.description,
          customer_remark: item.customer_remark,
          quantity: Number(item.quantity),
          unit: item.unit,
          impa: item.impa_code,
          vendor_id: item.supplier_id || null,
          is_verified_vendor: true,
          unit_price: Number(item.price || 0),
          additional_charges: Number(item.additional_charges || 0),
          total_price: Number(item.total_rs || 0),
          basis: item.conva_basis,
          unit_rate_usd: Number(item.unit_rate_usd || 0),
          total_price_usd: Number(item.total_usd || 0),
          oms_remark: item.osc_remark,
        })),

        additional_charges: additionalCharges.map((c) => ({
          charge_name: c.name,
          amount: Number(c.amount),
          currency: c.currency,
        })),
      };

      await PreCostService.updatePreCost(id, payload);

      toast.success("PreCost updated successfully");

      router.push("/precost");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update PreCost");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Loading PreCost...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* HEADER */}
        <QuotationHeader
          inquiry={preCost}
          basis={basis}
          formatBasis={(v: number) => new Intl.NumberFormat("en-US").format(v)}
        />

        {/* ITEMS TABLE (EDIT MODE) */}
        <QuotationItemsTable
          items={items}
          updateItem={updateItem}
          removeItem={removeItem}
          vendors={vendors}
          setActiveItemIndex={() => {}}
          setTempVendorOpen={() => {}}
        />

        {/* SUMMARY */}
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

        {/* FOOTER */}
        <QuotationFooterActions onSave={handleUpdate} />
      </main>
    </div>
  );
}

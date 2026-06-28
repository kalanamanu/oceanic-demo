"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { VendorService } from "@/services/vendor.service";
import { PreCostService } from "@/services/precost.service";

import { QuotationCalculator } from "@/calculations/quotation-calculator";
import type { QuotationItem } from "@/types/quotation.types";

import { PreCostEditHeader } from "@/components/quatation/PreCostEditHeader";
import { QuotationEditSection } from "@/components/quatation/quotation-edit-section";
import { QuotationSummaryEdit } from "@/components/quatation/QuotationSummaryEdit";
import { QuotationEditFooterActions } from "@/components/quatation/QuotationEditFooterActions";
import { TempVendorDialog } from "@/components/quatation/TempVendorDialog";

export function PreCostEditContent() {
  const router = useRouter();
  const params = useParams();
  const precostId = params?.id as string;

  const [precost, setPrecost] = React.useState<any | null>(null);
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

  const [tempVendorOpen, setTempVendorOpen] = React.useState(false);
  const [tempVendorLoading, setTempVendorLoading] = React.useState(false);
  const [activeItemIndex, setActiveItemIndex] = React.useState<number | null>(
    null,
  );

  /* ================= LOAD DATA ================= */

  React.useEffect(() => {
    VendorService.getAllVendors().then(setVendors).catch(console.error);
  }, []);

  React.useEffect(() => {
    if (!precostId) return;

    const load = async () => {
      try {
        const data = await PreCostService.getPreCostById(precostId);

        setPrecost(data);
        setDiscountLKR(String(data?.discount ?? ""));
        setRemark(data?.remark ?? "");

        setDateArrived(
          data?.date_arrived ? new Date(data.date_arrived) : undefined,
        );
        setDateSailed(data?.date_saild ? new Date(data.date_saild) : undefined);

        /* ================= SET BASIS FROM API ================= */
        const firstItem = data?.preCostData?.[0];

        const newBasis = firstItem
          ? {
              usdRate: data.usd_rate,
              basis: Number(firstItem.basis),
              margin: 0, // change if API gives margin
            }
          : null;

        setBasis(newBasis);

        /* ================= MAP ITEMS ================= */
        let mappedItems: QuotationItem[] = (data?.preCostData || []).map(
          (item: any) => ({
            description: item.item_name,
            customer_remark: item.customer_remark,
            quantity: item.quantity,
            unit: item.unit,
            impa_code: item.impa,
            price: item.unit_price,
            total_rs: item.total_price,
            unit_rate_usd: item.unit_rate_usd,
            total_usd: item.total_price_usd,
            conva_basis: item.basis,
            additional_charges: item.additional_charges,
            supplier_id: item.vendor_id || "",
          }),
        );

        /* ================= RECALCULATE ================= */
        if (newBasis) {
          mappedItems = QuotationCalculator.recalculateAll(mappedItems, {
            usdRate: newBasis.usdRate,
            basis: Number(newBasis.basis),
            margin: Number(newBasis.margin),
          });
        }

        setItems(mappedItems);

        setAdditionalCharges(
          (data?.additionalCharges || []).map((c: any) => ({
            name: c.charge_name,
            amount: String(c.amount),
            currency: c.currency,
          })),
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load PreCost");
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
        copy[index] = QuotationCalculator.calculate(copy[index], {
          usdRate: basis.usdRate,
          basis: Number(basis.basis),
          margin: Number(basis.margin),
        });
      }

      return copy;
    });
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
      {
        usdRate: basis.usdRate,
        basis: Number(basis.basis),
        margin: Number(basis.margin),
      },
      additionalCharges,
      discountLKR,
    );
  }, [items, basis, additionalCharges, discountLKR]);

  const totalUSD = React.useMemo(() => {
    if (!basis) return 0;

    return QuotationCalculator.calculateGrandTotalUSD(
      items,
      {
        usdRate: basis.usdRate,
        basis: Number(basis.basis),
        margin: Number(basis.margin),
      },
      additionalCharges,
      discountLKR,
    );
  }, [items, basis, additionalCharges, discountLKR]);

  /* ================= SAVE ================= */

  const handleUpdatePreCost = async () => {
    try {
      if (!basis) {
        toast.error("Basis missing");
        return;
      }

      const payloadItems = items.map((item) => ({
        item_name: item.description,
        customer_remark: item.customer_remark || "",
        quantity: Number(item.quantity),
        unit: item.unit,
        impa: item.impa_code,
        vendor_id: item.supplier_id,
        is_verified_vendor: true,
        oms_remark: "",

        unit_price: Number(item.price),
        additional_charges: Number(item.additional_charges || 0),
        total_price: Number(item.total_rs),

        basis: String(item.conva_basis), // 🔥 IMPORTANT
        unit_rate_usd: Number(item.unit_rate_usd),
        total_price_usd: Number(item.total_usd),
      }));

      const payload = {
        vessel_name: precost?.vessel_name,
        date_arrived: dateArrived?.toISOString().split("T")[0],
        date_saild: dateSailed?.toISOString().split("T")[0],

        discount: Number(discountLKR || 0),
        usd_rate: Number(basis.usdRate),

        total_cost: totalLKR,
        total_cost_usd: totalUSD,
        status: "PENDING",
        remark,

        items: payloadItems,

        additional_charges: additionalCharges.map((c) => ({
          charge_name: c.name,
          amount: Number(c.amount),
          currency: c.currency,
        })),
      };

      console.log("🚀 FINAL PAYLOAD:", payload);

      await PreCostService.updatePreCost(precostId, payload);

      toast.success("Updated successfully");
      router.push("/quotation");
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  /* ================= TEMP VENDOR ================= */

  const handleCreateTempVendor = async (form: any) => {
    if (!precostId || activeItemIndex === null) return;

    try {
      setTempVendorLoading(true);

      const newVendor = await PreCostService.createTempVendor(precostId, form);

      setVendors((p) => [...p, newVendor]);

      updateItem(activeItemIndex, "supplier_id", newVendor.vendor_id);

      toast.success("Temporary vendor added");
      setTempVendorOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create vendor");
    } finally {
      setTempVendorLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <PreCostEditHeader
          precost={precost}
          basis={basis}
          formatBasis={(v) =>
            new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 10,
            }).format(v)
          }
        />

        <Separator />

        <QuotationEditSection
          items={items}
          updateItem={updateItem}
          removeItem={(i) =>
            setItems((prev) => prev.filter((_, index) => index !== i))
          }
          vendors={vendors}
          setActiveItemIndex={setActiveItemIndex}
          setTempVendorOpen={setTempVendorOpen}
        />

        <QuotationSummaryEdit
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

        <QuotationEditFooterActions
          onSave={handleUpdatePreCost}
          loading={false}
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

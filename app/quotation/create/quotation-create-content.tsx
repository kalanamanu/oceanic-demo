"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { InquiryService } from "@/services/inquiry.service";
import { QuotationService } from "@/services/quotation.service";
import { VendorService } from "@/services/vendor.service";
import { PreCostService } from "@/services/precost.service";
import { BasisService } from "@/services/basis.service";

import { QuotationCalculator } from "@/calculations/quotation-calculator";

import type { QuotationItem } from "@/types/quotation.types";

import { QuotationHeader } from "@/components/quatation/quotation-header";
import { QuotationStepSelector } from "@/components/quatation/quotation-step-selector";
import { QuotationUploadSection } from "@/components/quatation/quotation-upload-section";
import { QuotationSummaryCard } from "@/components/quatation/QuotationSummaryCard";
import { QuotationFooterActions } from "@/components/quatation/quotation-footer-actions";

import { QuotationPreviewDialog } from "@/components/quatation/quotation-preview-dialog";
import { TempVendorDialog } from "@/components/quatation/TempVendorDialog";

export function QuotationCreateContent() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const inquiryId = searchParams.get("inquiryId");

  const [inquiry, setInquiry] = React.useState<any | null>(null);

  const [step, setStep] = React.useState<null | "excel">(null);

  const [items, setItems] = React.useState<QuotationItem[]>([]);

  const [downloading, setDownloading] = React.useState(false);

  const [uploading, setUploading] = React.useState(false);

  const [vendors, setVendors] = React.useState<any[]>([]);

  const [precostId, setPrecostId] = React.useState<string | null>(null);

  const [basis, setBasis] = React.useState<any>(null);

  const [additionalCharges, setAdditionalCharges] = React.useState<
    { name: string; amount: string; currency: string }[]
  >([]);

  const [discountLKR, setDiscountLKR] = React.useState<string>("");

  const [dateArrived, setDateArrived] = React.useState<Date | undefined>();

  const [dateSailed, setDateSailed] = React.useState<Date | undefined>();

  const [remark, setRemark] = React.useState<string>("");

  const [previewOpen, setPreviewOpen] = React.useState(false);

  const [tempVendorOpen, setTempVendorOpen] = React.useState(false);

  const [tempVendorLoading, setTempVendorLoading] = React.useState(false);

  const [activeItemIndex, setActiveItemIndex] = React.useState<number | null>(
    null,
  );

  /* ================= LOAD VENDORS ================= */

  React.useEffect(() => {
    const loadVendors = async () => {
      try {
        const data = await VendorService.getAllVendors();
        setVendors(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadVendors();
  }, []);

  /* ================= LOAD BASIS ================= */

  React.useEffect(() => {
    const loadBasis = async () => {
      try {
        const data = await BasisService.getActiveBasis();

        const basisItem = Array.isArray(data) ? data[0] : data;

        setBasis(basisItem);
      } catch (err) {
        console.error(err);
      }
    };

    loadBasis();
  }, []);

  /* ================= FETCH INQUIRY ================= */

  React.useEffect(() => {
    if (!inquiryId) return;

    const fetchInquiry = async () => {
      try {
        const data = await InquiryService.getInquiryById(inquiryId);

        setInquiry(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInquiry();
  }, [inquiryId]);

  /* ================= FORMAT BASIS ================= */

  const formatBasis = (v: number) =>
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 10,
    }).format(v);

  /* ================= DOWNLOAD TEMPLATE ================= */

  const handleDownloadTemplate = async () => {
    try {
      setDownloading(true);

      const blob = await QuotationService.downloadTemplate();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "quotation-template.xlsx";

      a.click();

      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  /* ================= FILE UPLOAD ================= */

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const draft = await PreCostService.createDraft();

      const id = draft?.data;

      setPrecostId(id);

      localStorage.setItem("precost_id", id);

      const validated = await QuotationService.validateExcel(file);

      const enriched = validated.map((item) => ({
        ...item,
        supplier_name: "",
      }));

      if (basis) {
        const calculated = QuotationCalculator.recalculateAll(enriched, basis);

        setItems(calculated);
      } else {
        setItems(enriched);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

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

  /* ================= ADD CHARGE ================= */

  const addCharge = () => {
    setAdditionalCharges((prev) => [
      ...prev,
      {
        name: "",
        amount: "",
        currency: "USD",
      },
    ]);
  };

  /* ================= UPDATE CHARGE ================= */

  const updateCharge = (index: number, field: string, value: string) => {
    setAdditionalCharges((prev) => {
      const copy = [...prev];

      copy[index] = {
        ...copy[index],
        [field]: value,
      };

      return copy;
    });
  };

  /* ================= REMOVE CHARGE ================= */

  const removeCharge = (index: number) => {
    setAdditionalCharges((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= TOTAL LKR ================= */

  const totalLKR = React.useMemo(() => {
    if (!basis) return 0;

    return QuotationCalculator.calculateGrandTotalLKR(
      items,
      basis,
      additionalCharges,
      discountLKR,
    );
  }, [items, basis, additionalCharges, discountLKR]);

  /* ================= TOTAL USD ================= */

  const totalUSD = React.useMemo(() => {
    if (!basis) return 0;

    return QuotationCalculator.calculateGrandTotalUSD(
      items,
      basis,
      additionalCharges,
      discountLKR,
    );
  }, [items, basis, additionalCharges, discountLKR]);

  /* ================= FINALIZE PRE COST ================= */

  const handleFinalizePreCost = async () => {
    try {
      const precost_id = localStorage.getItem("precost_id");

      const payload = {
        id: precost_id,

        vessel_name: inquiry?.vessel_name,

        date_arrived: dateArrived
          ? dateArrived.toISOString().split("T")[0]
          : null,

        date_saild: dateSailed ? dateSailed.toISOString().split("T")[0] : null,

        discount: Number(discountLKR || 0),

        usd_rate: Number(basis?.USDRate || 0),

        total_cost: Number(totalLKR || 0),

        total_cost_usd: Number(totalUSD || 0),

        status: "PENDING",

        remark: remark,

        inquiryID: inquiry?.inq_id,

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

      await PreCostService.createPreCost(payload);

      setPreviewOpen(false);

      toast.success("PreCost created successfully");

      setTimeout(() => {
        router.push("/quotation");
      }, 1200);
    } catch (err) {
      console.error(err);

      toast.error("Failed to save PreCost");
    }
  };

  /* ================= CREATE TEMP VENDOR ================= */

  const handleCreateTempVendor = async (form: any) => {
    if (!precostId || activeItemIndex === null) return;

    try {
      setTempVendorLoading(true);

      const newVendor = await PreCostService.createTempVendor(precostId, form);

      setVendors((prev) => [...prev, newVendor]);

      updateItem(activeItemIndex, "supplier_name", newVendor.vendor_id);

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
        {/* HEADER */}
        <QuotationHeader
          inquiry={inquiry}
          basis={basis}
          formatBasis={formatBasis}
        />

        <Separator />

        {/* STEP SELECTOR */}
        {step === null && (
          <QuotationStepSelector
            downloading={downloading}
            onUploadClick={() => setStep("excel")}
            onDownload={handleDownloadTemplate}
          />
        )}

        {/* UPLOAD SECTION */}
        {step === "excel" && (
          <QuotationUploadSection
            uploading={uploading}
            handleFileUpload={handleFileUpload}
            items={items}
            updateItem={updateItem}
            removeItem={removeItem}
            vendors={vendors}
            setActiveItemIndex={setActiveItemIndex}
            setTempVendorOpen={setTempVendorOpen}
          />
        )}

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

        {/* FOOTER ACTIONS */}
        <QuotationFooterActions onSave={() => setPreviewOpen(true)} />

        {/* PREVIEW DIALOG */}
        <QuotationPreviewDialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          onConfirm={handleFinalizePreCost}
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

        {/* TEMP VENDOR DIALOG */}
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

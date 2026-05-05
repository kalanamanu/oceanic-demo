"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { InquiryService } from "@/services/inquiry.service";
import { QuotationService } from "@/services/quotation.service";
import { VendorService } from "@/services/vendor.service";
import { PreCostService } from "@/services/precost.service";
import { BasisService } from "@/services/basis.service";
import { QuotationCalculator } from "@/calculations/quotation-calculator";
import type { QuotationItem } from "@/types/quotation.types";
import { DatePicker } from "@/components/ui/date-picker";
import { QuotationPreviewDialog } from "@/components/quatation/quotation-preview-dialog";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export function QuotationEditContent() {
  const router = useRouter();

  const { id } = useParams();

  const [inquiry, setInquiry] = React.useState<any | null>(null);
  const [loadingInquiry, setLoadingInquiry] = React.useState(false);

  const [step, setStep] = React.useState<null | "excel">(null);
  const [items, setItems] = React.useState<QuotationItem[]>([]);
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

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

  //Load exsisting data
  React.useEffect(() => {
    if (!id) return;

    const loadPreCost = async () => {
      try {
        const res = await PreCostService.getPreCostById(id as string);

        // BASIC
        setRemark(res.remark || "");
        setDiscountLKR(res.discount?.toString() || "");

        setDateArrived(
          res.date_arrived ? new Date(res.date_arrived) : undefined,
        );
        setDateSailed(res.date_saild ? new Date(res.date_saild) : undefined);

        // ITEMS
        const mappedItems = res.preCostData.map((item: any) => ({
          item_no: "",
          description: item.item_name,
          customer_remark: item.customer_remark,
          quantity: item.quantity,
          unit: item.unit,
          impa_code: item.impa,
          price: item.unit_price,
          additional_charges: item.additional_charges,
          total_rs: item.total_price,
          unit_rate_usd: item.unit_rate_usd,
          total_usd: item.total_price_usd,
          conva_basis: item.basis,
          supplier_name: item.vendor_id || "",
        }));

        setItems(mappedItems);

        // ADDITIONAL CHARGES
        const charges = res.additionalCharges.map((c: any) => ({
          name: c.charge_name,
          amount: c.amount.toString(),
          currency: c.currency,
        }));

        setAdditionalCharges(charges);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load PreCost");
      }
    };

    loadPreCost();
  }, [id]);

  //Load inquery
  React.useEffect(() => {
    if (!id) return;

    const loadInquiry = async () => {
      try {
        setLoadingInquiry(true);

        // If your API links precost -> inquiry, adjust accordingly
        const res = await InquiryService.getInquiryById(id as string);

        setInquiry(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load Inquiry");
      } finally {
        setLoadingInquiry(false);
      }
    };

    loadInquiry();
  }, [id]);

  //Load Vendors on load
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

  //Load Basis on load
  React.useEffect(() => {
    const loadBasis = async () => {
      try {
        const data = await BasisService.getBasis();
        const basisItem = Array.isArray(data) ? data[0] : data;
        setBasis(basisItem);
      } catch (err) {
        console.error(err);
      }
    };

    loadBasis();
  }, []);

  //Format basis
  const formatBasis = (v: number) =>
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 10,
    }).format(v);

  /* ================= DOWNLOAD ================= */
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

  /* ================= UPLOAD ================= */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // 1. Create Draft PreCost
      const draft = await PreCostService.createDraft();

      const id = draft?.data;

      setPrecostId(id);
      localStorage.setItem("precost_id", id);

      // 2. Upload + Validate Excel
      const validated = await QuotationService.validateExcel(file);

      // 3. Attach vendor list into items
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

  /* ================= UPDATE ================= */
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

  /* ================= DELETE ================= */
  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= Additional Charges ================= */
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

  /* ================= Total amount (LKR) calculation handler ================= */
  const totalLKR = React.useMemo(() => {
    if (!basis) return 0;

    return QuotationCalculator.calculateGrandTotalLKR(
      items,
      basis,
      additionalCharges,
      discountLKR,
    );
  }, [items, additionalCharges, discountLKR, basis]);

  /* ================= Total amount (USD) calculation handler ================= */
  const totalUSD = React.useMemo(() => {
    if (!basis) return 0;

    return QuotationCalculator.calculateGrandTotalUSD(
      items,
      basis,
      additionalCharges,
      discountLKR,
    );
  }, [items, additionalCharges, discountLKR, basis]);

  /* ================= Save Pre-Cost Handler ================= */

  const handleUpdatePreCost = async () => {
    try {
      const payload = {
        vessel_name: inquiry?.vessel_name || "",
        date_arrived: dateArrived
          ? dateArrived.toISOString().split("T")[0]
          : null,
        date_saild: dateSailed ? dateSailed.toISOString().split("T")[0] : null,
        discount: Number(discountLKR || 0),
        usd_rate: Number(basis?.USDRate || 0),
        total_cost: Number(totalLKR || 0),
        total_cost_usd: Number(totalUSD || 0),
        status: "PENDING",
        remark,

        items: items.map((item) => {
          const vendor = vendors.find(
            (v) => v.vendor_id === item.supplier_name,
          );

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

      await PreCostService.updatePreCost(id as string, payload);

      toast.success("PreCost updated successfully");

      setTimeout(() => {
        router.push("/quotation");
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update PreCost");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* HEADER */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Generate Quotation</h1>

          {inquiry && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border p-4 rounded text-sm">
              <div>
                <b>Ref:</b> {inquiry.inq_id}
              </div>
              <div>
                <b>Vessel:</b> {inquiry.vessel_name}
              </div>
              <div>
                <b>Agent:</b> {inquiry.agent}
              </div>
              <div>
                <b>Port:</b> {inquiry.port}
              </div>
              <div>
                <b>ETA:</b> {new Date(inquiry.eta).toLocaleString()}
              </div>
              <div>
                <b>Basis:</b> {formatBasis(basis.basis)}
              </div>

              <div>
                <b>USD Rate:</b> {basis.USDRate}
              </div>

              <div>
                <b>Margin:</b> {basis.margin}%
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* STEP */}
        {step === null && (
          <div className="border p-8 text-center rounded space-y-4">
            <p>Download → Fill → Upload</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setStep("excel")}>Upload Excel</Button>
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                disabled={downloading}
              >
                {downloading ? "Downloading..." : "Download Template"}
              </Button>
            </div>
          </div>
        )}

        {/* UPLOAD */}
        {step === "excel" && (
          <div className="space-y-6">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
            />

            {uploading && <p>Validating...</p>}

            {/* CARDS */}
            {items.map((item, index) => (
              <div key={index} className="border rounded-xl p-4 space-y-4">
                {/* ================= COLLAPSED VIEW ================= */}
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                    <div>
                      <b>Item:</b> {item.item_no}
                    </div>
                    <div>
                      <b>Description:</b> {item.description}
                    </div>
                    <div>
                      <b>Remark:</b> {item.customer_remark}
                    </div>
                    <div>
                      <b>Qty:</b> {item.quantity}
                    </div>
                    <div>
                      <b>Unit:</b> {item.unit}
                    </div>
                    <div>
                      <b>IMPA:</b> {item.impa_code}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setExpandedIndex(expandedIndex === index ? null : index)
                      }
                    >
                      {expandedIndex === index ? "Close" : "Edit"}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* ================= EXPANDED VIEW ================= */}
                {expandedIndex === index && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    {/* TEXT INPUT FIELDS */}
                    {[
                      ["Item Number", "item_no"],
                      ["Description", "description"],
                      ["Customer Remark", "customer_remark"],
                      ["Quantity", "quantity"],
                      ["Unit", "unit"],
                      ["IMPA Code", "impa_code"],
                      ["Unit Rate (RS)", "price"],
                      ["Unit Rate (USD)", "unit_rate_usd"],
                      ["Additional Charges", "additional_charges"],
                      ["Total Unit Rate (RS)", "total_unit_rate_rs"],
                      ["Total Unit Rate (USD)", "total_unit_rate_usd"],
                      ["CONVA (Basis)", "conva_basis"],
                      ["OMS Remark", "osc_remark"],
                    ].map(([label, field]) => {
                      const calculatedFields = [
                        "unit_rate_usd",
                        "total_unit_rate_rs",
                        "total_unit_rate_usd",
                        "conva_basis",
                        "total_rs",
                        "total_usd",
                      ];

                      const isReadOnly = calculatedFields.includes(field);

                      return (
                        <div key={field}>
                          <label className="text-xs font-medium">{label}</label>
                          <input
                            className={`w-full border p-2 rounded ${
                              isReadOnly ? "bg-muted cursor-not-allowed" : ""
                            }`}
                            value={(item as any)[field] || ""}
                            readOnly={isReadOnly}
                            onChange={(e) =>
                              !isReadOnly &&
                              updateItem(index, field, e.target.value)
                            }
                          />
                        </div>
                      );
                    })}

                    {/* ================= SUPPLIER DROPDOWN ================= */}
                    <div>
                      <label className="text-xs font-medium">
                        Supplier Name
                      </label>
                      <select
                        className="w-full border p-2 rounded"
                        value={(item as any).supplier_name || ""}
                        onChange={(e) =>
                          updateItem(index, "supplier_name", e.target.value)
                        }
                      >
                        <option value="">Select Verified Supplier</option>

                        {vendors
                          .filter(
                            (v: any) =>
                              v.status?.is_md_approved &&
                              v.status?.is_manager_approved,
                          )
                          .map((v: any) => (
                            <option key={v.vendor_id} value={v.vendor_id}>
                              {v.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* ================= AUTO CALCULATED ================= */}
                    <div>
                      <label className="text-xs font-medium">Total USD</label>
                      <input
                        className="w-full border p-2 rounded bg-muted"
                        value={item.total_usd}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium">Total RS</label>
                      <input
                        className="w-full border p-2 rounded bg-muted"
                        value={item.total_rs}
                        readOnly
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ================= ADDITIONAL CHARGERS SECTION ================= */}

        <div className="border rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Additional Charges</h2>

            <Button size="sm" onClick={addCharge}>
              + Add Charge
            </Button>
          </div>

          {additionalCharges.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No additional charges added.
            </p>
          )}

          {additionalCharges.map((charge, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-lg"
            >
              {/* Charge Name */}
              <div>
                <label className="text-xs font-medium">Charge Name</label>
                <input
                  className="w-full border p-2 rounded"
                  value={charge.name}
                  onChange={(e) => updateCharge(index, "name", e.target.value)}
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-medium">Amount</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={charge.amount}
                  onChange={(e) =>
                    updateCharge(index, "amount", e.target.value)
                  }
                />
              </div>

              {/* Currency */}
              <div>
                <label className="text-xs font-medium">Currency</label>
                <select
                  className="w-full border p-2 rounded"
                  value={charge.currency}
                  onChange={(e) =>
                    updateCharge(index, "currency", e.target.value)
                  }
                >
                  <option value="USD">USD</option>
                  <option value="LKR">LKR</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              {/* Remove */}
              <div className="flex items-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeCharge(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* ================= DISCOUNT SECTION ================= */}

        <div className="border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Discount</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Amount */}
            <div>
              <label className="text-xs font-medium">
                Discount Amount (LKR)
              </label>
              <input
                type="number"
                className="w-full border p-2 rounded"
                value={discountLKR}
                onChange={(e) => setDiscountLKR(e.target.value)}
                placeholder="Enter discount"
              />
            </div>

            {/* Currency (fixed) */}
            <div>
              <label className="text-xs font-medium">Currency</label>
              <input
                className="w-full border p-2 rounded bg-muted"
                value="LKR"
                readOnly
              />
            </div>

            {/* Clear button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDiscountLKR("")}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* ================= ADDITIONAL DETAILS SECTION ================= */}

        <div className="border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Additional Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Arrived */}
            <div>
              <label className="text-xs font-medium">Date Arrived</label>
              <DatePicker
                date={dateArrived}
                onDateChange={setDateArrived}
                placeholder="Select arrival date"
              />
            </div>

            {/* Date Sailed */}
            <div>
              <label className="text-xs font-medium">Date Sailed</label>
              <DatePicker
                date={dateSailed}
                onDateChange={setDateSailed}
                placeholder="Select sailed date"
              />
            </div>

            {/* Empty space for alignment (optional) */}
            <div />
          </div>

          {/* Remark */}
          <div>
            <label className="text-xs font-medium">Remark</label>
            <textarea
              className="w-full border p-2 rounded min-h-[100px]"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter any notes or remarks..."
            />
          </div>
        </div>

        {/* ================= TOTAL COSTS SECTION ================= */}

        <div className="border rounded-xl p-6 space-y-4 bg-muted">
          <h2 className="text-lg font-semibold">Total Cost</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LKR */}
            <div>
              <label className="text-xs font-medium">Total (LKR)</label>
              <input
                className="w-full border p-2 rounded font-bold text-lg bg-background"
                value={Number(totalLKR).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                readOnly
              />
            </div>

            {/* USD */}
            <div>
              <label className="text-xs font-medium">Total (USD)</label>
              <input
                className="w-full border p-2 rounded font-bold text-lg bg-background"
                value={Number(totalUSD).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>

          <Button onClick={() => setPreviewOpen(true)}>Update</Button>
        </div>
        <QuotationPreviewDialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          onConfirm={handleUpdatePreCost}
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
      </main>
    </div>
  );
}

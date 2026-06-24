"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDocumentEngine } from "@/hooks/use-document-job";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { BasisService } from "@/services/basis.service";
// IMPORT YOUR CUSTOM DATE PICKER HERE
import { DatePicker } from "@/components/ui/date-picker";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  precostData: any;
}

export function PreCostDownloadDialog({
  open,
  onOpenChange,
  precostData,
}: Props) {
  const { loading, runJob } = useDocumentEngine({
    pollInterval: 2000,
    maxAttempts: 5,
  });
  const [usdRate, setUsdRate] = React.useState(1);

  const [form, setForm] = React.useState({
    clientRfqNum: "",
    omsRfqNum: "",
    supplyPort: "",
    date: new Date(), // Changed from string to a real Date object for the picker
    currency: "LKR" as "LKR" | "USD",
    documentType: "pdf" as "pdf" | "excel",
  });

  const [options, setOptions] = React.useState({
    showDiscount: true,
    showAdditionalCharges: true,
  });

  /* =========================
      LOAD USD RATE
  ========================= */
  React.useEffect(() => {
    const loadRate = async () => {
      try {
        const usdRateData = await BasisService.getLatestUSDRate();

        setUsdRate(usdRateData.USDRate);
      } catch (err) {
        console.error(err);
      }
    };

    loadRate();
  }, []);

  /* =========================
      RAW VALUES (ALWAYS LKR)
  ========================= */

  const rawSubTotal =
    precostData.preCostData?.reduce(
      (sum: number, item: any) => sum + Number(item.total_price || 0),
      0,
    ) || 0;

  const rawDiscount = options.showDiscount
    ? Number(precostData.discount || 0)
    : 0;

  const rawAdditional = options.showAdditionalCharges
    ? (precostData.additionalCharges || []).reduce(
        (sum: number, c: any) => sum + Number(c.amount || 0),
        0,
      )
    : 0;

  /* =========================
      CONVERSION ENGINE
  ========================= */

  const convert = (value: number) =>
    form.currency === "USD" ? value / usdRate : value;

  const money = (value: number) =>
    `${convert(value).toFixed(2)} ${form.currency}`;

  const moneyUSD = (value: number) => `${(value / usdRate).toFixed(2)} USD`;

  /* =========================
      CONVERTED VALUES
  ========================= */

  const subTotal = convert(rawSubTotal);
  const discount = convert(rawDiscount);
  const additional = convert(rawAdditional);

  const grandTotal = subTotal - discount + additional;

  /* =========================
      DOWNLOAD
  ========================= */

  const handleDownload = async () => {
    if (loading) return;

    try {
      const payload = {
        document: "PRECOST",
        documentType: form.documentType,

        documentData: {
          id: precostData.pre_cost_id,

          vessel_name: precostData.vessel_name,

          clientRfqNum: form.clientRfqNum,
          omsRfqNum: form.omsRfqNum,
          supplyPort: form.supplyPort,
          // Formats Date object back into standard YYYY-MM-DD string for your API payload
          date: form.date.toISOString().split("T")[0],

          usd_rate: usdRate,
          currency: form.currency,

          sub_total: Number(subTotal.toFixed(2)),
          total_cost: Number(grandTotal.toFixed(2)),
          discount: Number(discount.toFixed(2)),
          additionalCharges: Number(additional.toFixed(2)),

          items: (precostData.preCostData || []).map((item: any) => ({
            ...item,
            unit_rate_usd: Number((item.unit_price / usdRate).toFixed(2)),
            total_price_usd: Number((item.total_price / usdRate).toFixed(2)),
          })),

          additional_charges: precostData.additionalCharges || [],
        },
      };

      await runJob(payload, "PreCost");

      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
      UI
  ========================= */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6 gap-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl">Download PreCost</DialogTitle>
          <DialogDescription>
            Configure document parameters before generating download files.
          </DialogDescription>
        </DialogHeader>

        {/* SCROLLABLE CONTAINER */}
        <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-5">
          {/* USD RATE BADGE */}
          <div className="text-xs text-muted-foreground bg-muted/60 px-3 py-2 rounded-md border border-border/50 flex justify-between items-center">
            <span>Active Exchange Rate:</span>
            <b className="text-foreground">1 USD = {usdRate} LKR</b>
          </div>

          {/* FORM FIELDS GRID */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Client RFQ Number
                </Label>
                <Input
                  placeholder="Enter Client RFQ"
                  value={form.clientRfqNum}
                  onChange={(e) =>
                    setForm({ ...form, clientRfqNum: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  OMS RFQ Number
                </Label>
                <Input
                  placeholder="Enter OMS RFQ"
                  value={form.omsRfqNum}
                  onChange={(e) =>
                    setForm({ ...form, omsRfqNum: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Supply Port
                </Label>
                <Input
                  placeholder="Enter Supply Port"
                  value={form.supplyPort}
                  onChange={(e) =>
                    setForm({ ...form, supplyPort: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5 flex flex-col justify-end">
                <Label className="text-xs font-medium text-muted-foreground mb-1.5">
                  Date
                </Label>
                {/* REPLACED WITH INTEGRATED DATEPICKER */}
                <DatePicker
                  date={form.date}
                  onDateChange={(newDate) =>
                    setForm({ ...form, date: newDate || new Date() })
                  }
                />
              </div>
            </div>

            {/* CURRENCY & FORMAT SELECTION */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Target Currency
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={form.currency === "USD" ? "default" : "outline"}
                    onClick={() => setForm({ ...form, currency: "USD" })}
                    className="w-full"
                  >
                    USD
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={form.currency === "LKR" ? "default" : "outline"}
                    onClick={() => setForm({ ...form, currency: "LKR" })}
                    className="w-full"
                  >
                    LKR
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Document Format
                </Label>
                <Select
                  value={form.documentType}
                  onValueChange={(v) =>
                    setForm({ ...form, documentType: v as any })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* VISIBILITY OPTIONS */}
          <div className="bg-muted/30 border rounded-lg p-3 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2.5">
              <Checkbox
                id="showDiscount"
                checked={options.showDiscount}
                onCheckedChange={(v) =>
                  setOptions({ ...options, showDiscount: !!v })
                }
              />
              <Label
                htmlFor="showDiscount"
                className="text-sm font-normal cursor-pointer select-none"
              >
                Show Discount
              </Label>
            </div>

            <div className="flex items-center space-x-2.5">
              <Checkbox
                id="showAdditionalCharges"
                checked={options.showAdditionalCharges}
                onCheckedChange={(v) =>
                  setOptions({
                    ...options,
                    showAdditionalCharges: !!v,
                  })
                }
              />
              <Label
                htmlFor="showAdditionalCharges"
                className="text-sm font-normal cursor-pointer select-none"
              >
                Show Additional Charges
              </Label>
            </div>
          </div>

          {/* FINANCIAL SUMMARY */}
          <div className="border border-border/80 rounded-xl bg-card p-4 space-y-2 text-sm shadow-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Sub Total:</span>
              <span className="font-medium">{money(rawSubTotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Discount:</span>
              <span className="font-medium text-destructive">
                {money(rawDiscount)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Additional Charges:</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-500">
                {money(rawAdditional)}
              </span>
            </div>

            <div className="flex justify-between font-semibold border-t pt-2.5 text-base text-foreground">
              <span>Grand Total:</span>
              <span>
                {grandTotal.toFixed(2)} {form.currency}
              </span>
            </div>

            <div className="text-xs text-muted-foreground text-right pt-1 border-t border-dashed mt-1">
              USD Preview: {moneyUSD(rawSubTotal)}
            </div>
          </div>
        </div>

        {/* DIALOG FOOTER */}
        <DialogFooter className="sm:justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            onClick={handleDownload}
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Generating..." : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

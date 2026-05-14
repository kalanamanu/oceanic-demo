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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { DocumentService } from "@/services/document.service";
import { waitForDocumentJob } from "@/services/document-polling.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  const [loading, setLoading] = React.useState(false);

  const [options, setOptions] = React.useState({
    showDiscount: true,
    showAdditionalCharges: true,
    documentType: "pdf" as "pdf" | "excel",
  });

  const handleDownload = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // ✅ CLEAN PAYLOAD (matches backend spec)
      const payload = {
        document: "precost",
        documentType: options.documentType,
        documentData: [
          {
            id: precostData.pre_cost_id,
            vessel_name: precostData.vessel_name,
            date_arrived: precostData.date_arrived,
            date_saild: precostData.date_saild,

            discount: precostData.discount,
            usd_rate: precostData.usd_rate,
            total_cost: precostData.total_cost,
            total_cost_usd: precostData.total_cost_usd,

            status: precostData.status,
            remark: precostData.remark,

            // ✅ IMPORTANT: backend flags (keep simple + consistent)
            discount_enabled: options.showDiscount,
            additional_charge: options.showAdditionalCharges,

            items: precostData.preCostData || [],
            additional_charges: precostData.additionalCharges || [],
          },
        ],
      };

      // 1. Generate document job
      const res = await DocumentService.generateDocument(payload);

      if (!res.jobId) {
        throw new Error("Failed to create document job");
      }

      toast.info("Generating document...");

      // 2. Wait for completion (polling)
      const job = await waitForDocumentJob(res.jobId, {
        interval: 1000,
        timeout: 5 * 60 * 1000,
      });

      // 3. Handle failure explicitly
      if (job.state === "failed") {
        throw new Error(job.error || "Document generation failed");
      }

      if (!job.result?.fileName) {
        throw new Error("File not returned from server");
      }

      // 4. Download file
      const blob = await DocumentService.downloadDocument(job.result.fileName);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = job.result.fileName;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download completed successfully");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Download PreCost</DialogTitle>
          <DialogDescription>
            Configure document before generation
          </DialogDescription>
        </DialogHeader>

        {/* OPTIONS */}
        <div className="space-y-5 py-4">
          {/* Discount */}
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={options.showDiscount}
              onCheckedChange={(v) =>
                setOptions((p) => ({
                  ...p,
                  showDiscount: !!v,
                }))
              }
              disabled={loading}
            />
            <Label>Show Discount</Label>
          </div>

          {/* Additional Charges */}
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={options.showAdditionalCharges}
              onCheckedChange={(v) =>
                setOptions((p) => ({
                  ...p,
                  showAdditionalCharges: !!v,
                }))
              }
              disabled={loading}
            />
            <Label>Show Additional Charges</Label>
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <Label>Document Type</Label>

            <RadioGroup
              value={options.documentType}
              onValueChange={(v) =>
                setOptions((p) => ({
                  ...p,
                  documentType: v as "pdf" | "excel",
                }))
              }
              className="flex gap-4"
              disabled={loading}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pdf" />
                <Label>PDF</Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="excel" />
                <Label>Excel</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* ACTIONS */}
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button onClick={handleDownload} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Generating..." : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

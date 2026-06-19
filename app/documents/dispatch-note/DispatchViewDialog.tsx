"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, Loader2 } from "lucide-react";

import { useDocumentEngine } from "@/hooks/use-document-job";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document?: any;
}

export default function DispatchViewDialog({
  open,
  onOpenChange,
  document,
}: Props) {
  const { runJob, loading } = useDocumentEngine({
    pollInterval: 2000,
    maxAttempts: 6,
  });

  const data = document?.document?.data;

  const currency = data?.currency || "LKR";

  const subTotal = Number(data?.sub_total || 0);
  const discount = Number(data?.discount || 0);
  const transportCost = Number(data?.transport_cost || 0);
  const grandTotal = Number(data?.full_total_cost || 0);

  /* =========================
     DOWNLOAD HANDLER
  ========================= */
  const handleDownload = async (type: "pdf" | "excel") => {
    if (!data) return;

    try {
      const payload = {
        document: "dispatchnote",
        documentType: type,
        documentData: {
          reference_no: data.reference_no,
          vessel_name: data.vessel_name,
          caption: data.caption,
          cook: data.cook,
          agent: data.agent,
          details: data.details,
          place_of_delivery: data.place_of_delivery,
          ETD: data.ETD,
          no_of_crew: data.no_of_crew,
          next_main_order_in: data.next_main_order_in,
          company: data.company,
          port: data.port,
          supplier: data.supplier,
          ETA: data.ETA,
          currency,
          discount,
          sub_total: subTotal,
          full_total_cost: grandTotal,
          transport_cost: transportCost,
          date: data.date,
          items: (data.items || []).map((item: any, index: number) => ({
            no: index + 1,
            ...item,
          })),
        },
      };

      await runJob(payload, "Dispatch Note");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden p-0">
        {/* Header */}
        <div className="p-6 border-b bg-muted/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Dispatch Note Details
            </DialogTitle>
            <DialogDescription>
              Read-only view of dispatch note document.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* HEADER INFO */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <Info label="Reference No" value={data?.reference_no} />
            <Info label="Vessel Name" value={data?.vessel_name} />
            <Info label="Caption" value={data?.caption} />
            <Info label="Cook" value={data?.cook} />
            <Info label="Agent" value={data?.agent} />
            <Info label="Company" value={data?.company} />
            <Info label="Port" value={data?.port} />
            <Info label="Supplier" value={data?.supplier} />
            <Info label="Place of Delivery" value={data?.place_of_delivery} />
            <Info label="ETA" value={data?.ETA} />
            <Info label="ETD" value={data?.ETD} />
            <Info label="No of Crew" value={data?.no_of_crew} />
            <Info label="Next Order In" value={data?.next_main_order_in} />
            <Info label="Date" value={data?.date} />
          </div>

          {/* DETAILS */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground uppercase">
              Details
            </Label>
            <p className="text-sm border rounded p-2 bg-muted/20">
              {data?.details || "-"}
            </p>
          </div>

          {/* ITEMS TABLE */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase text-muted-foreground">
              Dispatch Items
            </Label>

            <div className="border rounded overflow-x-auto">
              <table className="w-full min-w-[1200px] text-xs">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="p-2">#</th>
                    <th>Product</th>
                    <th>Supplier</th>
                    <th>PO No</th>
                    <th>Unit</th>
                    <th>Rcvd</th>
                    <th>Issued</th>
                    <th>Rejects</th>
                    <th>Fat Con</th>
                    <th>Expiry</th>
                    <th>Received Time</th>
                    <th>Date</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.map((item: any, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{index + 1}</td>
                      <td>{item.product}</td>
                      <td>{item.supplier}</td>
                      <td>{item.po_no}</td>
                      <td>{item.unit}</td>
                      <td>{item.rcvd_qty}</td>
                      <td>{item.issued_qty}</td>
                      <td>{item.rejects}</td>
                      <td>{item.fat_con}</td>
                      <td>{item.exp_date}</td>
                      <td>{item.revd_time}</td>
                      <td>{item.date}</td>
                      <td>{item.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="border rounded p-4 space-y-2 bg-muted/10 text-sm">
            <div className="flex justify-between">
              <span>Sub Total ({currency})</span>
              <span>{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Transport Cost</span>
              <span>{transportCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Grand Total</span>
              <span>
                {currency} {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t flex justify-end items-center gap-2 bg-muted/10">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={() => handleDownload("pdf")}
            disabled={loading || !data}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Helper */
function Info({ label, value }: { label: string; value?: any }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value || "-"}</div>
    </div>
  );
}

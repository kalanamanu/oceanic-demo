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
import {
  Download,
  Loader2,
  Building,
  User,
  Ship,
  FileText,
  DollarSign,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { useDocumentEngine } from "@/hooks/use-document-job";
import { SavedDocument } from "@/types/document.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SavedDocument | null;
}

export default function CreditNoteViewDialog({
  open,
  onOpenChange,
  document,
}: Props) {
  const { loading, runJob } = useDocumentEngine();

  const doc = document;
  const data = (doc as any)?.data;

  const buildPayload = React.useCallback(() => {
    if (!doc || !data) return null;

    return {
      document: "CREDIT NOTE",
      documentType: "pdf",
      documentData: {
        companyName: data.companyName,
        companyAddressLine1: data.companyAddressLine1,
        companyAddressLine2: data.companyAddressLine2,
        companyPostal: data.companyPostal,
        companyContact: data.companyContact,
        companyBR: data.companyBR,
        companyLicense: data.companyLicense,
        logoUrl: data.logoUrl,
        title: "CREDIT NOTE",
        crnNo: data.crnNo,
        date: data.date,
        billToName: data.billToName,
        billToDetails: data.billToDetails,
        vesselName: data.vesselName,
        grt: data.grt,
        port: data.port,
        imo: data.imo,
        nameOfAgent: data.nameOfAgent,
        portCountry: data.portCountry,
        items: data.items || [],
        totalAmount: Number(data.totalAmount || 0),
        approvedBy: data.approvedBy,
      },
    };
  }, [doc, data]);

  const handleDownload = async () => {
    const payload = buildPayload();
    if (!payload) return;

    try {
      await runJob(payload, "Credit Note");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Credit Note Details
          </DialogTitle>
          <DialogDescription>
            Review complete credit note parameters before downloading.
          </DialogDescription>
        </DialogHeader>

        {!doc ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading information...
          </div>
        ) : (
          <div className="space-y-6 my-4 text-sm">
            {/* ================= DOCUMENT & COMPANY META ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg border">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Document Details</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference No:</span>{" "}
                  <span className="font-semibold">
                    {data?.crnNo || doc.reference_no}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue Date:</span>{" "}
                  <span className="font-medium">{data?.date}</span>
                </div>
              </div>

              <div className="space-y-2 border-t md:border-t-0 md:border-l md:pl-4 pt-2 md:pt-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <Building className="w-3.5 h-3.5" />
                  <span>Company Info</span>
                </div>
                <div className="truncate">
                  <span className="text-muted-foreground">Issuer:</span>{" "}
                  <span className="font-medium ml-1">
                    {data?.companyName || "—"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {data?.companyAddressLine1} {data?.companyPostal}
                </div>
                <div className="text-xs text-muted-foreground">
                  BR No: {data?.companyBR || "—"} | Lic:{" "}
                  {data?.companyLicense || "—"}
                </div>
              </div>
            </div>

            {/* ================= BILL TO (CUSTOMER) ================= */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <User className="w-3.5 h-3.5" />
                <span>Bill To (Customer)</span>
              </div>
              <div className="border rounded-lg p-3.5 space-y-1.5 bg-background shadow-sm">
                <div className="font-semibold text-base">
                  {data?.billToName || "—"}
                </div>
                <div className="text-muted-foreground text-xs whitespace-pre-line leading-relaxed">
                  {data?.billToDetails || "—"}
                </div>
              </div>
            </div>

            {/* ================= VESSEL INFORMATION ================= */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <Ship className="w-3.5 h-3.5" />
                <span>Vessel Information</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 border rounded-lg p-4 bg-background shadow-sm">
                <div>
                  <span className="block text-xs text-muted-foreground">
                    Vessel Name
                  </span>
                  <span className="font-medium">{data?.vesselName || "—"}</span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">
                    IMO Number
                  </span>
                  <span className="font-medium font-mono">
                    {data?.imo || "—"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">
                    Gross Tonnage (GRT)
                  </span>
                  <span className="font-medium">{data?.grt || "—"}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-xs text-muted-foreground">
                    Port / Service Location
                  </span>
                  <span className="font-medium">
                    {data?.port}
                    {data?.portCountry ? `, ${data.portCountry}` : ""}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">
                    Maritime Agent
                  </span>
                  <span className="font-medium">
                    {data?.nameOfAgent || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* ================= LINE ITEMS ================= */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Service Items Summary</span>
              </div>
              <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-xs font-medium text-muted-foreground uppercase">
                      <th className="p-3">Description</th>
                      <th className="p-3 text-center w-16">Qty</th>
                      <th className="p-3 text-right w-28">Unit Price</th>
                      <th className="p-3 text-right w-28">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data?.items && data.items.length > 0 ? (
                      data.items.map((item: any, idx: number) => (
                        <tr
                          key={idx}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="p-3 font-medium max-w-[200px] sm:max-w-none truncate">
                            {item.description || "—"}
                          </td>
                          <td className="p-3 text-center font-mono">
                            {item.quantity}
                          </td>
                          <td className="p-3 text-right font-mono">
                            {Number(item.unit_price || 0).toFixed(2)}
                          </td>
                          <td className="p-3 text-right font-mono font-medium">
                            {(
                              Number(item.quantity || 0) *
                              Number(item.unit_price || 0)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-4 text-center text-muted-foreground"
                        >
                          No service items tracked.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="bg-muted/40 p-3.5 flex justify-end border-t">
                  <div className="text-right">
                    <span className="text-xs font-medium uppercase text-muted-foreground mr-2">
                      Total Refundable:
                    </span>
                    <span className="font-mono text-base font-bold text-foreground">
                      LKR {Number(data?.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= APPROVAL AUTHORITY ================= */}
            <div className="flex items-center justify-between border-t pt-3 text-xs">
              <span className="text-muted-foreground font-medium uppercase tracking-wide">
                Approval Signature Profile:
              </span>
              <span className="font-semibold px-2.5 py-1 bg-secondary rounded text-secondary-foreground">
                {data?.approvedBy || "Pending Review"}
              </span>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close View
          </Button>
          <Button onClick={handleDownload} disabled={!doc || loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Compiling PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download Document
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

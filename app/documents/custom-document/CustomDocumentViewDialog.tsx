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
  FileText,
  Truck,
  Shield,
  Package,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { useDocumentEngine } from "@/hooks/use-document-job";
import { SavedDocument } from "@/types/document.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SavedDocument | null;
}

export default function CustomDocumentViewDialog({
  open,
  onOpenChange,
  document,
}: Props) {
  const { loading, runJob } = useDocumentEngine();

  const doc = document;
  const data = (doc as any)?.data;

  // ================= BUILD PAYLOAD =================
  const buildPayload = React.useCallback(() => {
    if (!doc || !data) return null;

    return {
      document: "CUSTOMDOCUMENT",
      documentType: "pdf",
      documentData: {
        ...data,
      },
    };
  }, [doc, data]);

  // ================= DOWNLOAD =================
  const handleDownload = async () => {
    const payload = buildPayload();
    if (!payload) return;

    try {
      await runJob(payload, "Custom Document");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl p-6 sm:p-8">
        {/* ================= HEADER ================= */}
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Custom Document Details
          </DialogTitle>
          <DialogDescription>
            Review complete document before downloading.
          </DialogDescription>
        </DialogHeader>

        {!doc ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading information...
          </div>
        ) : (
          <div className="space-y-6 my-4 text-sm">
            {/* ================= COMPANY & DOCUMENT META ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/40 p-5 rounded-lg border">
              {/* DOCUMENT */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                  <FileText className="w-4 h-4" />
                  Document Info
                </div>

                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="font-semibold">{data?.title}</span>
                </div>

                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{data?.date}</span>
                </div>

                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">Section:</span>
                  <span>{data?.sectionCode}</span>
                </div>
              </div>

              {/* COMPANY */}
              <div className="space-y-2.5 border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                  <Building className="w-4 h-4" />
                  Company Info
                </div>

                <div className="font-medium">{data?.companyName}</div>

                <div className="text-xs text-muted-foreground">
                  {data?.officeAddressLine1}
                </div>
                <div className="text-xs text-muted-foreground">
                  {data?.officeAddressLine2}
                </div>
                <div className="text-xs text-muted-foreground">
                  {data?.officeAddressLine3}
                </div>

                <div className="text-xs text-muted-foreground">
                  Tel: {data?.telePhone}
                </div>
                <div className="text-xs text-muted-foreground">
                  Email: {data?.emailAddress}
                </div>
              </div>
            </div>

            <Separator />

            {/* ================= PERMISSION SECTION ================= */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                <Shield className="w-4 h-4" />
                Permission Details
              </div>

              <div className="border rounded-lg p-4 bg-background shadow-sm space-y-2">
                <div>
                  <strong>Director:</strong> {data?.directorOfCustoms}
                </div>
                <div>
                  <strong>Security Officer:</strong>{" "}
                  {data?.chiefSecurityOfficer}
                </div>
                <div>
                  <strong>Location:</strong> {data?.slpa} / {data?.exportGate} /{" "}
                  {data?.gateNo}
                </div>
                <div className="text-muted-foreground text-xs mt-2">
                  {data?.permissionText}
                </div>
              </div>
            </div>

            <Separator />

            {/* ================= VEHICLE & PERMIT ================= */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                <Truck className="w-4 h-4" />
                Transport Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-lg p-5 bg-background shadow-sm">
                <div>
                  <span className="text-xs text-muted-foreground">
                    Vehicle No
                  </span>
                  <div className="font-medium">{data?.vehicleNo}</div>
                </div>

                <div>
                  <span className="text-xs text-muted-foreground">
                    Permit No
                  </span>
                  <div className="font-medium">{data?.permitNo}</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* ================= ITEMS ================= */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                <Package className="w-4 h-4" />
                Items
              </div>

              <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-xs uppercase">
                      <th className="p-4">Description</th>
                      <th className="p-4 text-center">Qty</th>
                      <th className="p-4 text-center">Unit</th>
                      <th className="p-4 text-right">Rate</th>
                      <th className="p-4 text-right">Total</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {data?.items?.length > 0 ? (
                      data.items.map((item: any, i: number) => (
                        <tr key={i}>
                          <td className="p-4 font-medium">
                            {item.description}
                          </td>
                          <td className="p-4 text-center">{item.quantity}</td>
                          <td className="p-4 text-center">{item.unit}</td>
                          <td className="p-4 text-right">
                            {Number(item.rate).toFixed(2)}
                          </td>
                          <td className="p-4 text-right font-medium">
                            {Number(item.total).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center">
                          No items available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= FOOTER ================= */}
        <DialogFooter className="gap-3 border-t pt-5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close View
          </Button>

          <Button onClick={handleDownload} disabled={!doc || loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating PDF...
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

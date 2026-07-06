"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentService } from "@/services/document.service";

interface Props {
  docId: string;
  open: boolean;
  onClose: () => void;
}

export default function CreditNoteViewDialog({ docId, open, onClose }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!docId || !open) return;

      try {
        setLoading(true);
        const res = await DocumentService.getDocument(docId);
        setData(res?.document || null);
      } catch (err) {
        console.error("Failed to load credit note:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [docId, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Credit Note Details</DialogTitle>
        </DialogHeader>

        {loading && <p className="text-muted-foreground">Loading...</p>}

        {data && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <p>
                <b>CRN No:</b> {data.crnNo}
              </p>
              <p>
                <b>Date:</b> {data.date}
              </p>
            </div>

            <div>
              <p className="font-semibold">Bill To</p>
              <p>{data.billToName}</p>
              <p className="text-muted-foreground whitespace-pre-line">
                {data.billToDetails}
              </p>
            </div>

            <div>
              <p className="font-semibold">Vessel</p>
              <p>
                {data.vesselName} ({data.imo})
              </p>
              <p>{data.portCountry}</p>
            </div>

            <div>
              <p className="font-semibold">Items</p>

              <div className="space-y-1">
                {data.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.description}</span>
                    <span>{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-right font-semibold">
              Total: {data.totalAmount}
            </div>

            <div className="text-xs text-muted-foreground">
              Approved By: {data.approvedBy}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

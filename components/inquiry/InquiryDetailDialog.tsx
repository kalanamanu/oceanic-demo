"use client";

import type { Remark } from "@/lib/types";
import type { Inquiry, InquiryRemark } from "@/types/inquiry.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit2, MessageSquare, File } from "lucide-react";
import { Card } from "@/components/ui/card";
import * as React from "react";
import { EditInquiryDialog } from "@/components/inquiry/EditInquiryDialog";
import { AddRemarkDialog } from "@/components/inquiry/AddRemarkDialog";
import { InquiryRemarkService } from "@/services/inquiry-remark.service";
import { useRouter } from "next/navigation";
interface InquiryDetailDialogProps {
  inquiry: Inquiry | null;
  remarks: Remark[];
  open: boolean;
  onClose: () => void;
  onEditInquiry?: (updatedInquiry: Inquiry) => void;
}

export function InquiryDetailDialog({
  inquiry,
  remarks,
  open,
  onClose,
  onEditInquiry,
}: InquiryDetailDialogProps) {
  // 0: detail, 1: edit, 2: add remark, null: none
  const [dialogState, setDialogState] = React.useState<0 | 1 | 2 | null>(
    open ? 0 : null,
  );
  const router = useRouter(); // <-- Add this line
  
  const [liveRemarks, setLiveRemarks] = React.useState<InquiryRemark[]>([]);
  const [loadingRemarks, setLoadingRemarks] = React.useState(false);

  React.useEffect(() => {
    if (open) setDialogState(0);
    else setDialogState(null);
  }, [open]);

  React.useEffect(() => {
    const idToUse = inquiry?.inq_id || inquiry?.id;
    if (open && idToUse) {
      loadRemarks(idToUse as string);
    }
  }, [open, inquiry]);

  const loadRemarks = async (inqId: string) => {
    setLoadingRemarks(true);
    try {
      const data = await InquiryRemarkService.getRemarksByInquiryId(inqId);
      setLiveRemarks(data);
    } catch (e) {
      console.error("Failed to fetch remarks", e);
    } finally {
      setLoadingRemarks(false);
    }
  };

  const handleAddRemarkSave = async (remarkText: string) => {
    if (!inquiry) return;
    const idToUse = inquiry.inq_id || inquiry.id;
    if (!idToUse) return;
    await InquiryRemarkService.createRemark({
      inq_id: idToUse as string,
      remark: remarkText
    });
    await loadRemarks(idToUse as string);
    setDialogState(0);
  };

  if (!inquiry) return null;
  
  const currentIdToUse = inquiry.inq_id || inquiry.id;

  const handleEditSave = (updatedInquiry: Inquiry) => {
    if (onEditInquiry) {
      onEditInquiry(updatedInquiry);
    }
    setDialogState(0); // reopen detail dialog after edit
  };

  return (
    <>
      <Dialog
        open={dialogState === 0}
        onOpenChange={(val) => !val && onClose()}
      >
        <DialogContent className="w-full max-w-screen-xl mx-auto rounded-xl shadow-lg p-0">
          <DialogHeader className="px-10 pt-10 pb-4">
            <DialogTitle className="text-2xl">
              INQ-{currentIdToUse ? currentIdToUse.replace("inq_", "").substring(0, 6).toUpperCase() : "UNKNOWN"}
            </DialogTitle>
            <DialogDescription className="mt-1 text-base">
              Vessel inquiry detail overview
            </DialogDescription>
          </DialogHeader>

          {/* content area */}
          <div
            className="overflow-y-auto px-10 py-6"
            style={{ maxHeight: "70vh" }}
          >
            <div className="space-y-8">
              {/* Vessel Info */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Vessel Information
                </h3>
                <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm items-start">
                  <div>
                    <div className="text-muted-foreground">Vessel Name</div>
                    <div className="font-medium text-lg text-foreground">
                      {inquiry.vessel_name}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Agent</div>
                    <div className="font-medium text-lg text-foreground">
                      {inquiry.agent}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Port</div>
                    <div className="font-medium text-lg text-foreground">
                      {inquiry.port}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">ETA</div>
                    <div className="font-medium text-lg text-foreground">
                      {new Date(inquiry.eta).toLocaleDateString() +
                        " " +
                        new Date(inquiry.eta).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {inquiry.categories && inquiry.categories.map(
                    (cat) => (
                      <Badge key={cat.id || cat.name} variant="outline">
                        {cat.name}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <Separator />

              {/* Status & Assignment */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Status & Assignment
                </h3>
                <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm items-start">
                  <div>
                    <div className="text-muted-foreground">Current Status</div>
                    <div className="font-medium text-lg text-foreground">
                      {inquiry.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">
                      Person in Charge
                    </div>
                    <div className="font-medium text-lg text-foreground">
                      {inquiry.pics && inquiry.pics.length > 0 ? inquiry.pics[0].pic_name : inquiry.key_pic_usr_id || "Unassigned"}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Remarks */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Remarks History
                  </h3>
                </div>
                <div className="space-y-3">
                  {loadingRemarks ? (
                    <p className="text-sm text-muted-foreground">Loading remarks...</p>
                  ) : liveRemarks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No remarks yet
                    </p>
                  ) : (
                    liveRemarks.map((r) => (
                      <Card key={r.remark_id} className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="text-xs font-medium text-primary">
                              {r.created_by || "Unknown User"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(r.created_date).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-base text-foreground">
                            {r.remark}
                          </p>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2 pt-2">
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() => setDialogState(1)}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Inquiry
                </Button>
                <Button 
                   className="w-full bg-transparent" 
                   variant="outline"
                   onClick={() => setDialogState(2)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Remark
                </Button>
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() =>
                    router.push(`/quotation/create?inquiryId=${currentIdToUse || ""}`)
                  }
                >
                  <File className="mr-2 h-4 w-4" />
                  Generate Quotation
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {dialogState === 1 && inquiry && (
        <EditInquiryDialog
          inquiry={inquiry}
          open={dialogState === 1}
          onClose={() => setDialogState(0)}
          onSave={handleEditSave}
        />
      )}
      {dialogState === 2 && inquiry && (
        <AddRemarkDialog
          inquiryId={currentIdToUse || ""}
          open={dialogState === 2}
          onClose={() => setDialogState(0)}
          onSave={handleAddRemarkSave}
        />
      )}
    </>
  );
}

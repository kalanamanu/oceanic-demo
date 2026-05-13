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
import { Card } from "@/components/ui/card";

import {
  Edit2,
  MessageSquare,
  File,
  Ship,
  MapPin,
  User,
  Mail,
  Phone,
  CalendarDays,
  Clock,
  Briefcase,
} from "lucide-react";

import * as React from "react";

import { EditInquiryDialog } from "@/components/inquiry/EditInquiryDialog";
import { AddRemarkDialog } from "@/components/inquiry/AddRemarkDialog";
import { EditRemarkDialog } from "@/components/inquiry/EditRemarkDialog";

import { InquiryRemarkService } from "@/services/inquiry-remark.service";
import { InquiryService } from "@/services/inquiry.service";

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
  const [dialogState, setDialogState] = React.useState<
    0 | 1 | 2 | 3 | null
  >(open ? 0 : null);

  const router = useRouter();

  const [liveRemarks, setLiveRemarks] = React.useState<InquiryRemark[]>([]);
  const [loadingRemarks, setLoadingRemarks] = React.useState(false);

  const [editingRemark, setEditingRemark] =
    React.useState<InquiryRemark | null>(null);

  const [fullInquiry, setFullInquiry] = React.useState<Inquiry | null>(null);
  const [loadingInquiry, setLoadingInquiry] = React.useState(false);

  React.useEffect(() => {
    if (open) setDialogState(0);
    else setDialogState(null);
  }, [open]);

  React.useEffect(() => {
    const idToUse = inquiry?.inq_id || inquiry?.id;

    if (open && idToUse) {
      loadInquiry(idToUse as string);
      loadRemarks(idToUse as string);
    }
  }, [open, inquiry]);

  const loadInquiry = async (inqId: string) => {
    try {
      setLoadingInquiry(true);

      const data = await InquiryService.getInquiryById(inqId);

      setFullInquiry(data);
    } catch (err) {
      console.error("Failed to load inquiry", err);
    } finally {
      setLoadingInquiry(false);
    }
  };

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
    if (!fullInquiry) return;

    const idToUse = fullInquiry.inq_id || fullInquiry.id;

    if (!idToUse) return;

    await InquiryRemarkService.createRemark({
      inq_id: idToUse as string,
      remark: remarkText,
    });

    await loadRemarks(idToUse as string);

    setDialogState(0);
  };

  const handleEditRemarkSave = async (
    remarkId: string,
    remarkText: string,
  ) => {
    const idToUse = fullInquiry?.inq_id || fullInquiry?.id;

    if (!idToUse) return;

    await InquiryRemarkService.updateRemark(remarkId, {
      remark: remarkText,
    });

    await loadRemarks(idToUse as string);

    setDialogState(0);
  };

  if (!inquiry) return null;

  const data = fullInquiry || inquiry;

  const currentIdToUse = data.inq_id || data.id;

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB").replace(/\//g, ".");
  };

  const formatTime = (time?: string) => {
    if (!time) return "-";

    return time.slice(0, 5);
  };

  const formatDateTime = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleEditSave = (updatedInquiry: Inquiry) => {
    if (onEditInquiry) {
      onEditInquiry(updatedInquiry);
    }

    setFullInquiry(updatedInquiry);

    setDialogState(0);
  };

  return (
    <>
      <Dialog
        open={dialogState === 0}
        onOpenChange={(val) => !val && onClose()}
      >
        <DialogContent className="w-full max-w-screen-xl mx-auto rounded-xl shadow-lg p-0">
          <DialogHeader className="px-10 pt-10 pb-4">
            <DialogTitle className="text-2xl font-bold">
              INQ-
              {currentIdToUse
                ?.replace("inq_", "")
                .substring(0, 6)
                .toUpperCase()}
            </DialogTitle>

            <DialogDescription className="mt-1 text-base">
              Vessel inquiry detail overview
            </DialogDescription>
          </DialogHeader>

          <div
            className="overflow-y-auto px-10 py-6"
            style={{ maxHeight: "70vh" }}
          >
            {loadingInquiry ? (
              <div className="py-20 text-center text-muted-foreground">
                Loading inquiry details...
              </div>
            ) : (
              <div className="space-y-8">
                {/* ================= Vessel Info ================= */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Ship className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">
                      Vessel Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <DetailItem
                      icon={<Ship className="h-4 w-4" />}
                      label="Vessel Name"
                      value={data.vessel_name}
                    />

                    <DetailItem
                      icon={<MapPin className="h-4 w-4" />}
                      label="Port"
                      value={data.port}
                    />

                    <DetailItem
                      icon={<Briefcase className="h-4 w-4" />}
                      label="Agent"
                      value={data.agent}
                    />

                    <DetailItem
                      icon={<CalendarDays className="h-4 w-4" />}
                      label="ETA"
                      value={formatDate(data.eta)}
                    />

                    <DetailItem
                      icon={<CalendarDays className="h-4 w-4" />}
                      label="Received Date"
                      value={formatDate(data.received_date)}
                    />

                    <DetailItem
                      icon={<Clock className="h-4 w-4" />}
                      label="Received Time"
                      value={formatTime(data.received_time)}
                    />

                    <DetailItem
                      icon={<CalendarDays className="h-4 w-4" />}
                      label="Quotation Deadline"
                      value={formatDate(
                        data.qout_submission_deadline_date,
                      )}
                    />

                    <DetailItem
                      icon={<Clock className="h-4 w-4" />}
                      label="Created At"
                      value={formatDateTime(data.createdAt)}
                    />

                    <DetailItem
                      icon={<Clock className="h-4 w-4" />}
                      label="Updated At"
                      value={formatDateTime(data.updatedAt)}
                    />
                  </div>
                </div>

                <Separator />

                {/* ================= Customer Info ================= */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">
                      Customer Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <DetailItem
                      icon={<User className="h-4 w-4" />}
                      label="Customer"
                      value={data.customer || "-"}
                    />

                    <DetailItem
                      icon={<Phone className="h-4 w-4" />}
                      label="Contact"
                      value={data.customerContact || "-"}
                    />

                    <DetailItem
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      value={data.customerEmail || "-"}
                    />

                    <DetailItem
                      icon={<Briefcase className="h-4 w-4" />}
                      label="Commission Party"
                      value={data.commissionParty || "-"}
                    />
                  </div>
                </div>

                <Separator />

                {/* ================= Assignment ================= */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Assignment Details
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                        Key PIC
                      </p>

                      <div className="inline-flex items-center rounded-lg border bg-muted/30 px-4 py-2">
                        {data.key_pic?.name || "Unassigned"}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                        Other PICs
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {data.other_pics && data.other_pics.length > 0 ? (
                          data.other_pics.map((pic: any) => (
                            <Badge
                              key={pic.id}
                              variant="secondary"
                              className="px-3 py-1"
                            >
                              {pic.name}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No other PICs assigned
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* ================= Remarks ================= */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />

                    <h3 className="text-lg font-semibold">
                      Remarks History
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {loadingRemarks ? (
                      <p className="text-sm text-muted-foreground">
                        Loading remarks...
                      </p>
                    ) : liveRemarks.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No remarks yet
                      </p>
                    ) : (
                      liveRemarks.map((r) => (
                        <Card
                          key={r.remark_id}
                          className="p-4 group relative"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-xs font-medium text-primary">
                                  {r.created_by || "Unknown User"}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {formatDateTime(r.created_date)}
                                </p>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  setEditingRemark(r);
                                  setDialogState(3);
                                }}
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                            </div>

                            <p className="text-base text-foreground pr-4">
                              {r.remark}
                            </p>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>

                <Separator />

                {/* ================= Actions ================= */}
                <div className="space-y-2 pt-2">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setDialogState(1)}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Inquiry
                  </Button>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setDialogState(2)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Remark
                  </Button>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/quotation/create?inquiryId=${currentIdToUse || ""}`,
                      )
                    }
                  >
                    <File className="mr-2 h-4 w-4" />
                    Generate Quotation
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= Edit Inquiry ================= */}
      {dialogState === 1 && data && (
        <EditInquiryDialog
          inquiry={data}
          open={dialogState === 1}
          onClose={() => setDialogState(0)}
          onSave={handleEditSave}
        />
      )}

      {/* ================= Add Remark ================= */}
      {dialogState === 2 && data && (
        <AddRemarkDialog
          inquiryId={currentIdToUse || ""}
          open={dialogState === 2}
          onClose={() => setDialogState(0)}
          onSave={handleAddRemarkSave}
        />
      )}

      {/* ================= Edit Remark ================= */}
      {dialogState === 3 && editingRemark && (
        <EditRemarkDialog
          remark={editingRemark}
          open={dialogState === 3}
          onClose={() => setDialogState(0)}
          onSave={handleEditRemarkSave}
        />
      )}
    </>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="space-y-1 rounded-xl border bg-muted/20 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}

        <p className="text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </p>
      </div>

      <p className="text-sm font-semibold text-foreground break-words">
        {value || "-"}
      </p>
    </div>
  );
}
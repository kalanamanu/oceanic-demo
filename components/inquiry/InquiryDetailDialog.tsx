"use client";

import type { Remark } from "@/lib/types";
import type { Inquiry, InquiryRemark } from "@/types/inquiry.types";

import * as React from "react";
import { useRouter } from "next/navigation";

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

import { EditInquiryDialog } from "@/components/inquiry/EditInquiryDialog";
import { AddRemarkDialog } from "@/components/inquiry/AddRemarkDialog";
import { EditRemarkDialog } from "@/components/inquiry/EditRemarkDialog";

import { InquiryRemarkService } from "@/services/inquiry-remark.service";
import { InquiryService } from "@/services/inquiry.service";

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
  const [dialogState, setDialogState] = React.useState<0 | 1 | 2 | 3 | null>(
    open ? 0 : null,
  );

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

  const handleEditRemarkSave = async (remarkId: string, remarkText: string) => {
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
        <DialogContent
          className="
    w-[70vw]
    max-w-[1600px]
    sm:max-w-[1600px]
    h-[95vh]
    p-0
    overflow-hidden
    rounded-3xl
    border
    shadow-2xl
  "
        >
          {/* HEADER */}
          <DialogHeader className="border-b bg-background px-8 py-6 shrink-0">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <DialogTitle className="text-3xl font-bold tracking-tight">
                  INQ-
                  {currentIdToUse
                    ?.replace("inq_", "")
                    .substring(0, 6)
                    .toUpperCase()}
                </DialogTitle>

                <DialogDescription className="mt-2 text-sm">
                  Vessel inquiry detail overview
                </DialogDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="rounded-xl px-3 py-1 text-xs"
                >
                  {data.port || "No Port"}
                </Badge>

                <Badge className="rounded-xl px-3 py-1 text-xs">
                  {data.key_pic?.name || "Unassigned"}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto bg-muted/20">
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 p-8 min-w-0">
              {/* LEFT */}
              <div className="space-y-6 min-w-0">
                {/* Vessel */}
                <SectionCard
                  title="Vessel Information"
                  icon={<Ship className="h-5 w-5" />}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
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
                      value={formatDate(data.qout_submission_deadline_date)}
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
                </SectionCard>

                {/* Customer */}
                <SectionCard
                  title="Customer Information"
                  icon={<User className="h-5 w-5" />}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </SectionCard>

                {/* Assignment */}
                <SectionCard
                  title="Assignment Details"
                  icon={<Briefcase className="h-5 w-5" />}
                >
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                        Key PIC
                      </p>

                      <div className="inline-flex items-center rounded-xl border bg-muted/20 px-4 py-2 text-sm font-medium">
                        {data.key_pic?.name || "Unassigned"}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                        Other PICs
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {data.other_pics && data.other_pics.length > 0 ? (
                          data.other_pics.map((pic: any) => (
                            <Badge
                              key={pic.id}
                              variant="secondary"
                              className="rounded-xl px-3 py-1"
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
                </SectionCard>
              </div>

              {/* RIGHT */}
              <div className="space-y-6 min-w-0">
                {/* Remarks */}
                <SectionCard
                  title="Remarks History"
                  icon={<MessageSquare className="h-5 w-5" />}
                >
                  {loadingRemarks ? (
                    <p className="text-sm text-muted-foreground">
                      Loading remarks...
                    </p>
                  ) : liveRemarks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No remarks yet
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {liveRemarks.map((r) => (
                        <div
                          key={r.remark_id}
                          className="relative pl-6 border-l border-border"
                        >
                          <div className="absolute left-[-7px] top-1 h-3 w-3 rounded-full bg-primary" />

                          <div className="rounded-2xl border bg-background p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">
                                  {r.created_by || "Unknown User"}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {formatDateTime(r.created_date)}
                                </p>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-xl"
                                onClick={() => {
                                  setEditingRemark(r);
                                  setDialogState(3);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
                              {r.remark}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>

                {/* Actions */}
                <SectionCard
                  title="Actions"
                  icon={<Edit2 className="h-5 w-5" />}
                >
                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start h-11 rounded-xl"
                      variant="outline"
                      onClick={() => setDialogState(1)}
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Inquiry
                    </Button>

                    <Button
                      className="w-full justify-start h-11 rounded-xl"
                      variant="outline"
                      onClick={() => setDialogState(2)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Add Remark
                    </Button>

                    <Button
                      className="w-full justify-start h-11 rounded-xl"
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
                </SectionCard>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Inquiry */}
      {dialogState === 1 && data && (
        <EditInquiryDialog
          inquiry={data}
          open={dialogState === 1}
          onClose={() => setDialogState(0)}
          onSave={handleEditSave}
        />
      )}

      {/* Add Remark */}
      {dialogState === 2 && data && (
        <AddRemarkDialog
          inquiryId={currentIdToUse || ""}
          open={dialogState === 2}
          onClose={() => setDialogState(0)}
          onSave={handleAddRemarkSave}
        />
      )}

      {/* Edit Remark */}
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

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-3xl border bg-background shadow-sm overflow-hidden">
      <div className="border-b px-6 py-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
          {icon}
        </div>

        <h3 className="font-semibold text-base">{title}</h3>
      </div>

      <div className="p-6">{children}</div>
    </Card>
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
    <div className="min-h-[115px] rounded-2xl border bg-muted/20 p-4 transition-all duration-200 hover:bg-muted/40 hover:border-primary/20">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}

        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <div className="mt-3">
        <p className="text-sm font-semibold leading-relaxed break-words">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

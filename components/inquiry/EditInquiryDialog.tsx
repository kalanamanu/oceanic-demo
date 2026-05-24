"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { CategorySelect } from "./category-select";

import { DatePicker } from "@/components/ui/date-picker";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { TimePicker } from "@/components/ui/time-picker";

import { parseISO, format } from "date-fns";

import { UserSelect } from "@/components/inquiry/user-select";

import { InquiryService } from "@/services/inquiry.service";

import {
  Ship,
  MapPin,
  User,
  Phone,
  Mail,
  Briefcase,
  CalendarDays,
  Clock,
  Layers3,
  Edit2,
  X,
} from "lucide-react";

import type { Inquiry, InquiryPIC } from "@/types/inquiry.types";

import { toast } from "sonner";

const STATUS_OPTIONS = [
  "Pending",
  "In progress",
  "Order in progress",
  "Cancelled",
  "PO Pending",
  "Reconciliation in progress",
  " Payment Pending",
  "Partially paid",
  "Paid",
  "UnPaied",
] as const;

interface EditInquiryDialogProps {
  inquiry: Inquiry;
  open: boolean;
  onClose: () => void;
  onSave: (updatedInquiry: Inquiry) => void;
}

export function EditInquiryDialog({
  inquiry,
  open,
  onClose,
  onSave,
}: EditInquiryDialogProps) {
  const [fields, setFields] = React.useState<Inquiry>({
    ...inquiry,
    other_pics: inquiry.other_pics ?? [],
  });

  React.useEffect(() => {
    setFields({
      ...inquiry,
      other_pics: inquiry.other_pics ?? [],
    });
  }, [inquiry, open]);

  const parseDate = (value?: string) => {
    if (!value) return undefined;
    try {
      return parseISO(value);
    } catch {
      return undefined;
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  const formatDateTime = (date?: Date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubPic = () => {
    setFields((prev) => ({
      ...prev,
      other_pics: [...(prev.other_pics || []), { id: "", name: "" }],
    }));
  };

  const handleRemoveSubPic = (idx: number) => {
    setFields((prev) => ({
      ...prev,
      other_pics: (prev.other_pics || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await InquiryService.updateInquiry({
        id: inquiry.inq_id!, // or inquiry.id depending on your model

        vessel_name: fields.vessel_name,
        agent: fields.agent,
        eta: fields.eta,
        port: fields.port,
        received_date: fields.received_date,
        received_time: fields.received_time,
        qout_submission_deadline_date: fields.qout_submission_deadline_date,

        key_pic_usr_id: fields.key_pic_usr_id,

        // IMPORTANT: ensure backend format
        categories: (fields.categories || []).map((c: any) => ({
          id: c.cte_id ?? c.id,
          name: c.cte_name ?? c.name,
        })),

        pics: (fields.other_pics || []).map((p) => ({
          pic_usr_id: p.id,
          pic_name: p.name,
        })),

        customer: fields.customer,
        customerContact: fields.customerContact,
        customerEmail: fields.customerEmail,
        commissionParty: fields.commissionParty,

        status: fields.status ?? "Pending",
      });

      toast.success("Inquiry updated successfully");

      onSave(fields);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update inquiry");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[50vw]
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
        <DialogHeader className="shrink-0 border-b bg-background px-8 py-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <DialogTitle className="text-3xl font-bold tracking-tight">
                Edit Inquiry
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm">
                Update inquiry details and assignments
              </DialogDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-xl px-3 py-1">
                {fields.port || "No Port"}
              </Badge>
              <Badge className="rounded-xl px-3 py-1">
                {fields.status || "Pending"}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto bg-muted/20">
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl space-y-6 p-8"
          >
            {/* Vessel Information */}
            <SectionCard
              title="Vessel Information"
              icon={<Ship className="h-5 w-5" />}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailField
                  icon={<Ship className="h-4 w-4" />}
                  label="Vessel Name"
                >
                  <Input
                    name="vessel_name"
                    value={fields.vessel_name || ""}
                    onChange={handleChange}
                    placeholder="Vessel Name"
                  />
                </DetailField>

                <DetailField icon={<MapPin className="h-4 w-4" />} label="Port">
                  <Input
                    name="port"
                    value={fields.port || ""}
                    onChange={handleChange}
                    placeholder="Port"
                  />
                </DetailField>

                <DetailField
                  icon={<Briefcase className="h-4 w-4" />}
                  label="Agent"
                >
                  <Input
                    name="agent"
                    value={fields.agent || ""}
                    onChange={handleChange}
                    placeholder="Agent"
                  />
                </DetailField>

                <DetailField
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="ETA"
                >
                  <DateTimePicker
                    date={parseDate(fields.eta)}
                    onDateChange={(date) =>
                      setFields((prev) => ({
                        ...prev,
                        eta: formatDateTime(date),
                      }))
                    }
                  />
                </DetailField>

                <DetailField
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Received Date"
                >
                  <DatePicker
                    date={parseDate(fields.received_date)}
                    onDateChange={(date) =>
                      setFields((prev) => ({
                        ...prev,
                        received_date: formatDate(date),
                      }))
                    }
                  />
                </DetailField>

                <DetailField
                  icon={<Clock className="h-4 w-4" />}
                  label="Received Time"
                >
                  <TimePicker
                    time={fields.received_time}
                    onTimeChange={(value) =>
                      setFields((prev) => ({
                        ...prev,
                        received_time: value || "",
                      }))
                    }
                  />
                </DetailField>

                <DetailField
                  icon={<Layers3 className="h-4 w-4" />}
                  label="Status"
                >
                  <select
                    name="status"
                    value={fields.status || "Pending"}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </DetailField>

                <DetailField
                  icon={<Layers3 className="h-4 w-4" />}
                  label="Categories"
                >
                  <CategorySelect
                    selectedCategories={fields.categories || []}
                    onChange={(selectedCategories) =>
                      setFields((prev) => ({
                        ...prev,
                        categories: selectedCategories,
                      }))
                    }
                  />
                </DetailField>
              </div>
            </SectionCard>

            {/* Customer Information */}
            <SectionCard
              title="Customer Information"
              icon={<User className="h-5 w-5" />}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailField
                  icon={<User className="h-4 w-4" />}
                  label="Customer"
                >
                  <Input
                    name="customer"
                    value={fields.customer || ""}
                    onChange={handleChange}
                    placeholder="Customer Name"
                  />
                </DetailField>

                <DetailField
                  icon={<Phone className="h-4 w-4" />}
                  label="Contact"
                >
                  <Input
                    name="customerContact"
                    value={fields.customerContact || ""}
                    onChange={handleChange}
                    placeholder="Customer Contact"
                  />
                </DetailField>

                <DetailField icon={<Mail className="h-4 w-4" />} label="Email">
                  <Input
                    name="customerEmail"
                    value={fields.customerEmail || ""}
                    onChange={handleChange}
                    placeholder="Customer Email"
                  />
                </DetailField>

                <DetailField
                  icon={<Briefcase className="h-4 w-4" />}
                  label="Commission Party"
                >
                  <Input
                    name="commissionParty"
                    value={fields.commissionParty || ""}
                    onChange={handleChange}
                    placeholder="Commission Party"
                  />
                </DetailField>
              </div>
            </SectionCard>

            {/* Assignment */}
            <SectionCard
              title="Assignment Details"
              icon={<Edit2 className="h-5 w-5" />}
            >
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Key PIC
                  </label>
                  <UserSelect
                    value={fields.key_pic_usr_id}
                    onValueChange={(userId, userName) =>
                      setFields((prev) => ({
                        ...prev,
                        key_pic_usr_id: userId,
                        key_pic: {
                          id: userId,
                          name: userName,
                        },
                      }))
                    }
                    placeholder="Select Key PIC"
                  />
                </div>

                <Separator />

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Sub PICs
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddSubPic}
                    >
                      + Add PIC
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(fields.other_pics || []).length === 0 ? (
                      <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No Sub PICs Added
                      </div>
                    ) : (
                      fields.other_pics?.map((pic, idx) => (
                        <div key={idx} className="flex items-center gap-3 pr-1">
                          <div className="flex-1">
                            <UserSelect
                              value={pic.id}
                              onValueChange={(userId, userName) => {
                                setFields((prev) => ({
                                  ...prev,
                                  other_pics: prev.other_pics?.map((p, i) =>
                                    i === idx
                                      ? { id: userId, name: userName }
                                      : p,
                                  ),
                                }));
                              }}
                              placeholder={`Sub PIC #${idx + 1}`}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-10 w-10 shrink-0"
                            onClick={() => handleRemoveSubPic(idx)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-11 px-8 rounded-xl sm:w-32"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" className="h-11 px-8 rounded-xl sm:w-48">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
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
    <div className="overflow-hidden rounded-3xl border bg-background shadow-sm">
      <div className="flex items-center gap-3 border-b px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
          {icon}
        </div>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function DetailField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-4">
      <div className="mb-3 flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

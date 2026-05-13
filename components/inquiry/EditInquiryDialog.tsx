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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
} from "lucide-react";

import type { Inquiry, InquiryCategory } from "@/types/inquiry.types";

const STATUS_OPTIONS = ["Pending", "Active", "Confirmed", "Rejected"];

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePicChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newPics = [...(fields.other_pics || [])];

    newPics[idx] = {
      ...newPics[idx],
      name: e.target.value,
    };

    setFields((prev) => ({
      ...prev,
      other_pics: newPics,
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

  const handleKeyPicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({
      ...prev,
      key_pic_usr_id: e.target.value,
    }));
  };

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      categories: e.target.value
        .split(/\s*,\s*/)
        .filter(Boolean)
        .map((name) => ({ name, id: "" }) as InquiryCategory),
    });
  };

  const categoriesText = (fields.categories || [])
    .map((c) => c.name)
    .join(", ");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave(fields);

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
                      forceMount
                    "
      >
        {/* HEADER */}
        <DialogHeader className="border-b bg-background px-8 py-6 shrink-0">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
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
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 p-8">
              {/* LEFT SIDE */}
              <div className="space-y-6">
                {/* Vessel Information */}
                <SectionCard
                  title="Vessel Information"
                  icon={<Ship className="h-5 w-5" />}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
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

                    <DetailField
                      icon={<MapPin className="h-4 w-4" />}
                      label="Port"
                    >
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
                      <Input
                        name="eta"
                        type="datetime-local"
                        value={fields.eta || ""}
                        onChange={handleChange}
                      />
                    </DetailField>

                    <DetailField
                      icon={<CalendarDays className="h-4 w-4" />}
                      label="Received Date"
                    >
                      <Input
                        name="received_date"
                        type="date"
                        value={fields.received_date || ""}
                        onChange={handleChange}
                      />
                    </DetailField>

                    <DetailField
                      icon={<Clock className="h-4 w-4" />}
                      label="Received Time"
                    >
                      <Input
                        name="received_time"
                        type="time"
                        value={fields.received_time || ""}
                        onChange={handleChange}
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
                        className="
                          flex h-10 w-full rounded-md border border-input
                          bg-background px-3 py-2 text-sm
                        "
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
                      <Input
                        name="categories"
                        value={categoriesText}
                        onChange={handleCategoriesChange}
                        placeholder="Bonded, Deck, Engine"
                      />
                    </DetailField>
                  </div>
                </SectionCard>

                {/* Customer Information */}
                <SectionCard
                  title="Customer Information"
                  icon={<User className="h-5 w-5" />}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <DetailField
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                    >
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
                    {/* Key PIC */}
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Key PIC User ID
                      </label>

                      <Input
                        className="mt-2"
                        name="key_pic_usr_id"
                        value={fields.key_pic_usr_id || ""}
                        onChange={handleKeyPicChange}
                        placeholder="Key PIC User ID"
                      />
                    </div>

                    <Separator />

                    {/* Sub PICs */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
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
                            <div key={idx} className="flex items-center gap-3">
                              <Input
                                value={pic.name || ""}
                                onChange={(e) => handlePicChange(idx, e)}
                                placeholder={`PIC Name #${idx + 1}`}
                              />

                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => handleRemoveSubPic(idx)}
                              >
                                ×
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>

              {/* RIGHT SIDE */}
              <div className="space-y-6">
                <SectionCard
                  title="Actions"
                  icon={<Edit2 className="h-5 w-5" />}
                >
                  <div className="space-y-3">
                    <Button type="submit" className="w-full h-11 rounded-xl">
                      Save Changes
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 rounded-xl"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </div>
                </SectionCard>
              </div>
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
    <div className="rounded-3xl border bg-background shadow-sm overflow-hidden">
      <div className="border-b px-6 py-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
          {icon}
        </div>

        <h3 className="font-semibold text-base">{title}</h3>
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
      <div className="flex items-center gap-2 text-muted-foreground mb-3">
        {icon}

        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>

      {children}
    </div>
  );
}

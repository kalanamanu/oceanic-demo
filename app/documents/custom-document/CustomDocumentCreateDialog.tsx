"use client";

import * as React from "react";
import { useEffect } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

import { Plus, Trash2, Loader2 } from "lucide-react";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useDocumentEngine } from "@/hooks/use-document-job";
// 🚀 Imported DocumentService to pull down the dynamic transaction metadata
import { DocumentService } from "@/services/document.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // 🚀 Prop injected to handle parent dashboard data refreshes
}

export function CustomDocumentCreateDialog({
  open,
  onClose,
  onSuccess,
}: Props) {
  const { runJob, saveDraft, loading } = useDocumentEngine();

  const { register, control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      reference_no: "", // 🚀 Holds tracking identifier returned from DocumentService
      title: "CUSTOM DOCUMENT",
      date: new Date(),
      dateLabel: "DATE :",
      telePhone: "",
      emailAddress: "",
      companyName: "",
      subtitle: "",
      sectionCode: "",
      vehicleNo: "",
      permitNo: "",
      gateNo: "",
      officeAddressLine1: "",
      officeAddressLine2: "",
      officeAddressLine3: "",
      directorOfCustoms: "",
      chiefSecurityOfficer: "",
      exportGate: "",
      slpa: "",
      permissionText: "",
      items: [
        {
          quantity: 1,
          unit: "",
          description: "",
          rate: 0,
          confirmOrderRate: "", // Added default value tracking string or rate code
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items") || [];

  const totalAmount = items.reduce(
    (sum: number, item: any) =>
      sum + Number(item.quantity || 0) * Number(item.rate || 0),
    0,
  );

  /* ================= FETCH REFERENCE NUMBER ================= */
  // 🚀 Fetches the dynamic transaction token from the database context when the sheet displays
  useEffect(() => {
    if (!open) {
      reset();
      return;
    }

    const fetchSequenceReference = async () => {
      try {
        const referenceData = await DocumentService.getReferenceNumber(
          "CUSTOMDOCUMENT" as any,
        );
        if (referenceData?.reference_no) {
          setValue("reference_no", referenceData.reference_no);
        }
      } catch (error) {
        console.error("Failed fetching custom document sequence:", error);
      }
    };

    fetchSequenceReference();
  }, [open, reset, setValue]);

  const buildPayload = (data: any) => ({
    document: "CUSTOMDOCUMENT",
    documentType: "pdf",
    documentData: {
      ...data,
      reference_no: data.reference_no, // 🚀 Explicitly mapped into payload object
      date:
        data.date instanceof Date
          ? data.date.toLocaleDateString("en-GB")
          : data.date,
      items: data.items.map((item: any) => ({
        quantity: Number(item.quantity),
        unit: item.unit,
        description: item.description,
        rate: Number(item.rate),
        total: Number(item.quantity) * Number(item.rate),
        confirmOrderRate: item.confirmOrderRate || "", // 🚀 Clean transmission to processing queue
      })),
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await runJob(buildPayload(data), "Custom Document");
      toast.success("Custom document generated!");
      if (onSuccess) onSuccess(); // 🚀 Triggers parent to fetch latest records
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate document");
    }
  };

  const onSaveDraft = async () => {
    try {
      const data = watch();
      await saveDraft(buildPayload(data));
      toast.success("Draft saved");
      if (onSuccess) onSuccess(); // 🚀 Refreshes parent overview grid to catch newly generated items
    } catch (err) {
      console.error(err);
      toast.error("Failed to save draft");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl lg:max-w-[95vw] max-h-[92vh] overflow-y-auto p-6">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-bold">
            Create Custom Document
          </DialogTitle>
          <DialogDescription className="text-sm mt-1">
            Fill in the required information below to generate a new custom
            manifest or authority letter.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* ================= SECTION: COMPANY INFO ================= */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Company Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="companyName" className="text-xs font-medium">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  placeholder="Corporate Entity Name"
                  {...register("companyName")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="telePhone" className="text-xs font-medium">
                  Telephone Number
                </Label>
                <Input
                  id="telePhone"
                  placeholder="e.g. +94 11 2345678"
                  {...register("telePhone")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emailAddress" className="text-xs font-medium">
                  Email Address
                </Label>
                <Input
                  id="emailAddress"
                  type="email"
                  placeholder="billing@company.com"
                  {...register("emailAddress")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label
                  htmlFor="officeAddressLine1"
                  className="text-xs font-medium"
                >
                  Office Address Line 1
                </Label>
                <Input
                  id="officeAddressLine1"
                  placeholder="Street Address, PO Box"
                  {...register("officeAddressLine1")}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="officeAddressLine2"
                  className="text-xs font-medium"
                >
                  Office Address Line 2
                </Label>
                <Input
                  id="officeAddressLine2"
                  placeholder="Locality, City"
                  {...register("officeAddressLine2")}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="officeAddressLine3"
                  className="text-xs font-medium"
                >
                  Office Address Line 3
                </Label>
                <Input
                  id="officeAddressLine3"
                  placeholder="Province, Country"
                  {...register("officeAddressLine3")}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* ================= SECTION: DOCUMENT INFO ================= */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Document Meta Data
            </h3>
            {/* 🚀 Changed grid settings to grid-cols-5 to accommodate the reference field layout gracefully */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {/* 🚀 Reference Number field connected to react-hook-form bindings */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="reference_no"
                  className="text-xs font-medium text-primary"
                >
                  Reference No
                </Label>
                <Input
                  id="reference_no"
                  placeholder="Fetching ref..."
                  {...register("reference_no")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-medium">
                  Document Title
                </Label>
                <Input
                  id="title"
                  placeholder="CUSTOM DOCUMENT"
                  {...register("title")}
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <Label className="text-xs font-medium mb-1.5">
                  Filing Date
                </Label>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <DatePicker
                      date={field.value}
                      onDateChange={(d) => field.onChange(d)}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subtitle" className="text-xs font-medium">
                  Subtitle Header
                </Label>
                <Input
                  id="subtitle"
                  placeholder="Sub-heading info"
                  {...register("subtitle")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sectionCode" className="text-xs font-medium">
                  Section Code
                </Label>
                <Input
                  id="sectionCode"
                  placeholder="e.g. SEC-A"
                  {...register("sectionCode")}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* ================= SECTION: PERMIT & PORT DETAILS ================= */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Permit & Port Logistics Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="directorOfCustoms"
                  className="text-xs font-medium"
                >
                  Director of Customs
                </Label>
                <Input
                  id="directorOfCustoms"
                  placeholder="Attn: Director Name"
                  {...register("directorOfCustoms")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vehicleNo" className="text-xs font-medium">
                  Vehicle Number
                </Label>
                <Input
                  id="vehicleNo"
                  placeholder="WP CAS-4432"
                  {...register("vehicleNo")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="permitNo" className="text-xs font-medium">
                  Permit Number
                </Label>
                <Input
                  id="permitNo"
                  placeholder="Permit Registry ID"
                  {...register("permitNo")}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="chiefSecurityOfficer"
                  className="text-xs font-medium"
                >
                  Chief Security Officer
                </Label>
                <Input
                  id="chiefSecurityOfficer"
                  placeholder="Security Head Attn."
                  {...register("chiefSecurityOfficer")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exportGate" className="text-xs font-medium">
                  Export Gate Terminal
                </Label>
                <Input
                  id="exportGate"
                  placeholder="SAGT / JCT"
                  {...register("exportGate")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slpa" className="text-xs font-medium">
                  SLPA Reference No
                </Label>
                <Input
                  id="slpa"
                  placeholder="Authority Ref Details"
                  {...register("slpa")}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2 md:col-span-1">
                <Label htmlFor="gateNo" className="text-xs font-medium">
                  Gate Number
                </Label>
                <Input
                  id="gateNo"
                  placeholder="Gate ID / Code"
                  {...register("gateNo")}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* ================= SECTION: PERMISSION TEXT ================= */}
          <div className="space-y-1.5">
            <Label
              htmlFor="permissionText"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
            >
              Permission / Authorization Clause Statement
            </Label>
            <Textarea
              id="permissionText"
              rows={3}
              placeholder="Provide full legal text declaration here..."
              {...register("permissionText")}
            />
          </div>

          <Separator />

          {/* ================= SECTION: LINE ITEMS ================= */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Document Line Items
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs gap-1.5 font-medium"
                onClick={() =>
                  append({
                    quantity: 1,
                    unit: "",
                    description: "",
                    rate: 0,
                    confirmOrderRate: "",
                  })
                }
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </Button>
            </div>

            {fields.length > 0 && (
              <div className="hidden sm:grid grid-cols-12 gap-3 px-2 text-xs font-medium text-muted-foreground">
                <div className="col-span-1">Quantity</div>
                <div className="col-span-1">Unit</div>
                <div className="col-span-4">Description</div>
                <div className="col-span-2">Rate</div>
                <div className="col-span-2">Confirm Order Rate</div>
                <div className="col-span-1.5 text-right pr-4">Total</div>
                <div className="col-span-0.5"></div>
              </div>
            )}

            <div className="space-y-2">
              {fields.map((field, index) => {
                const qty = watch(`items.${index}.quantity`) || 0;
                const rate = watch(`items.${index}.rate`) || 0;
                const total = qty * rate;

                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-muted/10 p-3 sm:p-0 rounded-xl border sm:border-none"
                  >
                    <div className="col-span-1 space-y-1 sm:space-y-0">
                      <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground sm:hidden">
                        Qty
                      </Label>
                      <Input
                        type="number"
                        {...register(`items.${index}.quantity`)}
                      />
                    </div>

                    <div className="col-span-1 space-y-1 sm:space-y-0">
                      <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground sm:hidden">
                        Unit
                      </Label>
                      <Input
                        placeholder="PCS"
                        {...register(`items.${index}.unit`)}
                      />
                    </div>

                    <div className="col-span-4 space-y-1 sm:space-y-0">
                      <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground sm:hidden">
                        Description
                      </Label>
                      <Input
                        placeholder="Item Cargo Particulars"
                        {...register(`items.${index}.description`)}
                      />
                    </div>

                    <div className="col-span-2 space-y-1 sm:space-y-0">
                      <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground sm:hidden">
                        Rate
                      </Label>
                      <Input
                        type="number"
                        step="any"
                        {...register(`items.${index}.rate`)}
                      />
                    </div>

                    {/* Dynamic Entry field mapped for Confirm Order Rate context */}
                    <div className="col-span-2 space-y-1 sm:space-y-0">
                      <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground sm:hidden">
                        Confirm Order Rate
                      </Label>
                      <Input
                        placeholder="Confirm Order Rate"
                        {...register(`items.${index}.confirmOrderRate`)}
                      />
                    </div>

                    <div className="col-span-1.5 text-left sm:text-right font-semibold text-sm sm:pr-2">
                      <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground sm:hidden block mb-1">
                        Total
                      </Label>
                      <span className="inline-block sm:pt-0">
                        {total.toFixed(2)}
                      </span>
                    </div>

                    <div className="col-span-0.5 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* ================= FOOTER ACTIONS ================= */}
          <DialogFooter className="border-t pt-4 gap-5 sm:gap-0">
            <Button type="button" variant="outline" onClick={onSaveDraft}>
              Save Draft
            </Button>

            <Button type="submit" disabled={loading} className="px-5">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

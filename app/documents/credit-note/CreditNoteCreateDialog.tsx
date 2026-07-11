"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Loader2,
  Building,
  User,
  FileText,
  Ship,
  DollarSign,
  CheckCircle2,
} from "lucide-react";

import { DocumentService } from "@/services/document.service";
import { useDocumentEngine } from "@/hooks/use-document-job";

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

type CreditItem = {
  description: string;
  quantity: number;
  unit_price: number;
};

type FormValues = {
  companyName: string;
  companyAddressLine1: string;
  companyAddressLine2: string;
  companyPostal: string;
  companyContact: string;
  companyBR: string;
  companyLicense: string;
  logoUrl: string;
  billToName: string;
  billToDetails: string;
  crnNo: string;
  date: string;
  vesselName: string;
  grt: string;
  port: string;
  imo: string;
  nameOfAgent: string;
  portCountry: string;
  items: CreditItem[];
  approvedBy: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreditNoteCreateDialog({ open, onClose }: Props) {
  const { runJob, loading, saveDraft } = useDocumentEngine();
  const [fetchingRef, setFetchingRef] = useState(false);

  const { register, control, handleSubmit, setValue, watch, reset } =
    useForm<FormValues>({
      defaultValues: {
        items: [{ description: "", quantity: 1, unit_price: 0 }],
        date: new Date().toISOString().split("T")[0],
        companyName: "",
        companyAddressLine1: "",
        companyAddressLine2: "",
        companyPostal: "",
        companyContact: "",
        companyBR: "",
        companyLicense: "",
        logoUrl: "",
        billToName: "",
        billToDetails: "",
        crnNo: "",
        vesselName: "",
        grt: "",
        port: "",
        imo: "",
        nameOfAgent: "",
        portCountry: "",
        approvedBy: "",
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items") || [];

  /* ================= FETCH REFERENCE NUMBER & RESET ================= */
  useEffect(() => {
    if (!open) {
      reset();
      return;
    }

    const fetchSequenceReference = async () => {
      try {
        setFetchingRef(true);
        // Requesting standard CRN / CREDITNOTE reference token sequence
        const referenceData = await DocumentService.getReferenceNumber(
          "CREDITNOTE" as any,
        );
        if (referenceData?.reference_no) {
          setValue("crnNo", referenceData.reference_no);
        }
      } catch (error) {
        console.error("Failed fetching credit note reference sequence:", error);
        toast.error(
          "Could not automatically retrieve next Credit Note reference number",
        );
      } finally {
        setFetchingRef(false);
      }
    };

    fetchSequenceReference();
  }, [open, reset, setValue]);

  /* ================= TOTAL COMPUTATION ================= */
  const totalAmount = items.reduce(
    (sum: number, item: any) =>
      sum + (Number(item?.quantity) * Number(item?.unit_price) || 0),
    0,
  );

  /* ================= PAYLOAD BUILDER ================= */
  const buildPayload = (data: FormValues) => ({
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
      billToName: data.billToName,
      billToDetails: data.billToDetails,
      crnNo: data.crnNo,
      date: data.date,
      vesselName: data.vesselName,
      grt: data.grt,
      port: data.port,
      imo: data.imo,
      nameOfAgent: data.nameOfAgent,
      portCountry: data.portCountry,
      items: data.items.map((i) => ({
        description: i.description,
        quantity: Number(i.quantity),
        unit_price: Number(i.unit_price),
        amount: Number(i.quantity) * Number(i.unit_price),
      })),
      totalAmount,
      approvedBy: data.approvedBy,
    },
  });

  /* ================= ACTIONS ================= */
  const onSubmit = async (data: FormValues) => {
    try {
      await runJob(buildPayload(data), "Credit Note");
      toast.success("Credit Note generated successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate credit note");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[1200px] max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 border-b shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <DialogTitle className="text-xl font-bold">
              Create Credit Note
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm mt-1">
            Specify reimbursement item positions, adjust core company context
            details, and process ledger credits.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Scrollable Viewport Frame */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* ================= SECTION: COMPANY DETAILS ================= */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Building className="h-4 w-4 text-primary" />
                <h3>Issuer Company Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName" className="text-xs font-medium">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    {...register("companyName")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="logoUrl" className="text-xs font-medium">
                    Logo URL
                  </Label>
                  <Input
                    id="logoUrl"
                    placeholder="https://example.com/logo.png"
                    {...register("logoUrl")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 space-y-1.5">
                  <Label
                    htmlFor="companyAddressLine1"
                    className="text-xs font-medium"
                  >
                    Address Line 1
                  </Label>
                  <Input
                    id="companyAddressLine1"
                    placeholder="Street address, P.O. box"
                    {...register("companyAddressLine1")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="companyPostal"
                    className="text-xs font-medium"
                  >
                    Postal Code
                  </Label>
                  <Input
                    id="companyPostal"
                    placeholder="e.g. 00100"
                    {...register("companyPostal")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="companyAddressLine2"
                    className="text-xs font-medium"
                  >
                    Address Line 2 (Optional)
                  </Label>
                  <Input
                    id="companyAddressLine2"
                    placeholder="Apartment, suite, unit, building, floor"
                    {...register("companyAddressLine2")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="companyContact"
                    className="text-xs font-medium"
                  >
                    Contact Number
                  </Label>
                  <Input
                    id="companyContact"
                    placeholder="e.g. +94 11 234 5678"
                    {...register("companyContact")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyBR" className="text-xs font-medium">
                    Business Registration No
                  </Label>
                  <Input
                    id="companyBR"
                    placeholder="Enter business registration number"
                    {...register("companyBR")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="companyLicense"
                    className="text-xs font-medium"
                  >
                    License No
                  </Label>
                  <Input
                    id="companyLicense"
                    placeholder="Enter operating license number"
                    {...register("companyLicense")}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* ================= SECTION: CLIENT & DOCUMENT METADATA ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* BILL TO */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <User className="h-4 w-4 text-primary" />
                  <h3>Bill To (Customer)</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="billToName" className="text-xs font-medium">
                      Customer / Owner Name
                    </Label>
                    <Input
                      id="billToName"
                      placeholder="Enter client company entity name"
                      {...register("billToName")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="billToDetails"
                      className="text-xs font-medium"
                    >
                      Billing Address Details
                    </Label>
                    <Textarea
                      id="billToDetails"
                      placeholder="Enter complete address / contact ledger profiles"
                      rows={3}
                      {...register("billToDetails")}
                    />
                  </div>
                </div>
              </div>

              {/* DOCUMENT INFO */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3>Document Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="crnNo"
                      className="text-xs font-medium text-primary"
                    >
                      Credit Note Reference No
                    </Label>
                    <Input
                      id="crnNo"
                      placeholder={
                        fetchingRef
                          ? "Syncing sequence ref..."
                          : "e.g. CRN-2026-0001"
                      }
                      disabled={fetchingRef}
                      {...register("crnNo")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="date" className="text-xs font-medium">
                      Issue Date
                    </Label>
                    <Input id="date" type="date" {...register("date")} />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* ================= SECTION: VESSEL INFO ================= */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Ship className="h-4 w-4 text-primary" />
                <h3>Vessel Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="vesselName" className="text-xs font-medium">
                    Vessel Name
                  </Label>
                  <Input
                    id="vesselName"
                    placeholder="e.g. Ocean Trader"
                    {...register("vesselName")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="imo" className="text-xs font-medium">
                    IMO Number
                  </Label>
                  <Input
                    id="imo"
                    placeholder="e.g. IMO 9123456"
                    {...register("imo")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="grt" className="text-xs font-medium">
                    GRT (Gross Tonnage)
                  </Label>
                  <Input
                    id="grt"
                    placeholder="e.g. 45,000"
                    {...register("grt")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="port" className="text-xs font-medium">
                    Port / Service Location
                  </Label>
                  <Input
                    id="port"
                    placeholder="e.g. Port of Colombo"
                    {...register("port")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="portCountry" className="text-xs font-medium">
                    Port Country
                  </Label>
                  <Input
                    id="portCountry"
                    placeholder="e.g. Sri Lanka"
                    {...register("portCountry")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="nameOfAgent" className="text-xs font-medium">
                    Agent Name
                  </Label>
                  <Input
                    id="nameOfAgent"
                    placeholder="Enter maritime agent name"
                    {...register("nameOfAgent")}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* ================= SECTION: SERVICE ITEMS ================= */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <h3>Service Line Entries</h3>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-medium gap-1.5"
                  onClick={() =>
                    append({
                      description: "",
                      quantity: 1,
                      unit_price: 0,
                    })
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Line Item
                </Button>
              </div>

              <div className="space-y-3 bg-muted/10 p-4 rounded-xl border">
                {/* Desktop layout header row */}
                {fields.length > 0 && (
                  <div className="hidden md:grid grid-cols-12 gap-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="col-span-6">Service Description</div>
                    <div className="col-span-2">Qty</div>
                    <div className="col-span-3">Unit Price</div>
                    <div className="col-span-1"></div>
                  </div>
                )}

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-background md:bg-transparent p-3 md:p-0 rounded-lg border md:border-none shadow-sm md:shadow-none"
                  >
                    <div className="md:col-span-6 space-y-1 md:space-y-0">
                      <Label className="block md:hidden text-[10px] font-semibold text-muted-foreground uppercase">
                        Description
                      </Label>
                      <Input
                        placeholder="Service / Item Adjustment Description"
                        {...register(`items.${index}.description` as const)}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1 md:space-y-0">
                      <Label className="block md:hidden text-[10px] font-semibold text-muted-foreground uppercase">
                        Qty
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Qty"
                        {...register(`items.${index}.quantity` as const)}
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1 md:space-y-0">
                      <Label className="block md:hidden text-[10px] font-semibold text-muted-foreground uppercase">
                        Unit Price
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Unit Price"
                        {...register(`items.${index}.unit_price` as const)}
                      />
                    </div>

                    <div className="md:col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Live Total Readout row */}
                <div className="flex justify-end pt-3 border-t mt-4">
                  <div className="bg-muted px-4 py-2 rounded-lg font-semibold text-xs tracking-wider flex items-center gap-2">
                    TOTAL ADJUSTMENT BALANCE:
                    <span className="font-mono text-sm text-primary font-bold">
                      LKR{" "}
                      {totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* ================= SECTION: APPROVAL CRITERIA ================= */}
            <div className="space-y-4 max-w-md">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <h3>Authorization Profile</h3>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="approvedBy" className="text-xs font-medium">
                  Approval Authority
                </Label>
                <Input
                  id="approvedBy"
                  placeholder="Approved By (e.g. Finance Director / Manager)"
                  {...register("approvedBy")}
                />
              </div>
            </div>
          </div>

          {/* ================= FIXED VIEWPORT FOOTER ================= */}
          <DialogFooter className="p-6 border-t bg-background shrink-0 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading || fetchingRef}
                className="px-5"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Credit Note
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

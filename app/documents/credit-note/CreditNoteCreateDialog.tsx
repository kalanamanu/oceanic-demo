"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Plus,
  Trash2,
  Building,
  User,
  FileText,
  Ship,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

import { DocumentService } from "@/services/document.service";
import { useDocumentEngine } from "@/hooks/use-document-job";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreditNoteCreateDialog({ open, onClose }: Props) {
  const { runJob, loading, saveDraft } = useDocumentEngine();

  const { register, control, handleSubmit, setValue, watch, reset } =
    useForm<any>({
      defaultValues: {
        items: [{ description: "", quantity: 1, unit_price: 0 }],
        date: new Date().toISOString().split("T")[0],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items") || [];

  /* ================= RESET ================= */
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  /* ================= TOTAL ================= */
  const totalAmount = items.reduce(
    (sum: number, i: any) =>
      sum + (Number(i?.quantity) * Number(i?.unit_price) || 0),
    0,
  );

  /* ================= PAYLOAD ================= */
  const buildPayload = (data: any) => ({
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

      items: data.items.map((i: any) => ({
        description: i.description,
        quantity: Number(i.quantity),
        unit_price: Number(i.unit_price),
        amount: Number(i.quantity) * Number(i.unit_price),
      })),

      totalAmount,

      approvedBy: data.approvedBy,
    },
  });

  /* ================= SUBMIT ================= */
  const onSubmit = async (data: any) => {
    try {
      await runJob(buildPayload(data), "Credit Note");
      toast.success("Credit Note generated");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl p-6 sm:p-8">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Create Credit Note
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-4">
          {/* ================= COMPANY DETAILS ================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              <Building className="h-4 w-4" />
              <h3>Company Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  {...register("companyName")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  placeholder="https://example.com/logo.png"
                  {...register("logoUrl")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="companyAddressLine1">Address Line 1</Label>
                <Input
                  id="companyAddressLine1"
                  placeholder="Street address, P.O. box"
                  {...register("companyAddressLine1")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="companyPostal">Postal Code</Label>
                <Input
                  id="companyPostal"
                  placeholder="e.g. 00100"
                  {...register("companyPostal")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="companyAddressLine2">
                  Address Line 2 (Optional)
                </Label>
                <Input
                  id="companyAddressLine2"
                  placeholder="Apartment, suite, unit, building, floor"
                  {...register("companyAddressLine2")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="companyContact">Contact Number</Label>
                <Input
                  id="companyContact"
                  placeholder="e.g. +94 11 234 5678"
                  {...register("companyContact")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="companyBR">Business Registration No</Label>
                <Input
                  id="companyBR"
                  placeholder="Enter business registration number"
                  {...register("companyBR")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="companyLicense">License No</Label>
                <Input
                  id="companyLicense"
                  placeholder="Enter operating license number"
                  {...register("companyLicense")}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* ================= BILL TO & DOC INFO (SIDE BY SIDE) ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* BILL TO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                <User className="h-4 w-4" />
                <h3>Bill To (Customer)</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="billToName">Customer / Owner Name</Label>
                  <Input
                    id="billToName"
                    placeholder="Enter customer or client company name"
                    {...register("billToName")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="billToDetails">Billing Address Details</Label>
                  <Textarea
                    id="billToDetails"
                    placeholder="Enter complete address / contact information"
                    rows={3}
                    {...register("billToDetails")}
                  />
                </div>
              </div>
            </div>

            {/* DOCUMENT INFO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                <FileText className="h-4 w-4" />
                <h3>Document Information</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="crnNo">Credit Note Reference No</Label>
                  <Input
                    id="crnNo"
                    placeholder="e.g. CRN-2026-0001"
                    {...register("crnNo")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date">Issue Date</Label>
                  <Input id="date" type="date" {...register("date")} />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* ================= VESSEL INFO ================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              <Ship className="h-4 w-4" />
              <h3>Vessel Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="vesselName">Vessel Name</Label>
                <Input
                  id="vesselName"
                  placeholder="e.g. Ocean Trader"
                  {...register("vesselName")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="imo">IMO Number</Label>
                <Input
                  id="imo"
                  placeholder="e.g. IMO 9123456"
                  {...register("imo")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="grt">GRT (Gross Tonnage)</Label>
                <Input
                  id="grt"
                  placeholder="e.g. 45,000"
                  {...register("grt")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="port">Port / Service Location</Label>
                <Input
                  id="port"
                  placeholder="e.g. Port of Colombo"
                  {...register("port")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="portCountry">Port Country</Label>
                <Input
                  id="portCountry"
                  placeholder="e.g. Sri Lanka"
                  {...register("portCountry")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nameOfAgent">Agent Name</Label>
                <Input
                  id="nameOfAgent"
                  placeholder="Enter maritime agent name"
                  {...register("nameOfAgent")}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* ================= ITEMS ================= */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <h3>Service Items</h3>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    description: "",
                    quantity: 1,
                    unit_price: 0,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
              {/* Header row for items table desktop layout */}
              {fields.length > 0 && (
                <div className="hidden md:grid grid-cols-12 gap-3 px-2 text-xs font-semibold uppercase text-muted-foreground">
                  <div className="col-span-6">Service Description</div>
                  <div className="col-span-2">Qty</div>
                  <div className="col-span-3">Unit Price</div>
                  <div className="col-span-1"></div>
                </div>
              )}

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-background md:bg-transparent p-3 md:p-0 rounded-md border md:border-0 shadow-sm md:shadow-none"
                >
                  <div className="md:col-span-6 space-y-1 md:space-y-0">
                    <Label className="block md:hidden text-xs text-muted-foreground">
                      Description
                    </Label>
                    <Input
                      placeholder="Service / Item Description"
                      {...register(`items.${index}.description`)}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1 md:space-y-0">
                    <Label className="block md:hidden text-xs text-muted-foreground">
                      Qty
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Qty"
                      {...register(`items.${index}.quantity`)}
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1 md:space-y-0">
                    <Label className="block md:hidden text-xs text-muted-foreground">
                      Unit Price
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Unit Price"
                      {...register(`items.${index}.unit_price`)}
                    />
                  </div>

                  <div className="md:col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-2 border-t mt-4">
                <div className="bg-muted px-4 py-2 rounded-md font-semibold text-sm tracking-wide">
                  Total Amount:{" "}
                  <span className="font-mono text-base ml-1">
                    LKR {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* ================= APPROVAL & ACTIONS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="approvedBy">Approval Authority</Label>
              <Input
                id="approvedBy"
                placeholder="Approved By (Finance / Manager)"
                {...register("approvedBy")}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" className="px-5">
                Save Draft
              </Button>
              <Button type="submit" disabled={loading} className="px-5">
                {loading ? "Generating..." : "Generate Credit Note"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

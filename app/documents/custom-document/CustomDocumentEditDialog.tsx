"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useDocumentEngine } from "@/hooks/use-document-job";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
  onSuccess?: () => void;
}

export default function CustomDocumentEditDialog({
  open,
  onOpenChange,
  document,
}: Props) {
  const { loading, runJob } = useDocumentEngine();

  /* ================= FORM ================= */
  const { register, control, handleSubmit, reset, watch } = useForm<any>({
    defaultValues: {
      title: "",
      date: "",
      telePhone: "",
      emailAddress: "",
      officeAddressLine1: "",
      officeAddressLine2: "",
      officeAddressLine3: "",
      directorOfCustoms: "",
      vehicleNo: "",
      permitNo: "",
      chiefSecurityOfficer: "",
      exportGate: "",
      slpa: "",
      gateNo: "",
      permissionText: "",
      companyName: "",
      subtitle: "",
      sectionCode: "",
      dateLabel: "",
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items") || [];

  /* ================= LOAD DATA ================= */
  React.useEffect(() => {
    if (open && document) {
      const data = (document as any)?.documentData || {};

      reset({
        ...data,
        items:
          data.items?.length > 0
            ? data.items
            : [
                {
                  quantity: 1,
                  unit: "",
                  description: "",
                  rate: 0,
                  total: 0,
                },
              ],
      });
    }
  }, [open, document, reset]);

  /* ================= TOTAL ================= */
  const totalAmount = items.reduce(
    (sum: number, i: any) =>
      sum + Number(i.quantity || 0) * Number(i.rate || 0),
    0,
  );

  /* ================= PAYLOAD ================= */
  const buildPayload = (data: any) => ({
    document: "CUSTOMDOCUMENT",
    documentType: "pdf",
    documentData: {
      ...data,
      items: data.items.map((i: any) => ({
        quantity: Number(i.quantity),
        unit: i.unit,
        description: i.description,
        rate: Number(i.rate),
        total: Number(i.quantity) * Number(i.rate),
        confirmOrderRate: i.confirmOrderRate || "",
      })),
    },
  });

  /* ================= SUBMIT ================= */
  const onSubmit = async (data: any) => {
    try {
      await runJob(buildPayload(data), "Custom Document");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl p-6">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-bold">
            Edit Custom Document
          </DialogTitle>
          <DialogDescription className="text-sm mt-1">
            Modify custom document fields and items.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* ================= SECTION: HEADER DETAILS ================= */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Header Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-medium">
                  Document Title
                </Label>
                <Input
                  id="title"
                  placeholder="Document Title"
                  {...register("title")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs font-medium">
                  Document Date
                </Label>
                <Input id="date" type="date" {...register("date")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="companyName" className="text-xs font-medium">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  placeholder="Company Name"
                  {...register("companyName")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subtitle" className="text-xs font-medium">
                  Subtitle
                </Label>
                <Input
                  id="subtitle"
                  placeholder="Document Subtitle"
                  {...register("subtitle")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="telePhone" className="text-xs font-medium">
                  Telephone
                </Label>
                <Input
                  id="telePhone"
                  placeholder="Telephone No"
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
                  placeholder="Email Address"
                  {...register("emailAddress")}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* ================= SECTION: OFFICE ADDRESS ================= */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Office Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="officeAddressLine1"
                  className="text-xs font-medium"
                >
                  Address Line 1
                </Label>
                <Input
                  id="officeAddressLine1"
                  placeholder="Street Address / P.O. Box"
                  {...register("officeAddressLine1")}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="officeAddressLine2"
                  className="text-xs font-medium"
                >
                  Address Line 2
                </Label>
                <Input
                  id="officeAddressLine2"
                  placeholder="Suite / Apartment / City"
                  {...register("officeAddressLine2")}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="officeAddressLine3"
                  className="text-xs font-medium"
                >
                  Address Line 3
                </Label>
                <Input
                  id="officeAddressLine3"
                  placeholder="State / Province / Country"
                  {...register("officeAddressLine3")}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* ================= SECTION: CLEARANCE DETAILS ================= */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Clearance & Logistics Details
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
                  placeholder="Director Name"
                  {...register("directorOfCustoms")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vehicleNo" className="text-xs font-medium">
                  Vehicle Number
                </Label>
                <Input
                  id="vehicleNo"
                  placeholder="Vehicle No"
                  {...register("vehicleNo")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="permitNo" className="text-xs font-medium">
                  Permit Number
                </Label>
                <Input
                  id="permitNo"
                  placeholder="Permit No"
                  {...register("permitNo")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gateNo" className="text-xs font-medium">
                  Gate Number
                </Label>
                <Input
                  id="gateNo"
                  placeholder="Gate No"
                  {...register("gateNo")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slpa" className="text-xs font-medium">
                  SLPA Ref
                </Label>
                <Input
                  id="slpa"
                  placeholder="SLPA Details"
                  {...register("slpa")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exportGate" className="text-xs font-medium">
                  Export Gate
                </Label>
                <Input
                  id="exportGate"
                  placeholder="Export Gate Terminal"
                  {...register("exportGate")}
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="permissionText" className="text-xs font-medium">
                Permission Statement / Terms
              </Label>
              <Textarea
                id="permissionText"
                rows={3}
                placeholder="Type full validation or authorization text here..."
                {...register("permissionText")}
              />
            </div>
          </div>

          <Separator />

          {/* ================= SECTION: ITEMS TABLE ================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Document Line Items
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 font-medium text-xs gap-1.5"
                onClick={() =>
                  append({
                    quantity: 1,
                    unit: "",
                    description: "",
                    rate: 0,
                  })
                }
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </Button>
            </div>

            {/* Simulated Dynamic Header Layout */}
            {fields.length > 0 && (
              <div className="hidden sm:grid grid-cols-12 gap-3 px-2 text-xs font-medium text-muted-foreground">
                <div className="col-span-2">Qty</div>
                <div className="col-span-2">Unit</div>
                <div className="col-span-4">Description</div>
                <div className="col-span-2">Rate</div>
                <div className="col-span-1.5 text-right pr-4">Total</div>
                <div className="col-span-0.5"></div>
              </div>
            )}

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-muted/20 p-2 sm:p-0 rounded-lg border sm:border-none"
                >
                  <div className="col-span-2 space-y-1 sm:space-y-0">
                    <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground sm:hidden">
                      Qty
                    </Label>
                    <Input
                      type="number"
                      {...register(`items.${index}.quantity`)}
                    />
                  </div>

                  <div className="col-span-2 space-y-1 sm:space-y-0">
                    <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground sm:hidden">
                      Unit
                    </Label>
                    <Input
                      placeholder="PCS / KG"
                      {...register(`items.${index}.unit`)}
                    />
                  </div>

                  <div className="col-span-4 space-y-1 sm:space-y-0">
                    <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground sm:hidden">
                      Description
                    </Label>
                    <Input
                      placeholder="Item Details"
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

                  <div className="col-span-1.5 space-y-1 sm:space-y-0 text-left sm:text-right font-medium text-sm sm:pr-2">
                    <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground sm:hidden block">
                      Total
                    </Label>
                    <span className="inline-block pt-2 sm:pt-0">
                      {(
                        Number(items[index]?.quantity || 0) *
                        Number(items[index]?.rate || 0)
                      ).toFixed(2)}
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
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="bg-muted/40 border rounded-xl p-4 flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-muted-foreground">
                Total Summary Value:
              </span>
              <span className="text-base font-bold text-foreground">
                LKR {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <Separator />

          {/* ================= ACTIONS ================= */}
          <DialogFooter className="border-t pt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading} className="px-5">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save & Generate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

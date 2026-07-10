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

import { Loader2, FileText, Plus, Trash2 } from "lucide-react";

import { useDocumentEngine } from "@/hooks/use-document-job";
import { SavedDocument } from "@/types/document.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
  onSuccess?: () => void; // ✅ ADD THIS
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
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Edit Custom Document</DialogTitle>
          <DialogDescription>
            Modify custom document fields and items.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ================= HEADER ================= */}
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Title" {...register("title")} />
            <Input type="date" {...register("date")} />
            <Input placeholder="Telephone" {...register("telePhone")} />
            <Input placeholder="Email" {...register("emailAddress")} />
            <Input placeholder="Company Name" {...register("companyName")} />
            <Input placeholder="Subtitle" {...register("subtitle")} />
          </div>

          <Separator />

          {/* ================= ADDRESS ================= */}
          <div className="space-y-3">
            <Label>Office Address</Label>
            <Input placeholder="Line 1" {...register("officeAddressLine1")} />
            <Input placeholder="Line 2" {...register("officeAddressLine2")} />
            <Input placeholder="Line 3" {...register("officeAddressLine3")} />
          </div>

          <Separator />

          {/* ================= DETAILS ================= */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Director of Customs"
              {...register("directorOfCustoms")}
            />
            <Input placeholder="Vehicle No" {...register("vehicleNo")} />
            <Input placeholder="Permit No" {...register("permitNo")} />
            <Input placeholder="Gate No" {...register("gateNo")} />
            <Input placeholder="SLPA" {...register("slpa")} />
            <Input placeholder="Export Gate" {...register("exportGate")} />
          </div>

          <Textarea
            placeholder="Permission Text"
            {...register("permissionText")}
          />

          <Separator />

          {/* ================= ITEMS ================= */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">Items</h3>
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  append({
                    quantity: 1,
                    unit: "",
                    description: "",
                    rate: 0,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-6 gap-2">
                <Input type="number" {...register(`items.${index}.quantity`)} />
                <Input
                  placeholder="Unit"
                  {...register(`items.${index}.unit`)}
                />
                <Input
                  placeholder="Description"
                  {...register(`items.${index}.description`)}
                />
                <Input type="number" {...register(`items.${index}.rate`)} />

                <Input
                  value={
                    Number(items[index]?.quantity || 0) *
                    Number(items[index]?.rate || 0)
                  }
                  readOnly
                />

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}

            <div className="text-right font-semibold">
              Total: LKR {totalAmount.toFixed(2)}
            </div>
          </div>

          <Separator />

          {/* ================= ACTIONS ================= */}
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save & Generate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

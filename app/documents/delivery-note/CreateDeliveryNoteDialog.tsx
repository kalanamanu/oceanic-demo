"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Loader2,
  FileSpreadsheet,
  Calendar,
  User,
  MapPin,
} from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";

import { useDocumentEngine } from "@/hooks/use-document-job";
import { DocumentService } from "@/services/document.service";

type Item = {
  description: string;
  remarks: string;
  unit: string;
  quantity: number;
};

type FormValues = {
  referenceNumber: string;
  date: Date | null;
  supplyDate: Date | null;
  billToName: string;
  billToAddress: string;
  poNumber: string;
  items: Item[];
};

interface Props {
  open: boolean;
  onClose: () => void;
  confirmedItems?: any[];
}

export const CreateDeliveryNoteDialog = ({
  open,
  onClose,
  confirmedItems,
}: Props) => {
  const { runJob, loading, saveDraft } = useDocumentEngine();
  const [fetchingRef, setFetchingRef] = useState(false);

  const { control, register, handleSubmit, reset, setValue } =
    useForm<FormValues>({
      defaultValues: {
        referenceNumber: "",
        date: new Date(),
        supplyDate: null,
        billToName: "",
        billToAddress: "",
        poNumber: "",
        items: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  /* ================= FETCH REFERENCE NUMBER & RESET ================= */
  useEffect(() => {
    if (!open) {
      reset();
      return;
    }

    const fetchSequenceReference = async () => {
      try {
        setFetchingRef(true);
        const referenceData = await DocumentService.getReferenceNumber(
          "DELIVERYNOTE" as any,
        );
        if (referenceData?.reference_no) {
          setValue("referenceNumber", referenceData.reference_no);
        }
      } catch (error) {
        console.error("Failed fetching delivery note sequence context:", error);
        toast.error("Could not generate reference number automatically");
      } finally {
        setFetchingRef(false);
      }
    };

    fetchSequenceReference();
  }, [open, reset, setValue]);

  /* ================= AUTO-FILL FROM CONFIRMED ITEMS ================= */
  useEffect(() => {
    if (open && confirmedItems?.length) {
      const mappedItems = confirmedItems.map((item) => ({
        description: item.item_name || item.description || "",
        remarks: item.customer_remark || item.remarks || "",
        unit: item.unit || "PCS",
        quantity: Number(item.quantity || 1),
      }));
      setValue("items", mappedItems);
    }
  }, [open, confirmedItems, setValue]);

  /* ================= PAYLOAD BUILDER ================= */
  const buildPayload = (data: FormValues) => ({
    document: "DELIVERYNOTE",
    documentType: "pdf",
    documentData: {
      reference_no: data.referenceNumber,
      date:
        data.date instanceof Date
          ? data.date.toLocaleDateString("en-GB")
          : data.date,
      supplyDate:
        data.supplyDate instanceof Date
          ? data.supplyDate.toLocaleDateString("en-GB")
          : data.supplyDate,
      billToName: data.billToName,
      billToAddress: data.billToAddress,
      poNumber: data.poNumber,
      items: data.items.map((item, index) => ({
        no: index + 1,
        item_name: item.description,
        customer_remark: item.remarks || "—",
        unit: item.unit || "PCS",
        quantity: Number(item.quantity || 0),
      })),
    },
  });

  /* ================= ACTIONS ================= */
  const onSubmit = async (data: FormValues) => {
    try {
      await runJob(buildPayload(data), "Delivery Note");
      toast.success("Delivery Note generated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate delivery note");
    }
  };

  const handleSaveDraft = handleSubmit(async (data) => {
    try {
      await saveDraft(buildPayload(data));
      toast.success("Draft saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save draft");
    }
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[1200px] max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 border-b shrink-0">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <DialogTitle className="text-xl font-bold">
              Create Delivery Note
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm mt-1">
            Complete the logistic criteria and dispatch entries below to build
            your delivery manifest.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Scrollable Form Body Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* ================= SECTION: METADATA & SHIPMENT DETAILS ================= */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Core Metadata & Logistics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="referenceNumber"
                    className="text-xs font-medium text-primary"
                  >
                    Reference Number
                  </Label>
                  <Input
                    id="referenceNumber"
                    placeholder={
                      fetchingRef
                        ? "Fetching reference code..."
                        : "e.g. DN-2026-0001"
                    }
                    disabled={fetchingRef}
                    {...register("referenceNumber")}
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <Label className="text-xs font-medium mb-1.5">
                    Document Date
                  </Label>
                  <Controller
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <DatePicker
                        date={field.value ?? undefined}
                        onDateChange={(d) => field.onChange(d)}
                      />
                    )}
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <Label className="text-xs font-medium mb-1.5">
                    Supply/Delivery Date
                  </Label>
                  <Controller
                    control={control}
                    name="supplyDate"
                    render={({ field }) => (
                      <DatePicker
                        date={field.value ?? undefined}
                        onDateChange={(d) => field.onChange(d)}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="poNumber" className="text-xs font-medium">
                    PO Number Reference
                  </Label>
                  <Input
                    id="poNumber"
                    placeholder="e.g. PO-99843"
                    {...register("poNumber")}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label
                    htmlFor="billToName"
                    className="text-xs font-medium flex items-center gap-1"
                  >
                    <User className="w-3 h-3 text-muted-foreground" /> Client /
                    Consignee Name
                  </Label>
                  <Input
                    id="billToName"
                    placeholder="Corporate Entity Name"
                    {...register("billToName")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="billToAddress"
                  className="text-xs font-medium flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-muted-foreground" /> Delivery
                  Destination Address
                </Label>
                <Input
                  id="billToAddress"
                  placeholder="Full operational delivery drop location details"
                  {...register("billToAddress")}
                />
              </div>
            </div>

            <Separator />

            {/* ================= SECTION: LINE ITEMS ================= */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Consignment Items
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs gap-1.5 font-medium"
                  onClick={() =>
                    append({
                      description: "",
                      remarks: "",
                      unit: "PCS",
                      quantity: 1,
                    })
                  }
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Row
                </Button>
              </div>

              {fields.length > 0 && (
                <div className="hidden md:grid grid-cols-12 gap-3 px-2 text-xs font-medium text-muted-foreground">
                  <div className="col-span-5">Item Description</div>
                  <div className="col-span-3">Remarks</div>
                  <div className="col-span-2">Unit</div>
                  <div className="col-span-1.5">Quantity</div>
                  <div className="col-span-0.5"></div>
                </div>
              )}

              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-muted/10 p-3 md:p-0 rounded-xl border md:border-none"
                  >
                    <div className="col-span-5 space-y-1 md:space-y-0">
                      <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground md:hidden">
                        Description
                      </Label>
                      <Input
                        placeholder="Cargo Manifest Description"
                        {...register(`items.${index}.description` as const)}
                      />
                    </div>

                    <div className="col-span-3 space-y-1 md:space-y-0">
                      <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground md:hidden">
                        Remarks
                      </Label>
                      <Input
                        placeholder="Special Handling Instructions"
                        {...register(`items.${index}.remarks` as const)}
                      />
                    </div>

                    <div className="col-span-2 space-y-1 md:space-y-0">
                      <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground md:hidden">
                        Unit
                      </Label>
                      <Input
                        placeholder="e.g. PCS / BOX"
                        {...register(`items.${index}.unit` as const)}
                      />
                    </div>

                    <div className="col-span-1.5 space-y-1 md:space-y-0">
                      <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground md:hidden">
                        Qty
                      </Label>
                      <Input
                        type="number"
                        placeholder="1"
                        {...register(`items.${index}.quantity` as const)}
                      />
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
                ))}
              </div>
            </div>
          </div>

          {/* ================= FIXED FOOTER ACTIONS ================= */}
          <DialogFooter className="p-6 border-t bg-background shrink-0 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={loading || fetchingRef}
              >
                Save Draft
              </Button>
              <Button
                type="submit"
                disabled={loading || fetchingRef}
                className="px-5"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Delivery Note
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

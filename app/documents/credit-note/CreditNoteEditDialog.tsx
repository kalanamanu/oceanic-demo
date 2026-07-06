"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Trash2, Plus } from "lucide-react";

interface Props {
  docId: string;
  open: boolean;
  onClose: () => void;
}

export default function CreditNoteEditDialog({ docId, open, onClose }: Props) {
  const { runJob, loading } = useDocumentEngine();

  const [initialLoading, setInitialLoading] = useState(false);

  const { register, control, handleSubmit, reset, watch } = useForm<any>({
    defaultValues: {
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  /* ================= LOAD EXISTING DOC ================= */
  useEffect(() => {
    const load = async () => {
      if (!open || !docId) return;

      try {
        setInitialLoading(true);

        const res = await DocumentService.getDocument(docId);
        const doc = res?.document;

        reset(doc);
      } catch (err) {
        toast.error("Failed to load document");
      } finally {
        setInitialLoading(false);
      }
    };

    load();
  }, [open, docId]);

  /* ================= PAYLOAD ================= */
  const buildPayload = (data: any) => ({
    document: "CREDIT NOTE",
    documentType: "pdf",
    documentData: {
      ...data,
      items: data.items.map((i: any) => ({
        ...i,
        amount: i.quantity * i.unit_price,
      })),
      totalAmount: data.items.reduce(
        (sum: number, i: any) => sum + i.quantity * i.unit_price,
        0,
      ),
    },
  });

  /* ================= SUBMIT ================= */
  const onSubmit = async (data: any) => {
    try {
      const payload = buildPayload(data);
      await runJob(payload, "Credit Note (Updated)");

      toast.success("Credit Note updated & regenerated");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Credit Note</DialogTitle>
        </DialogHeader>

        {initialLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ITEMS ONLY (KEEP SIMPLE EDIT UX) */}
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2">
                  <Input
                    className="col-span-6"
                    {...register(`items.${index}.description`)}
                    placeholder="Description"
                  />

                  <Input
                    className="col-span-2"
                    type="number"
                    {...register(`items.${index}.quantity`)}
                  />

                  <Input
                    className="col-span-2"
                    type="number"
                    {...register(`items.${index}.unit_price`)}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    className="col-span-2"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
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

              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Regenerate PDF"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

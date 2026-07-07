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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useDocumentEngine } from "@/hooks/use-document-job";
import { BasisService } from "@/services/basis.service";
import { DatePicker } from "@/components/ui/date-picker";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { DocumentService } from "@/services/document.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
}

interface DispatchItem {
  selected: boolean;
  product: string;
  rcvd_qty: string;
  issued_qty: string;
  exp_date: string;
  revd_time: string;
  date: string;
  rejects: string;
  fat_con: string;
  remark: string;
  unit: string;
}

export function CreateDispatchNoteDialog({ open, onOpenChange, data }: Props) {
  const { loading, runJob } = useDocumentEngine({
    pollInterval: 2000,
    maxAttempts: 5,
  });

  const [form, setForm] = React.useState({
    reference_no: "",
    vessel_name: "",
    caption: "",
    cook: "",
    agent: "",
    details: "",
    place_of_delivery: "",
    ETD: "",
    no_of_crew: "",
    next_main_order_in: "",
    company: "",
    port: "",
    supplier: "",
    po_no: "",
    ETA: "",
    date: new Date().toISOString().split("T")[0],
    documentType: "pdf" as "pdf" | "excel",
  });

  // Defaulting 'selected' to false so items start grayed out
  const [items, setItems] = React.useState<DispatchItem[]>([
    {
      selected: false,
      product: "",
      rcvd_qty: "",
      issued_qty: "",
      exp_date: "",
      revd_time: "",
      date: "",
      rejects: "",
      fat_con: "",
      remark: "",
      unit: "",
    },
  ]);

  // Load Active Basis and Reference Number
  React.useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        const referenceData = await DocumentService.getReferenceNumber(
          "DISPATCHNOTE" as any,
        );

        setForm((prev) => ({
          ...prev,
          reference_no: referenceData.reference_no,
        }));
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [open]);

  // Auto Fill Confirmed Order
  React.useEffect(() => {
    console.log("DISPATCH DATA:", data);

    if (!data || !Array.isArray(data)) return;

    setItems(
      data.map((item: any) => ({
        selected: false,
        product: item.item_name || "",
        rcvd_qty: String(item.quantity || ""),
        issued_qty: String(item.quantity || ""),
        exp_date: "",
        revd_time: "",
        date: "",
        rejects: "",
        fat_con: "",
        remark: item.customer_remark || "",
        unit: item.unit || "",
      })),
    );

    setForm((prev) => ({
      ...prev,
      reference_no: data?.[0]?.pre_cost_id || "",
    }));
  }, [data, open]);

  const updateItem = (index: number, field: keyof DispatchItem, value: any) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        selected: false, // Default to false for new rows
        product: "",
        rcvd_qty: "",
        issued_qty: "",
        exp_date: "",
        revd_time: "",
        date: "",
        rejects: "",
        fat_con: "",
        remark: "",
        unit: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Select All or Deselect All Master Logic
  const isAllSelected =
    items.length > 0 && items.every((item) => item.selected);
  const handleSelectAllChange = (checked: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: checked })));
  };

  const handleDownload = async () => {
    try {
      const targetedItems = items
        .filter((item) => item.selected)
        .map((item, index) => ({
          no: index + 1,
          product: item.product,
          rcvd_qty: item.rcvd_qty,
          issued_qty: item.issued_qty,
          exp_date: item.exp_date,
          revd_time: item.revd_time,
          date: item.date,
          rejects: item.rejects,
          fat_con: item.fat_con,
          remark: item.remark,
          unit: item.unit,
        }));

      const payload = {
        document: "DISPATCHNOTE",
        documentType: form.documentType,
        documentData: {
          reference_no: form.reference_no,
          vessel_name: form.vessel_name,
          caption: form.caption,
          cook: form.cook,
          agent: form.agent,
          details: form.details,
          place_of_delivery: form.place_of_delivery,
          ETD: form.ETD,
          no_of_crew: form.no_of_crew,
          next_main_order_in: form.next_main_order_in,
          company: form.company,
          port: form.port,
          supplier: form.supplier,
          po_no: form.po_no,
          date: form.date,
          items: targetedItems,
        },
      };

      await runJob(payload, "Dispatch Note");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[1200px] max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
        <div className="p-6 border-b bg-muted/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">
              Download Dispatch Note
            </DialogTitle>
            <DialogDescription>
              Configure and review dispatch logs, maritime routing details, and
              item receipts before generating documentation.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column: Shipping & Vessel Info */}
            <div className="flex-1 space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Vessel & Shipping Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Reference No"
                  value={form.reference_no}
                  onChange={(v) => setForm({ ...form, reference_no: v })}
                />
                <Field
                  label="Vessel Name"
                  value={form.vessel_name}
                  onChange={(v) => setForm({ ...form, vessel_name: v })}
                />
                <Field
                  label="Caption"
                  value={form.caption}
                  onChange={(v) => setForm({ ...form, caption: v })}
                />
                <Field
                  label="Company"
                  value={form.company}
                  onChange={(v) => setForm({ ...form, company: v })}
                />
                <Field
                  label="Agent"
                  value={form.agent}
                  onChange={(v) => setForm({ ...form, agent: v })}
                />
                <Field
                  label="Supplier"
                  value={form.supplier}
                  onChange={(v) => setForm({ ...form, supplier: v })}
                />
                <Field
                  label="PO No"
                  value={form.po_no}
                  onChange={(v) => setForm({ ...form, po_no: v })}
                />
              </div>
            </div>

            <div className="hidden md:block w-px bg-border self-stretch" />

            {/* Right Column: Timelines & Logistics */}
            <div className="flex-1 space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Logistics & Timeline
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Port"
                  value={form.port}
                  onChange={(v) => setForm({ ...form, port: v })}
                />
                <Field
                  label="Place of Delivery"
                  value={form.place_of_delivery}
                  onChange={(v) => setForm({ ...form, place_of_delivery: v })}
                />
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground/80">
                    ETA
                  </Label>
                  <DateTimePicker
                    date={form.ETA ? new Date(form.ETA) : undefined}
                    onDateChange={(v) =>
                      setForm({ ...form, ETA: v ? v.toISOString() : "" })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground/80">
                    ETD
                  </Label>
                  <DateTimePicker
                    date={form.ETD ? new Date(form.ETD) : undefined}
                    onDateChange={(v) =>
                      setForm({ ...form, ETD: v ? v.toISOString() : "" })
                    }
                  />
                </div>
                <Field
                  label="Cook"
                  value={form.cook}
                  onChange={(v) => setForm({ ...form, cook: v })}
                />
                <Field
                  label="No Of Crew"
                  value={form.no_of_crew}
                  onChange={(v) => setForm({ ...form, no_of_crew: v })}
                />
                <Field
                  label="Next Main Order In"
                  value={form.next_main_order_in}
                  onChange={(v) => setForm({ ...form, next_main_order_in: v })}
                />
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground/80">
                    Date
                  </Label>
                  <DatePicker
                    date={form.date ? new Date(form.date) : undefined}
                    onDateChange={(v) =>
                      setForm({
                        ...form,
                        date: v ? v.toISOString().split("T")[0] : "",
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details Row */}
          <div className="space-y-2 border-t pt-4">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Additional Logistics Details
            </Label>
            <Input
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              placeholder="Enter explicit instructions or terminal delivery terms..."
            />
          </div>

          {/* Spreadsheet-like Manifesto Table */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  Dispatch Manifesto
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Edit log data directly within the rows below. Unmarked rows
                  are omitted from generation.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={addItem}
                className="h-8 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add New Row
              </Button>
            </div>

            <div className="border rounded-lg overflow-x-auto shadow-inner bg-card max-w-full">
              <table className="w-full min-w-[1200px] text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-muted/70 text-muted-foreground text-[11px] font-bold uppercase border-b tracking-wider">
                    <th className="p-2.5 w-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-1 select-none">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={(checked) =>
                            handleSelectAllChange(!!checked)
                          }
                        />
                      </div>
                    </th>
                    <th className="p-2.5 w-10 text-center">#</th>
                    <th className="p-2.5 w-[220px]">Product</th>
                    <th className="p-2.5 w-[90px]">Unit</th>
                    <th className="p-2.5 w-[100px]">Rcvd Qty</th>
                    <th className="p-2.5 w-[100px]">Issd Qty</th>
                    <th className="p-2.5 w-[95px]">Rejects</th>
                    <th className="p-2.5 w-[95px]">Fat Con</th>
                    <th className="p-2.5 w-[160px]">Expiry Date</th>
                    <th className="p-2.5 w-[230px]">Rcvd Time</th>
                    <th className="p-2.5 w-[160px]">Date</th>
                    <th className="p-2.5 w-[180px]">Remark</th>
                    <th className="p-2.5 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs">
                  {items.map((item, index) => (
                    <tr
                      key={index}
                      className={`transition-colors duration-150 ${
                        item.selected
                          ? "bg-background hover:bg-muted/30 text-foreground"
                          : "bg-muted/30 text-muted-foreground/60 opacity-60 select-none"
                      }`}
                    >
                      <td className="p-1.5 text-center">
                        <Checkbox
                          checked={item.selected}
                          onCheckedChange={(checked) =>
                            updateItem(index, "selected", !!checked)
                          }
                        />
                      </td>
                      <td className="p-1.5 text-center font-medium text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.product}
                          readOnly
                          className="bg-muted/40 font-medium select-none cursor-not-allowed text-muted-foreground/90 border-dashed"
                          onChange={(v) => updateItem(index, "product", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.unit}
                          readOnly
                          className="bg-muted/40 text-center font-medium select-none cursor-not-allowed text-muted-foreground/90 border-dashed"
                          onChange={(v) => updateItem(index, "unit", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.rcvd_qty}
                          disabled={!item.selected}
                          onChange={(v) => updateItem(index, "rcvd_qty", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.issued_qty}
                          disabled={!item.selected}
                          onChange={(v) => updateItem(index, "issued_qty", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.rejects}
                          disabled={!item.selected}
                          onChange={(v) => updateItem(index, "rejects", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.fat_con}
                          disabled={!item.selected}
                          onChange={(v) => updateItem(index, "fat_con", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <DatePicker
                          date={
                            item.exp_date ? new Date(item.exp_date) : undefined
                          }
                          disabled={!item.selected}
                          onDateChange={(v) =>
                            updateItem(
                              index,
                              "exp_date",
                              v ? v.toISOString().split("T")[0] : "",
                            )
                          }
                        />
                      </td>
                      <td className="p-1.5">
                        <DateTimePicker
                          date={
                            item.revd_time
                              ? new Date(item.revd_time)
                              : undefined
                          }
                          disabled={!item.selected}
                          onDateChange={(v) =>
                            updateItem(
                              index,
                              "revd_time",
                              v ? v.toISOString() : "",
                            )
                          }
                        />
                      </td>
                      <td className="p-1.5">
                        <DatePicker
                          date={item.date ? new Date(item.date) : undefined}
                          disabled={!item.selected}
                          onDateChange={(v) =>
                            updateItem(
                              index,
                              "date",
                              v ? v.toISOString().split("T")[0] : "",
                            )
                          }
                        />
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.remark}
                          disabled={!item.selected}
                          onChange={(v) => updateItem(index, "remark", v)}
                        />
                      </td>
                      <td className="p-1.5 text-center">
                        {items.length > 1 && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-muted/20 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Compiling..." : "Generate & Download"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Reusable Local Elements */
function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-foreground/80">{label}</Label>
      <Input
        type={type}
        value={value}
        className="h-9 shadow-sm bg-card focus-visible:ring-1 text-xs"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TableInput({
  value,
  onChange,
  type = "text",
  className = "",
  readOnly = false,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
}) {
  return (
    <Input
      type={type}
      value={value}
      readOnly={readOnly}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`h-8 text-xs bg-muted/20 border-border focus-visible:ring-1 focus-visible:bg-card px-2 rounded ${className}`}
    />
  );
}

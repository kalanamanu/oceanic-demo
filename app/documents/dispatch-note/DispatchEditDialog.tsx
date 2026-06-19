"use client";
import * as React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, FileSpreadsheet, FileText } from "lucide-react";
import { useDocumentEngine } from "@/hooks/use-document-job";
import { BasisService } from "@/services/basis.service";
import { DatePicker } from "@/components/ui/date-picker";
import { DateTimePicker } from "@/components/ui/datetime-picker";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document?: any;
  data?: any;
}

interface DispatchItem {
  product: string;
  supplier: string;
  po_no: string;
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

export default function DispatchEditDialog({
  open,
  onOpenChange,
  document,
  data,
}: Props) {
  const { loading, runJob } = useDocumentEngine({
    pollInterval: 2000,
    maxAttempts: 5,
  });
  const [currency, setCurrency] = React.useState<"LKR" | "USD">("LKR");
  const [usdRate, setUsdRate] = React.useState(1);

  //Load Active Basis
  React.useEffect(() => {
    const loadBasis = async () => {
      try {
        const basis = await BasisService.getActiveBasis();

        const rate = Number(basis?.USDRate ?? 1) || 1;

        setUsdRate(rate);
      } catch (err) {
        console.error(err);
      }
    };

    loadBasis();
  }, []);

  React.useEffect(() => {
    if (!document?.document?.data) return;

    const doc = document.document;
    const data = doc.data;

    console.log("EDIT DOC", doc);
    console.log("EDIT DATA", data);

    setCurrency(data.currency || "LKR");

    setForm({
      reference_no: data.reference_no || "",
      vessel_name: data.vessel_name || "",
      caption: data.caption || "",
      cook: data.cook || "",
      agent: data.agent || "",
      details: data.details || "",
      place_of_delivery: data.place_of_delivery || "",
      ETD: data.ETD || "",
      no_of_crew: data.no_of_crew || "",
      next_main_order_in: data.next_main_order_in || "",
      company: data.company || "",
      port: data.port || "",
      supplier: data.supplier || "",
      ETA: data.ETA || "",
      discount: Number(data.discount || 0),
      transport_cost: Number(data.transport_cost || 0),
      full_total_cost: Number(data.full_total_cost || 0),
      date: data.date || "",
      documentType: "pdf",
    });

    if (Array.isArray(data.items)) {
      setItems(
        data.items.map((item: any) => ({
          product: item.product || "",
          supplier: item.supplier || "",
          po_no: item.po_no || "",
          rcvd_qty: String(item.rcvd_qty || ""),
          issued_qty: String(item.issued_qty || ""),
          exp_date: item.exp_date || "",
          revd_time: item.revd_time || "",
          date: item.date || "",
          rejects: item.rejects || "",
          fat_con: item.fat_con || "",
          remark: item.remark || "",
          unit: item.unit || "",
        })),
      );
    }
  }, [document]);

  console.log("PROP DOCUMENT", document);
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
    ETA: "",
    discount: 0,
    transport_cost: 0,
    full_total_cost: 0,
    date: new Date().toISOString().split("T")[0],
    documentType: "pdf" as "pdf" | "excel",
  });
  const [items, setItems] = React.useState<DispatchItem[]>([
    {
      product: "",
      supplier: "",
      po_no: "",
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
  const updateItem = (
    index: number,
    field: keyof DispatchItem,
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product: "",
        supplier: "",
        po_no: "",
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

  const subTotal = Number(form.full_total_cost || 0);
  const discount = Number(form.discount || 0);
  const transportCost = Number(form.transport_cost || 0);
  const grandTotal = subTotal - discount + transportCost;
  const handleDownload = async () => {
    try {
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
          ETA: form.ETA,
          currency,

          discount,

          sub_total: Number(subTotal.toFixed(2)),

          full_total_cost: Number(grandTotal.toFixed(2)),

          transport_cost: transportCost,
          date: form.date,
          items: items.map((item, index) => ({ no: index + 1, ...item })),
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
      {/* Changed window constraints to override shadcn defaults to use 90vw width properly */}
      <DialogContent className="sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[1200px] max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
        {/* Persistent Premium Header */}
        <div className="p-6 border-b bg-muted/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">
              Edit Dispatch Note
            </DialogTitle>
            <DialogDescription>
              Configure and review dispatch logs, maritime routing details, and
              item receipts before generating documentation.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Layout Context Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Metadata Section Split (Horizontal layout block) */}
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
              </div>
            </div>

            {/* Vertical Divider for Clear Space Division */}
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
                  Edit log data directly within the rows below.
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
              <table className="w-full min-w-[1400px] text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-muted/70 text-muted-foreground text-[11px] font-bold uppercase border-b tracking-wider">
                    <th className="p-2.5 w-10 text-center">#</th>
                    <th className="p-2.5 w-[160px]">Product</th>
                    <th className="p-2.5 w-[140px]">Supplier</th>
                    <th className="p-2.5 w-[100px]">PO No</th>
                    <th className="p-2.5 w-[80px]">Unit</th>
                    <th className="p-2.5 w-[95px]">Rcvd Qty</th>
                    <th className="p-2.5 w-[95px]">Issd Qty</th>
                    <th className="p-2.5 w-[90px]">Rejects</th>
                    <th className="p-2.5 w-[90px]">Fat Con</th>
                    <th className="p-2.5 w-[160px]">Expiry Date</th>
                    <th className="p-2.5 w-[230px]">Rcvd Time</th>
                    <th className="p-2.5 w-[160px]">Date</th>
                    <th className="p-2.5 w-[160px]">Remark</th>
                    <th className="p-2.5 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs">
                  {items.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="p-1.5 text-center font-medium text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.product}
                          onChange={(v) => updateItem(index, "product", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.supplier}
                          onChange={(v) => updateItem(index, "supplier", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.po_no}
                          onChange={(v) => updateItem(index, "po_no", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.unit}
                          onChange={(v) => updateItem(index, "unit", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.rcvd_qty}
                          onChange={(v) => updateItem(index, "rcvd_qty", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.issued_qty}
                          onChange={(v) => updateItem(index, "issued_qty", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.rejects}
                          onChange={(v) => updateItem(index, "rejects", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <TableInput
                          value={item.fat_con}
                          onChange={(v) => updateItem(index, "fat_con", v)}
                        />
                      </td>
                      <td className="p-1.5">
                        <DatePicker
                          date={
                            item.exp_date ? new Date(item.exp_date) : undefined
                          }
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

          {/* Financial Totals Ledger Row */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-t pt-6 bg-muted/10 p-4 rounded-xl">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground tracking-wide">
                Currency Standard
              </Label>
              <div className="flex bg-muted p-1 rounded-lg border shadow-inner">
                <button
                  type="button"
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${currency === "LKR" ? "bg-background shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setCurrency("LKR")}
                >
                  LKR
                </button>
                <button
                  type="button"
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${currency === "USD" ? "bg-background shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setCurrency("USD")}
                >
                  USD
                </button>
              </div>
            </div>

            <div className="w-full md:w-80 grid grid-cols-1 gap-2.5">
              <div className="flex justify-between items-center text-xs font-medium border-b pb-1.5">
                <span className="text-muted-foreground">
                  Sub Total ({currency})
                </span>
                <span className="font-mono">{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center gap-4 text-xs font-medium border-b pb-1.5">
                <span className="text-muted-foreground">Discount Value</span>
                <div className="w-24">
                  <TableInput
                    type="number"
                    className="text-right h-6 py-0 font-mono bg-background border"
                    value={String(form.discount)}
                    onChange={(v) =>
                      setForm({ ...form, discount: Number(v) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-between items-center gap-4 text-xs font-medium border-b pb-1.5">
                <span className="text-muted-foreground">Transport Cost</span>
                <div className="w-24">
                  <TableInput
                    type="number"
                    className="text-right h-6 py-0 font-mono bg-background border"
                    value={String(form.transport_cost)}
                    onChange={(v) =>
                      setForm({ ...form, transport_cost: Number(v) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-between items-center font-bold text-base pt-1 text-foreground">
                <span>Grand Total</span>
                <span className="font-mono tracking-tight text-emerald-500">
                  {currency}{" "}
                  {grandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Export File Profile Select */}
          {/* <div className="w-full md:w-64 space-y-1.5 border-t pt-6">
            <Label className="text-xs font-bold uppercase text-muted-foreground tracking-wide">
              Export Engine Profile
            </Label>
            <Select
              value={form.documentType}
              onValueChange={(v) =>
                setForm({ ...form, documentType: v as "pdf" | "excel" })
              }
            >
              <SelectTrigger className="bg-card shadow-sm h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <span className="flex items-center gap-2 text-destructive">
                    <FileText className="w-3.5 h-3.5" /> Portable Document
                    Format (.pdf)
                  </span>
                </SelectItem>
                <SelectItem value="excel">
                  <span className="flex items-center gap-2 text-emerald-500">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Microsoft Excel
                    Sheet (.xlsx)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>

        {/* Fixed Footer Stack */}
        <div className="p-4 border-t bg-muted/20 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Compiling..." : "Edit and Regenerate"}
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
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-8 text-xs bg-muted/20 border-border focus-visible:ring-1 focus-visible:bg-card px-2 rounded ${className}`}
    />
  );
}

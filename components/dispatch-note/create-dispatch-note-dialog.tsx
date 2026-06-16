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
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useDocumentEngine } from "@/hooks/use-document-job";
import { BasisService } from "@/services/basis.service";
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
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
export function CreateDispatchNoteDialog({ open, onOpenChange, data }: Props) {
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

  //Auto Fill Confirmed Order
  React.useEffect(() => {
    if (!data) return;

    setForm((prev) => ({
      ...prev,
      reference_no: data.pre_cost_id || data.confirmed_pre_cost_id || "",
    }));

    if (data.confirmedItems?.length) {
      setItems(
        data.confirmedItems.map((item: any) => ({
          product: item.item_name || "",
          supplier: "",
          po_no: "",
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
    }
  }, [data]);

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
  const baseLkr = Number(data?.confirmed_total_lkr || 0);

  const baseUsd = Number(data?.confirmed_total_usd || 0);

  const subTotal = currency === "USD" ? baseUsd : baseLkr;
  const discount = Number(form.discount || 0);
  const transportCost = Number(form.transport_cost || 0);
  const grandTotal = subTotal - discount + transportCost;
  const handleDownload = async () => {
    try {
      const payload = {
        document: "dispatchnote",
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
      <DialogContent className="max-w-6xl p-6 gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Download Dispatch Note</DialogTitle>
          <DialogDescription>
            Configure dispatch note details before generating the document.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-6">
          {/* HEADER DETAILS */}
          <div className="grid grid-cols-3 gap-4">
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
              label="Cook"
              value={form.cook}
              onChange={(v) => setForm({ ...form, cook: v })}
            />
            <Field
              label="Agent"
              value={form.agent}
              onChange={(v) => setForm({ ...form, agent: v })}
            />
            <Field
              label="Company"
              value={form.company}
              onChange={(v) => setForm({ ...form, company: v })}
            />
            <Field
              label="Port"
              value={form.port}
              onChange={(v) => setForm({ ...form, port: v })}
            />
            <Field
              label="Supplier"
              value={form.supplier}
              onChange={(v) => setForm({ ...form, supplier: v })}
            />
            <Field
              label="Place of Delivery"
              value={form.place_of_delivery}
              onChange={(v) => setForm({ ...form, place_of_delivery: v })}
            />
            <Field
              label="ETA"
              value={form.ETA}
              onChange={(v) => setForm({ ...form, ETA: v })}
            />
            <Field
              label="ETD"
              value={form.ETD}
              onChange={(v) => setForm({ ...form, ETD: v })}
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
            <Field
              label="Date"
              type="date"
              value={form.date}
              onChange={(v) => setForm({ ...form, date: v })}
            />
          </div>
          {/* DETAILS */}
          <div className="space-y-2">
            <Label>Details</Label>
            <Input
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
            />
          </div>
          {/* ITEMS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold"> Dispatch Items </h3>
              <Button size="sm" variant="outline" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>
            {items.map((item, index) => (
              <div key={index} className="border rounded-xl p-4 space-y-4">
                <div className="flex justify-between">
                  <h4 className="font-medium"> Item #{index + 1} </h4>
                  {items.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <ItemField
                    label="Product"
                    value={item.product}
                    onChange={(v) => updateItem(index, "product", v)}
                  />
                  <ItemField
                    label="Supplier"
                    value={item.supplier}
                    onChange={(v) => updateItem(index, "supplier", v)}
                  />
                  <ItemField
                    label="PO No"
                    value={item.po_no}
                    onChange={(v) => updateItem(index, "po_no", v)}
                  />
                  <ItemField
                    label="Unit"
                    value={item.unit}
                    onChange={(v) => updateItem(index, "unit", v)}
                  />
                  <ItemField
                    label="Received Qty"
                    value={item.rcvd_qty}
                    onChange={(v) => updateItem(index, "rcvd_qty", v)}
                  />
                  <ItemField
                    label="Issued Qty"
                    value={item.issued_qty}
                    onChange={(v) => updateItem(index, "issued_qty", v)}
                  />
                  <ItemField
                    label="Rejects"
                    value={item.rejects}
                    onChange={(v) => updateItem(index, "rejects", v)}
                  />
                  <ItemField
                    label="Fat Con"
                    value={item.fat_con}
                    onChange={(v) => updateItem(index, "fat_con", v)}
                  />
                  <ItemField
                    label="Expiry Date"
                    value={item.exp_date}
                    onChange={(v) => updateItem(index, "exp_date", v)}
                  />
                  <ItemField
                    label="Received Time"
                    value={item.revd_time}
                    onChange={(v) => updateItem(index, "revd_time", v)}
                  />
                  <ItemField
                    label="Date"
                    value={item.date}
                    onChange={(v) => updateItem(index, "date", v)}
                  />
                  <ItemField
                    label="Remark"
                    value={item.remark}
                    onChange={(v) => updateItem(index, "remark", v)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={currency === "LKR" ? "default" : "outline"}
              onClick={() => setCurrency("LKR")}
            >
              LKR
            </Button>

            <Button
              type="button"
              variant={currency === "USD" ? "default" : "outline"}
              onClick={() => setCurrency("USD")}
            >
              USD
            </Button>
          </div>
          {/* SUMMARY */}
          <div className="border rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <Field
                label={`Sub Total (${currency})`}
                type="number"
                value={subTotal.toFixed(2)}
                onChange={() => {}}
              />
              <Field
                label="Discount"
                type="number"
                value={String(form.discount)}
                onChange={(v) => setForm({ ...form, discount: Number(v) || 0 })}
              />
              <Field
                label="Transport Cost"
                type="number"
                value={String(form.transport_cost)}
                onChange={(v) =>
                  setForm({ ...form, transport_cost: Number(v) || 0 })
                }
              />
            </div>
            <div className="flex justify-between border-t pt-3 font-semibold text-lg">
              <span>Grand Total</span>
              <span>
                {currency} {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
          {/* DOCUMENT TYPE */}
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select
              value={form.documentType}
              onValueChange={(v) =>
                setForm({ ...form, documentType: v as "pdf" | "excel" })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf"> PDF </SelectItem>
                <SelectItem value="excel"> Excel </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Generating..." : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
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
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
function ItemField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs"> {label} </Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

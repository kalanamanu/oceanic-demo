"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

// Example employee list; replace/fetch as needed
const employees = [
  { id: "001", name: "Maria Santos" },
  { id: "002", name: "John Silva" },
  { id: "003", name: "Purchasing Head" },
  // Add more
];

export function VesselInquiryDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  const [fields, setFields] = React.useState({
    vesselName: "",
    agent: "",
    eta: "",
    port: "",
    category: "",
    inquiryReceived: "",
    quotationSubmission: "",
    keyPic: "",
    subPics: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("subPic-")) {
      const idx = parseInt(name.split("-")[1], 10);
      setFields((prev) => ({
        ...prev,
        subPics: prev.subPics.map((pic, i) => (i === idx ? value : pic)),
      }));
    } else {
      setFields({ ...fields, [name]: value });
    }
  };

  const handleAddSubPic = () => {
    setFields((prev) => ({ ...prev, subPics: [...prev.subPics, ""] }));
  };

  const handleRemoveSubPic = (idx: number) => {
    setFields((prev) => ({
      ...prev,
      subPics: prev.subPics.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-2xl mx-auto p-8 sm:p-6 rounded-xl shadow-lg"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <DialogHeader>
          <DialogTitle>New Vessel Inquiry</DialogTitle>
          <DialogDescription>
            Fill out the vessel inquiry profile below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Vessel Name <span className="text-red-500">*</span>
            </label>
            <input
              name="vesselName"
              type="text"
              className="w-full border rounded px-3 py-2"
              required
              value={fields.vesselName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Agent</label>
            <input
              name="agent"
              type="text"
              className="w-full border rounded px-3 py-2"
              required
              value={fields.agent}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ETA</label>
            <input
              name="eta"
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              required
              value={fields.eta}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Port</label>
            <input
              name="port"
              type="text"
              className="w-full border rounded px-3 py-2"
              required
              value={fields.port}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              name="category"
              type="text"
              placeholder="Bonded, Provisions, Deck/Engine"
              className="w-full border rounded px-3 py-2"
              required
              value={fields.category}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Inquiry Received Date & Time{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              name="inquiryReceived"
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              required
              value={fields.inquiryReceived}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Quotation Submission Deadline
            </label>
            <input
              name="quotationSubmission"
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              required
              value={fields.quotationSubmission}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Key PIC</label>
            <input
              name="keyPic"
              type="text"
              className="w-full border rounded px-3 py-2"
              value={fields.keyPic}
              onChange={handleChange}
              placeholder="Key Person in Charge"
            />
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">Sub PICs</label>
              {(fields.subPics || []).map((pic, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input
                    name={`subPic-${idx}`}
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={pic}
                    onChange={handleChange}
                    placeholder={`Sub PIC #${idx + 1}`}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveSubPic(idx)}
                    title="Remove Sub PIC"
                  >
                    &times;
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSubPic}
              >
                + Add Sub PIC
              </Button>
            </div>
          </div>
          <DialogFooter className="mt-6 flex gap-3">
            <Button type="submit">Create Inquiry</Button>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="text-foreground dark:text-white hover:bg-muted"
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

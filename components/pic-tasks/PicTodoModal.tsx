"use client";

import * as React from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { PicTodoService } from "@/services/picTodo.service";
import { InquiryService } from "@/services/inquiry.service";

export function PicTodoModal({ open, onClose, onSuccess }: any) {
  const [loading, setLoading] = React.useState(false);

  const [inquiries, setInquiries] = React.useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = React.useState<any>(null);

  const [picId, setPicId] = React.useState("");
  const [inqId, setInqId] = React.useState("");

  const [todo, setTodo] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [dueTime, setDueTime] = React.useState("");
  const [remarks, setRemarks] = React.useState("");

  /* ================= LOAD INQUIRIES ================= */
  React.useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        const res = await InquiryService.getAllInquiries({
          page: 1,
          pageSize: 50,
        });

        setInquiries(res.data);
      } catch {
        toast.error("Failed to load inquiries");
      }
    };

    load();
  }, [open]);

  /* ================= SELECT INQUIRY ================= */
  const handleSelectInquiry = (inqId: string) => {
    const inquiry = inquiries.find((i) => i.inq_id === inqId);

    setInqId(inqId);
    setSelectedInquiry(inquiry);

    // reset PIC when inquiry changes
    setPicId("");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!picId || !inqId || !todo || !dueDate || !dueTime) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      await PicTodoService.createTodo({
        pic_id: picId,
        inq_id: inqId,
        todo_description: todo,
        due_date: dueDate,
        due_time: dueTime,
        remarks,
      });

      toast.success("Todo created");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PIC OPTIONS ================= */
  const picOptions = React.useMemo(() => {
    if (!selectedInquiry) return [];

    const list = [];

    if (selectedInquiry.key_pic) {
      list.push(selectedInquiry.key_pic);
    }

    if (selectedInquiry.other_pics) {
      list.push(...selectedInquiry.other_pics);
    }

    return list;
  }, [selectedInquiry]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Todo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* INQUIRY */}
          <div>
            <Label>Inquiry *</Label>
            <select
              className="w-full border rounded p-2 bg-background"
              value={inqId}
              onChange={(e) => handleSelectInquiry(e.target.value)}
            >
              <option value="">Select Inquiry</option>

              {inquiries.map((inq) => (
                <option key={inq.inq_id} value={inq.inq_id}>
                  {inq.vessel_name} ({inq.inq_id})
                </option>
              ))}
            </select>
          </div>

          {/* PIC */}
          <div>
            <Label>PIC *</Label>
            <select
              className="w-full border rounded p-2 bg-background"
              value={picId}
              onChange={(e) => setPicId(e.target.value)}
              disabled={!selectedInquiry}
            >
              <option value="">Select PIC</option>

              {picOptions.map((pic: any) => (
                <option key={pic.id} value={pic.id}>
                  {pic.name}
                </option>
              ))}
            </select>
          </div>

          {/* TODO */}
          <div>
            <Label>Description *</Label>
            <Input
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              placeholder="Todo description"
            />
          </div>

          {/* DUE DATE + TIME */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Due Date *</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div>
              <Label>Due Time *</Label>
              <Input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          {/* REMARKS */}
          <div>
            <Label>Remarks</Label>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Create Todo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

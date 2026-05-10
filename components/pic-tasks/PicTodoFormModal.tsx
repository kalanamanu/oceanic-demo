"use client";

import * as React from "react";
import { PicTodoService } from "@/services/picTodo.service";
import { DateTimePicker } from "@/components/ui/datetime-picker";

export function PicTodoFormModal({
  open,
  onClose,
  inquiryId,
  inquiry,
  onSuccess,
}: any) {
  const [form, setForm] = React.useState({
    pic_id: "",
    todo_description: "",
    due_date: undefined as Date | undefined,
    remarks: "",
  });

  /* ================= PIC OPTIONS ================= */
  const picOptions = React.useMemo(() => {
    if (!inquiry) return [];

    const list: any[] = [];

    if (inquiry.key_pic) {
      list.push({
        id: inquiry.key_pic.id,
        name: inquiry.key_pic.name,
        role: "Key PIC",
      });
    }

    if (inquiry.other_pics?.length) {
      list.push(
        ...inquiry.other_pics.map((p: any) => ({
          id: p.id,
          name: p.name,
          role: "Other PIC",
        })),
      );
    }

    return list;
  }, [inquiry]);

  if (!open) return null;

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.due_date) return;

    const due_date = form.due_date.toISOString().split("T")[0];

    const due_time =
      form.due_date.getHours().toString().padStart(2, "0") +
      ":" +
      form.due_date.getMinutes().toString().padStart(2, "0");

    await PicTodoService.createTodo({
      pic_id: form.pic_id,
      todo_description: form.todo_description,
      due_date,
      due_time,
      remarks: form.remarks,
      inq_id: inquiryId,
    });

    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background w-[500px] rounded-xl shadow-xl border p-5 space-y-4">
        {/* HEADER */}
        <div>
          <h2 className="text-lg font-bold">Create Todo</h2>
          <p className="text-xs text-muted-foreground">
            Assign a task to a PIC for this inquiry
          </p>
        </div>

        {/* ================= INQUIRY CONTEXT ================= */}
        {inquiry && (
          <div className="border rounded-lg p-3 bg-muted/30 space-y-1">
            <p className="font-semibold text-sm">{inquiry.vessel_name}</p>

            <p className="text-xs text-muted-foreground">
              {inquiry.port} • {inquiry.agent}
            </p>

            <p className="text-xs text-muted-foreground">
              Key PIC:{" "}
              <span className="text-foreground font-medium">
                {inquiry.key_pic?.name || "Unassigned"}
              </span>
            </p>
          </div>
        )}

        {/* ================= FORM ================= */}
        <div className="space-y-3">
          {/* PIC SELECT */}
          <div>
            <label className="text-xs font-medium">Assign PIC</label>

            <select
              className="w-full border rounded-md p-2 text-sm bg-background"
              value={form.pic_id}
              onChange={(e) => setForm({ ...form, pic_id: e.target.value })}
            >
              <option value="">Select PIC</option>

              {picOptions.map((pic) => (
                <option key={pic.id} value={pic.id}>
                  {pic.name} ({pic.role})
                </option>
              ))}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs font-medium">Task Description</label>

            <input
              placeholder="Enter task..."
              className="w-full border rounded-md p-2 text-sm bg-background"
              onChange={(e) =>
                setForm({
                  ...form,
                  todo_description: e.target.value,
                })
              }
            />
          </div>

          {/* DATE TIME PICKER */}
          <div>
            <label className="text-xs font-medium">Due Date & Time</label>

            <DateTimePicker
              date={form.due_date}
              onDateChange={(date) => setForm({ ...form, due_date: date })}
            />
          </div>

          {/* REMARKS */}
          <div>
            <label className="text-xs font-medium">Remarks</label>

            <textarea
              className="w-full border rounded-md p-2 text-sm bg-background"
              placeholder="Optional notes..."
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-2 pt-2 border-t">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-1 text-sm bg-primary text-white rounded-md"
          >
            Create Todo
          </button>
        </div>
      </div>
    </div>
  );
}

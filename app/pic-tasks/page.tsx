"use client";

import * as React from "react";
import { InquiryService } from "@/services/inquiry.service";
import { PicTodoService } from "@/services/picTodo.service";

import { InquirySelector } from "@/components/pic-tasks/InquirySelector";
import { PicTodoList } from "@/components/pic-tasks/PicTodoList";
import { PicTodoFormModal } from "@/components/pic-tasks/PicTodoFormModal";

export default function PicTodoPage() {
  const [inquiries, setInquiries] = React.useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = React.useState<string>("");

  const [todos, setTodos] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  /* ================= LOAD INQUIRIES ================= */
  const loadInquiries = async () => {
    try {
      const res = await InquiryService.getAllInquiries({
        page: 1,
        pageSize: 50,
      });

      setInquiries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOAD TODOS ================= */
  const loadTodos = async (inqId: string) => {
    if (!inqId) {
      setTodos([]);
      return;
    }

    try {
      setLoading(true);

      const res = await PicTodoService.getTodosByInquiry(inqId);

      setTodos(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */
  React.useEffect(() => {
    loadInquiries();
  }, []);

  React.useEffect(() => {
    loadTodos(selectedInquiry);
  }, [selectedInquiry]);

  return (
    <div className="space-y-4 p-6">
      {/* ================= ACTION BAR ================= */}
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          onClick={() => setOpen(true)}
          disabled={!selectedInquiry}
        >
          + Create Todo
        </button>
      </div>

      {/* ================= INQUIRY SELECT ================= */}
      <InquirySelector
        inquiries={inquiries}
        value={selectedInquiry}
        onChange={setSelectedInquiry}
      />

      {/* ================= TODO LIST ================== */}
      {loading ? (
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading todos...
        </p>
      ) : (
        <PicTodoList todos={todos} refresh={() => loadTodos(selectedInquiry)} />
      )}

      {/* ================= MODAL ================= */}
      <PicTodoFormModal
        open={open}
        onClose={() => setOpen(false)}
        inquiryId={selectedInquiry}
        inquiry={inquiries.find((i) => i.inq_id === selectedInquiry)}
        onSuccess={() => {
          setOpen(false);
          loadTodos(selectedInquiry);
        }}
      />
    </div>
  );
}

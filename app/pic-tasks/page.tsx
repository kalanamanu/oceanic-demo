"use client";

import * as React from "react";
import { toast } from "sonner";

import { PicTodoService } from "@/services/picTodo.service";
import { InquiryService } from "@/services/inquiry.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { PicTodoModal } from "@/components/pic-tasks/PicTodoModal";
import { PicTodoTable } from "@/components/pic-tasks/PicTodoTable";
import { PicTodoSidePanel } from "@/components/pic-tasks/PicTodoSidePanel";

export default function PicTodoPage() {
  const [todos, setTodos] = React.useState<any[]>([]);
  const [inquiries, setInquiries] = React.useState<any[]>([]);

  const [loading, setLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<any>(null);

  const [selectedTodo, setSelectedTodo] = React.useState<any>(null);

  const [search, setSearch] = React.useState("");

  /* ================= LOAD ================= */
  const loadTodos = async () => {
    try {
      setLoading(true);
      const res = await PicTodoService.getTodosByPic("all"); // adjust backend if needed
      setTodos(res);
    } catch {
      toast.error("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  const loadInquiries = async () => {
    const res = await InquiryService.getAllInquiries({
      page: 1,
      pageSize: 100,
    });

    setInquiries(res.data);
  };

  React.useEffect(() => {
    loadTodos();
    loadInquiries();
  }, []);

  /* ================= FILTER ================= */
  const filtered = React.useMemo(() => {
    return todos.filter((t) =>
      t.todo_description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [todos, search]);

  /* ================= ACTIONS ================= */
  const handleEdit = (todo: any) => {
    setSelected(todo);
    setOpen(true);
  };

  const handleSuccess = () => {
    setOpen(false);
    setSelected(null);
    loadTodos();
  };

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">PIC Todos</h1>

        <Button onClick={() => setOpen(true)}>+ New Todo</Button>
      </div>

      {/* SEARCH */}
      <Input
        placeholder="Search todos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <PicTodoTable
        data={filtered}
        loading={loading}
        onEdit={handleEdit}
        onSelect={setSelectedTodo}
        onRefresh={loadTodos}
      />

      {/* MODAL */}
      <PicTodoModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={selected}
        inquiries={inquiries}
        onSuccess={handleSuccess}
      />

      {/* SIDE PANEL */}
      <PicTodoSidePanel
        todo={selectedTodo}
        onClose={() => setSelectedTodo(null)}
      />
    </div>
  );
}

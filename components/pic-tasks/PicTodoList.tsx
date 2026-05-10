"use client";

import * as React from "react";
import { PicTodoService } from "@/services/picTodo.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Pencil, Calendar, Clock, MessageSquare } from "lucide-react";

type Todo = {
  todo_id: string;
  todo_description: string;
  due_date: string;
  due_time: string;
  remarks?: string;
  status: "pending" | "completed";
};

export function PicTodoList({
  todos,
  refresh,
}: {
  todos: Todo[];
  refresh: () => void;
}) {
  const [editTodo, setEditTodo] = React.useState<Todo | null>(null);
  const [form, setForm] = React.useState({
    todo_description: "",
    due_date: "",
    due_time: "",
    remarks: "",
  });

  const toggleStatus = async (todo: Todo) => {
    await PicTodoService.updateTodoStatus(todo.todo_id, {
      status: todo.status === "completed" ? "pending" : "completed",
    });
    refresh();
  };

  const remove = async (id: string) => {
    await PicTodoService.deleteTodo(id);
    refresh();
  };

  const openEdit = (todo: Todo) => {
    setEditTodo(todo);
    setForm({
      todo_description: todo.todo_description,
      due_date: todo.due_date,
      due_time: todo.due_time,
      remarks: todo.remarks || "",
    });
  };

  const saveEdit = async () => {
    if (!editTodo) return;
    await PicTodoService.updateTodo(editTodo.todo_id, form);
    setEditTodo(null);
    refresh();
  };

  return (
    <div className="space-y-3">
      {todos.map((todo) => {
        const isDone = todo.status === "completed";

        return (
          <div
            key={todo.todo_id}
            className={`group relative border rounded-xl p-4 bg-card transition-all duration-200 hover:shadow-sm ${
              isDone ? "opacity-75" : "border-border"
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              {/* LEFT: Content */}
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isDone
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {todo.status}
                    </span>
                  </div>
                  <p
                    className={`text-sm font-semibold leading-tight ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}
                  >
                    {todo.todo_description}
                  </p>
                </div>

                {/* METADATA GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{todo.due_date}</span>
                    <span className="text-border">|</span>
                    <Clock className="h-3 w-3" />
                    <span>{todo.due_time}</span>
                  </div>

                  {todo.remarks && (
                    <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                      <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                      <span className="italic truncate">"{todo.remarks}"</span>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Actions */}
              <div className="flex flex-col items-end gap-4 shrink-0">
                {/* Custom Toggle Switch */}
                <button
                  onClick={() => toggleStatus(todo)}
                  className={`relative w-10 h-5 flex items-center rounded-full px-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    isDone ? "bg-green-500" : "bg-muted border border-border"
                  }`}
                >
                  <div
                    className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                      isDone ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(todo)}
                    className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(todo.todo_id)}
                    className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ================= EDIT MODAL ================= */}
      {editTodo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border rounded-xl shadow-2xl w-full max-w-[400px] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold tracking-tight">Edit Task</h2>
                <p className="text-xs text-muted-foreground">
                  Update the details of your assigned todo.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-muted-foreground ml-1">
                    Description
                  </label>
                  <Input
                    value={form.todo_description}
                    onChange={(e) =>
                      setForm({ ...form, todo_description: e.target.value })
                    }
                    placeholder="What needs to be done?"
                    className="bg-muted/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-muted-foreground ml-1 text-nowrap">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={form.due_date}
                      onChange={(e) =>
                        setForm({ ...form, due_date: e.target.value })
                      }
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-muted-foreground ml-1">
                      Time
                    </label>
                    <Input
                      type="time"
                      value={form.due_time}
                      onChange={(e) =>
                        setForm({ ...form, due_time: e.target.value })
                      }
                      className="bg-muted/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-muted-foreground ml-1">
                    Remarks
                  </label>
                  <Textarea
                    value={form.remarks}
                    onChange={(e) =>
                      setForm({ ...form, remarks: e.target.value })
                    }
                    placeholder="Additional notes..."
                    rows={3}
                    className="bg-muted/30 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setEditTodo(null)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button onClick={saveEdit} className="px-8 shadow-md">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

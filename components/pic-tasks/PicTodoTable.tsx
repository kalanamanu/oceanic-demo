"use client";

import { Button } from "@/components/ui/button";
import { Check, Edit, Trash } from "lucide-react";
import { PicTodoService } from "@/services/picTodo.service";
import { toast } from "sonner";

export function PicTodoTable({ data, onEdit, onSelect, onRefresh }: any) {
  const toggleStatus = async (todo: any) => {
    try {
      await PicTodoService.updateTodoStatus(todo.todo_id, {
        status: todo.status === "completed" ? "pending" : "completed",
      });

      toast.success("Status updated");
      onRefresh();
    } catch {
      toast.error("Failed to update");
    }
  };

  const deleteTodo = async (id: string) => {
    if (!confirm("Delete this todo?")) return;

    await PicTodoService.deleteTodo(id);
    toast.success("Deleted");
    onRefresh();
  };

  return (
    <div className="space-y-2">
      {data.map((t: any) => (
        <div
          key={t.todo_id}
          className="border p-3 rounded flex justify-between items-center"
        >
          <div onClick={() => onSelect(t)} className="cursor-pointer">
            <p className="font-medium">{t.todo_description}</p>
            <p className="text-xs text-muted-foreground">
              {t.due_date} {t.due_time}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => toggleStatus(t)}
            >
              <Check className="w-4 h-4" />
            </Button>

            <Button size="icon" variant="secondary" onClick={() => onEdit(t)}>
              <Edit className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant="destructive"
              onClick={() => deleteTodo(t.todo_id)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

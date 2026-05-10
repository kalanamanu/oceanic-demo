"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PicTodoSidePanel({ todo, onClose }: any) {
  if (!todo) return null;

  return (
    <div className="fixed right-0 top-0 w-[380px] h-full bg-background border-l p-4">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">Todo Details</h2>

        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3 text-sm">
        <p>{todo.todo_description}</p>
        <p>
          {todo.due_date} {todo.due_time}
        </p>
        <p>Status: {todo.status}</p>
        <p>{todo.remarks || "-"}</p>
      </div>
    </div>
  );
}

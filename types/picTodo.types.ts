// types/pic-todo.types.ts

export interface PicTodo {
  todo_id: string;
  pic_id: string;
  inq_id: string;
  todo_description: string;
  due_date: string;
  due_time: string;
  remarks: string;
  status: "pending" | "completed";
}

export interface CreatePicTodoRequest {
  pic_id: string;
  inq_id: string;
  todo_description: string;
  due_date: string;
  due_time: string;
  remarks?: string;
}

export interface UpdatePicTodoRequest {
  todo_description?: string;
  due_date?: string;
  due_time?: string;
  remarks?: string;
}

export interface UpdateTodoStatusRequest {
  status: "pending" | "completed";
}
export interface PicTodo {
  todo_id: string;
  pic_id: string;
  inq_id: string;
  todo_description: string;
  due_date: string; // YYYY-MM-DD
  due_time: string; // HH:mm
  remarks: string | null;
  status: "pending" | "completed";
}

/* ================= REQUEST TYPES ================= */

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

export interface UpdatePicTodoStatusRequest {
  status: "pending" | "completed";
}

/* ================= RESPONSE TYPES ================= */

export interface PicTodoListResponse {
  success: boolean;
  message: string;
  data: PicTodo[];
}

export interface PicTodoSingleResponse {
  success: boolean;
  message: string;
  data: PicTodo;
}

export interface PicTodoActionResponse {
  success: boolean;
  message: string;
  data: PicTodo;
}
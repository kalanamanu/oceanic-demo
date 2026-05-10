// services/pic-todo.service.ts

import apiClient from "@/lib/api-client";
import type {
  PicTodo,
  CreatePicTodoRequest,
  UpdatePicTodoRequest,
  UpdateTodoStatusRequest,
} from "@/types/picTodo.types";

export class PicTodoService {
  /* =========================
     CREATE TODO
  ========================= */
  static async createTodo(
    payload: CreatePicTodoRequest
  ): Promise<PicTodo> {
    const res = await apiClient.post("/api/pic-todo", payload);
    return res.data.data;
  }

  /* =========================
     GET TODOS BY PIC
  ========================= */
  static async getTodosByPic(
    pic_id: string
  ): Promise<PicTodo[]> {
    const res = await apiClient.get(
      `/api/picTodo/pic/${pic_id}`
    );
    return res.data.data;
  }

  /* =========================
     GET TODOS BY INQUIRY
  ========================= */
  static async getTodosByInquiry(
    inq_id: string
  ): Promise<PicTodo[]> {
    const res = await apiClient.get(
      `/api/pic-todo/inquiry/${inq_id}`
    );
    return res.data.data;
  }

  /* =========================
     UPDATE TODO (FULL)
  ========================= */
  static async updateTodo(
    todo_id: string,
    payload: UpdatePicTodoRequest
  ): Promise<PicTodo> {
    const res = await apiClient.put(
      `/api/pic-todo/${todo_id}`,
      payload
    );
    return res.data.data;
  }

  /* =========================
     UPDATE STATUS ONLY
  ========================= */
  static async updateTodoStatus(
    todo_id: string,
    payload: UpdateTodoStatusRequest
  ): Promise<PicTodo> {
    const res = await apiClient.patch(
      `/api/pic-todo/${todo_id}/status`,
      payload
    );
    return res.data.data;
  }

  /* =========================
     DELETE TODO
  ========================= */
  static async deleteTodo(todo_id: string): Promise<void> {
    await apiClient.delete(`/api/pic-todo/${todo_id}`);
  }
}
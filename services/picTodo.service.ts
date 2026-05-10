import apiClient from "@/lib/api-client";
import type {
  PicTodo,
  PicTodoListResponse,
  PicTodoSingleResponse,
  PicTodoActionResponse,
  CreatePicTodoRequest,
  UpdatePicTodoRequest,
  UpdatePicTodoStatusRequest,
} from "@/types/picTodo.types";

export class PicTodoService {
  /* ================= CREATE ================= */
  static async createTodo(
    payload: CreatePicTodoRequest,
  ): Promise<PicTodo> {
    try {
      const res = await apiClient.post<PicTodoActionResponse>(
        "/api/picTodo",
        payload,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to create todo",
      );
    }
  }

  /* ================= GET BY PIC ================= */
  static async getTodosByPic(pic_id: string): Promise<PicTodo[]> {
    try {
      const res = await apiClient.get<PicTodoListResponse>(
        `/api/picTodo/pic/${pic_id}`,
      );

      return res.data.data;
    } catch {
      throw new Error("Failed to fetch PIC todos");
    }
  }

  /* ================= GET BY INQUIRY ================= */
  static async getTodosByInquiry(inq_id: string): Promise<PicTodo[]> {
    try {
      const res = await apiClient.get<PicTodoListResponse>(
        `/api/picTodo/inquiry/${inq_id}`,
      );

      return res.data.data;
    } catch {
      throw new Error("Failed to fetch inquiry todos");
    }
  }

  /* ================= UPDATE FULL TODO ================= */
  static async updateTodo(
    todo_id: string,
    payload: UpdatePicTodoRequest,
  ): Promise<PicTodo> {
    try {
      const res = await apiClient.put<PicTodoActionResponse>(
        `/api/picTodo/${todo_id}`,
        payload,
      );

      return res.data.data;
    } catch {
      throw new Error("Failed to update todo");
    }
  }

  /* ================= UPDATE STATUS ================= */
  static async updateTodoStatus(
    todo_id: string,
    payload: UpdatePicTodoStatusRequest,
  ): Promise<PicTodo> {
    try {
      const res = await apiClient.patch<PicTodoActionResponse>(
        `/api/picTodo/${todo_id}/status`,
        payload,
      );

      return res.data.data;
    } catch {
      throw new Error("Failed to update todo status");
    }
  }

  /* ================= DELETE ================= */
  static async deleteTodo(todo_id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/picTodo/${todo_id}`);
    } catch {
      throw new Error("Failed to delete todo");
    }
  }
}
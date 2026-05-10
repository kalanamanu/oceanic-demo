import apiClient from "@/lib/api-client";

import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryListResponse,
  CategorySingleResponse,
  CategoryActionResponse,
} from "@/types/category.types";

export class CategoryService {
  /* ================= GET ALL CATEGORIES ================= */
  static async getAllCategories(): Promise<Category[]> {
    try {
      const res = await apiClient.get<CategoryListResponse>(
        "/api/category",
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch categories",
      );
    }
  }

  /* ================= GET CATEGORY BY ID ================= */
  static async getCategoryById(id: string): Promise<Category> {
    try {
      const res = await apiClient.get<CategorySingleResponse>(
        `/api/category/${id}`,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch category",
      );
    }
  }

  /* ================= CREATE CATEGORY ================= */
  static async createCategory(
    payload: CreateCategoryRequest,
  ): Promise<Category> {
    try {
      const res = await apiClient.post<CategoryActionResponse>(
        "/api/category",
        payload,
      );

      return res.data.data!;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to create category",
      );
    }
  }

  /* ================= UPDATE CATEGORY ================= */
  static async updateCategory(
    id: string,
    payload: UpdateCategoryRequest,
  ): Promise<Category> {
    try {
      const res = await apiClient.patch<CategoryActionResponse>(
        `/api/category/${id}`,
        payload,
      );

      return res.data.data!;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to update category",
      );
    }
  }

  /* ================= DELETE CATEGORY ================= */
  static async deleteCategory(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/category/${id}`);
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to delete category",
      );
    }
  }
}
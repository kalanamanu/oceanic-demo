export interface Category {
  cte_id: string;
  cte_name: string;
  color: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

/* ================= REQUEST TYPES ================= */

export interface CreateCategoryRequest {
  cte_name: string;
  color: string;
  type: string;
}

export interface UpdateCategoryRequest {
  cte_name?: string;
  color?: string;
  type?: string;
}

/* ================= API RESPONSES ================= */

export interface CategoryListResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface CategorySingleResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CategoryActionResponse {
  success: boolean;
  message: string;
  data?: Category;
}
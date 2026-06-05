import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/user.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface UsersPagination {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface PaginatedUsersResponse {
  success: boolean;
  data: User[];
  pagination: UsersPagination;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export class UserService {
  private static getFetchOptions(
    method: string,
    body?: unknown,
  ): RequestInit {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return options;
  }

  private static async handleResponse<T>(
    response: Response,
  ): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }

      const error = await response
        .json()
        .catch(() => ({}));

      throw new Error(
        error.message || "Request failed",
      );
    }

    return response.json();
  }

  /**
   * Create User
   */
  static async createUser(
    userData: CreateUserRequest,
  ): Promise<User> {
    const response = await fetch(
      `${API_BASE_URL}/api/user`,
      this.getFetchOptions("POST", userData),
    );

    const result =
      await this.handleResponse<ApiResponse<User>>(
        response,
      );

    return result.data;
  }

  /**
   * Get All Users
   */
  static async getAllUsers(
    params?: PaginationParams,
  ): Promise<PaginatedUsersResponse> {
    const { page = 1, pageSize = 20 } =
      params || {};

    const url = new URL(
      `${API_BASE_URL}/api/user`,
    );

    url.searchParams.append(
      "page",
      page.toString(),
    );

    url.searchParams.append(
      "pageSize",
      pageSize.toString(),
    );

    const response = await fetch(
      url.toString(),
      this.getFetchOptions("GET"),
    );

    return this.handleResponse<PaginatedUsersResponse>(
      response,
    );
  }

  /**
   * Get User By ID
   */
  static async getUserById(
    id: string,
  ): Promise<User> {
    const response = await fetch(
      `${API_BASE_URL}/api/user/${id}`,
      this.getFetchOptions("GET"),
    );

    const result =
      await this.handleResponse<ApiResponse<User>>(
        response,
      );

    return result.data;
  }

  /**
   * Update User
   */
  static async updateUser(
    userData: UpdateUserRequest,
  ): Promise<User> {
    const { id, ...payload } = userData;

    const response = await fetch(
      `${API_BASE_URL}/api/user/${id}`,
      this.getFetchOptions("PATCH", payload),
    );

    const result =
      await this.handleResponse<ApiResponse<User>>(
        response,
      );

    return result.data;
  }

  /**
   * Delete User
   */
  static async deleteUser(
    id: string,
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/user/${id}`,
      this.getFetchOptions("DELETE"),
    );

    await this.handleResponse(response);
  }
}
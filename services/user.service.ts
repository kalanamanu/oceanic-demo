import { User, CreateUserRequest, UpdateUserRequest } from "@/types/user.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class UserService {
  /**
   * Get common headers and options for fetch
   */
  private static getFetchOptions(method: string, body?: any): RequestInit {
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

  /**
   * Create a new user
   */
  static async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(
      `${API_BASE_URL}/api/user`,
      this.getFetchOptions("POST", userData)
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create user");
    }

    const result: ApiResponse<User> = await response.json();
    return result.data;
  }

  /**
   * Get all users with pagination
   */
  static async getAllUsers(
    params?: PaginationParams
  ): Promise<PaginatedResponse<User>> {
    const { page = 1, pageSize = 20 } = params || {};
    
    const url = new URL(`${API_BASE_URL}/api/user`);
    url.searchParams.append("page", page.toString());
    if (pageSize !== 20) {
      url.searchParams.append("pageSize", pageSize.toString());
    }

    const response = await fetch(
      url.toString(),
      this.getFetchOptions("GET")
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      throw new Error("Failed to fetch users");
    }

    const result: PaginatedResponse<User> = await response.json();
    return result;
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User> {
    const response = await fetch(
      `${API_BASE_URL}/api/user/${id}`,
      this.getFetchOptions("GET")
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      throw new Error("Failed to fetch user");
    }

    const result: ApiResponse<User> = await response.json();
    return result.data;
  }

  /**
   * Update user (PATCH method as per API)
   */
  static async updateUser(userData: UpdateUserRequest): Promise<User> {
    const { id, ...updateData } = userData;
    
    const response = await fetch(
      `${API_BASE_URL}/api/user/${id}`,
      this.getFetchOptions("PATCH", updateData)
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update user");
    }

    const result: ApiResponse<User> = await response.json();
    return result.data;
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/user/${id}`,
      this.getFetchOptions("DELETE")
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to delete user");
    }
  }
}
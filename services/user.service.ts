import { User, CreateUserRequest, UpdateUserRequest } from "@/types/user.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add auth token if needed:
        // "Authorization": `Bearer ${getToken()}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create user");
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get all users (when API is ready)
   */
  static async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get user by ID (when API is ready)
   */
  static async getUserById(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Update user (when API is ready)
   */
  static async updateUser(userData: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/${userData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update user");
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Delete user (when API is ready)
   */
  static async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
  }
}
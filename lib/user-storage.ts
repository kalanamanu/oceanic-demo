import type { UserData } from "@/types/auth.types";

const USER_DATA_KEY = "user_data";

export class UserStorage {
  /**
   * Save FULL user object (JWT + profile + metadata)
   */
  static saveUser(userData: any): void {
    try {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  }

  /**
   * Get FULL user object
   */
  static getUser(): any | null {
    try {
      const data = localStorage.getItem(USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to retrieve user data:", error);
      return null;
    }
  }

  /**
   * Update ONLY part of user (safe merge)
   */
  static updateUser(patch: any): void {
    try {
      const current = this.getUser();

      if (!current) return;

      const updated = {
        ...current,
        ...patch,
        profile: {
          ...current.profile,
          ...patch.profile,
        },
      };

      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  }

  /**
   * Clear user data
   */
  static clearUser(): void {
    try {
      localStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error("Failed to clear user data:", error);
    }
  }

  /**
   * Check authentication
   */
  static isAuthenticated(): boolean {
    return this.getUser() !== null;
  }

  /**
   * Get full name
   */
  static getUserFullName(): string {
    const user = this.getUser();
    return user ? `${user.firstName} ${user.lastName}` : "";
  }

  /**
   * Get account type
   */
  static getUserAccountType(): string | null {
    const user = this.getUser();
    return user?.accountType || null;
  }

  /**
   * Get profile safely
   */
  static getProfile(): any | null {
    const user = this.getUser();
    return user?.profile || null;
  }
}
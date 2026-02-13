import type { UserData } from '@/types/auth.types';

const USER_DATA_KEY = 'user_data';

export class UserStorage {
  /**
   * Save user data to localStorage
   */
  static saveUser(userData: UserData): void {
    try {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }

  /**
   * Get user data from localStorage
   */
  static getUser(): UserData | null {
    try {
      const data = localStorage.getItem(USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  }

  /**
   * Clear user data from localStorage
   */
  static clearUser(): void {
    try {
      localStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  /**
   * Check if user is authenticated (has user data)
   */
  static isAuthenticated(): boolean {
    return this.getUser() !== null;
  }

  /**
   * Get user's full name
   */
  static getUserFullName(): string {
    const user = this.getUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  /**
   * Get user's account type
   */
  static getUserAccountType(): UserData['accountType'] | null {
    const user = this.getUser();
    return user?.accountType || null;
  }
}
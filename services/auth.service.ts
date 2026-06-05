import apiClient from '@/lib/api-client';
import { UserStorage } from '@/lib/user-storage';
import type {
  RequestOTPRequest,
  RequestOTPResponse,
  VerifyOTPRequest,
  LoginResponse,
  LogoutResponse,
  APIError,
} from '@/types/auth.types';
import type { UserData } from "@/types/auth.types";

export class AuthService {
  /**
   * Request OTP for login
   */
  static async requestOTP(data: RequestOTPRequest): Promise<RequestOTPResponse> {
    try {
      const response = await apiClient.post<RequestOTPResponse>(
        '/api/auth/req-otp',
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Verify OTP and complete login
   * Token is automatically stored in HttpOnly cookie by backend
   */
  static async verifyOTP(data: VerifyOTPRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/api/auth/login', 
        data
      );

      // Store user data in localStorage (token is in HttpOnly cookie)
      if (response.data.success && response.data.data) {
        UserStorage.saveUser(response.data.data);
      }

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Check authentication status and get current user from backend
   * This validates the session with the server
   */
static async checkAuth(): Promise<any> {
  try {
    const response = await apiClient.get('/api/auth/me');

    if (response.data?.authenticated && response.data?.user) {
      UserStorage.saveUser(response.data.user);
      return response.data.user;
    }

    return UserStorage.getUser();
  } catch (error: any) {
    const status = error?.response?.status;

    // retry once
    if (status === 401) {
      try {
        const retry = await apiClient.get('/api/auth/me');

        if (retry.data?.user) {
          return retry.data.user;
        }
      } catch {}

      UserStorage.clearUser();
      return null;
    }

    return UserStorage.getUser();
  }
}

  /**
   * Logout user - clears cookie and user data
   */
  static async logout(): Promise<void> {
    try {
      // Call backend to clear cookie
      await apiClient.post<LogoutResponse>('/api/auth/logout');
      
      // Clear user data from localStorage
      UserStorage.clearUser();
    } catch (error: any) {
      // Clear local data even if API call fails
      UserStorage.clearUser();
      throw this.handleError(error);
    }
  }

  /**
   * Get current user from localStorage (cached)
   */
  static getCurrentUser(): UserData | null {
    if (typeof window === "undefined") return null;

    try {
      const data = localStorage.getItem("user_data");
      if (!data) return null;

      return JSON.parse(data);
    } catch (err) {
      console.error("Failed to parse user_data", err);
      return null;
    }
  }

  /**
   * Check if user is authenticated (from localStorage)
   * Note: This checks local storage only. Use checkAuth() for server validation.
   */
  static isAuthenticated(): boolean {
    return UserStorage.isAuthenticated();
  }

  /**
   * Centralized error handling
   */
  private static handleError(error: any): Error {
    if (error.response) {
      // Server responded with error
      const apiError: APIError = error.response.data;
      return new Error(apiError.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server. Please check your connection or Contact IT support.');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred. Please contact IT support');
    }
  }
}
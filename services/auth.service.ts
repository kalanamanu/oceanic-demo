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

export class AuthService {
  /**
   * Step 1: Request OTP for login
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
   * Step 2: Verify OTP and complete login
   * Token is automatically stored in HttpOnly cookie by backend
   */
  static async verifyOTP(data: VerifyOTPRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/api/auth/login', // ✅ Correct endpoint from backend
        data
      );

      // Store user data in localStorage (not token - it's in HttpOnly cookie)
      if (response.data.success && response.data.data) {
        UserStorage.saveUser(response.data.data);
      }

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
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
   * Get current user from localStorage
   */
  static getCurrentUser() {
    return UserStorage.getUser();
  }

  /**
   * Check if user is authenticated
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
      return new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}
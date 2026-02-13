import apiClient from '@/lib/api-client';
import type {
  RequestOTPRequest,
  RequestOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  APIError,
} from '@/types/auth.types';

export class AuthService {
  /**
   * Request OTP for login
   */
  static async requestOTP(
    data: RequestOTPRequest
  ): Promise<RequestOTPResponse> {
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
   */
  static async verifyOTP(
    data: VerifyOTPRequest
  ): Promise<VerifyOTPResponse> {
    try {
      const response = await apiClient.post<VerifyOTPResponse>(
        '/api/auth/verify-otp',
        data
      );
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    // Call logout endpoint if needed
    // await apiClient.post('/api/auth/logout');
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
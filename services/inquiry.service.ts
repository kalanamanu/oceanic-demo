import apiClient from '@/lib/api-client';
import type {
  Inquiry,
  CreateInquiryRequest,
  UpdateInquiryRequest,
  PaginatedInquiriesResponse,
  InquiryResponse,
} from '@/types/inquiry.types';

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export class InquiryService {
  /**
   * Create a new inquiry
   */
  static async createInquiry(data: CreateInquiryRequest): Promise<Inquiry> {
    try {
      const response = await apiClient.post<InquiryResponse>(
        '/api/inquiry',
        data
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all inquiries with pagination
   */
  static async getAllInquiries(
    params?: PaginationParams
  ): Promise<PaginatedInquiriesResponse> {
    try {
      const { page = 1, pageSize = 20 } = params || {};
      
      const response = await apiClient.get<PaginatedInquiriesResponse>(
        '/api/inquiry',
        {
          params: { page, pageSize },
        }
      );
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get inquiry by ID
   */
  static async getInquiryById(id: string): Promise<Inquiry> {
    try {
      const response = await apiClient.get<InquiryResponse>(
        `/api/inquiry/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Update inquiry
   */
  static async updateInquiry(data: UpdateInquiryRequest): Promise<Inquiry> {
    try {
      const { id, ...updateData } = data;
      
      const response = await apiClient.patch<InquiryResponse>(
        `/api/inquiry/${id}`,
        updateData
      );
      
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete inquiry
   */
  static async deleteInquiry(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/inquiry/${id}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Centralized error handling
   */
  private static handleError(error: any): Error {
    if (error.response) {
      const apiError = error.response.data;
      return new Error(apiError.message || 'An error occurred');
    } else if (error.request) {
      return new Error('No response from server. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred.');
    }
  }
}
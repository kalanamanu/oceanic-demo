import apiClient from '@/lib/api-client';
import type {
  InquiryRemark,
  CreateInquiryRemarkRequest,
  UpdateInquiryRemarkRequest,
  InquiryRemarkResponse,
  InquiryRemarksResponse,
} from '@/types/inquiry.types';

export class InquiryRemarkService {
  /**
   * Create a new inquiry remark
   */
  static async createRemark(data: CreateInquiryRemarkRequest): Promise<InquiryRemark> {
    try {
      const response = await apiClient.post<InquiryRemarkResponse>(
        '/api/inquiry-remarks',
        data
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get remarks by inquiry ID
   */
  static async getRemarksByInquiryId(inqId: string): Promise<InquiryRemark[]> {
    try {
      const response = await apiClient.get<InquiryRemarksResponse>(
        `/api/inquiry-remarks/${inqId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a remark by ID
   */
  static async updateRemark(remarkId: string, data: UpdateInquiryRemarkRequest): Promise<InquiryRemark> {
    try {
      const response = await apiClient.put<InquiryRemarkResponse>(
        `/api/inquiry-remarks/${remarkId}`,
        data
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a remark by ID
   */
  static async deleteRemark(remarkId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/inquiry-remarks/${remarkId}`);
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

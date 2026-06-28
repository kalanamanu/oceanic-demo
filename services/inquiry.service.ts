import apiClient from "@/lib/api-client";
import type {
  Inquiry,
  CreateInquiryRequest,
  UpdateInquiryRequest,
  PaginatedInquiriesResponse,
  InquiryResponse,
   InquiryDeadlineResponse,
} from "@/types/inquiry.types";

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export class InquiryService {
  static async createInquiry(
    data: CreateInquiryRequest,
  ): Promise<Inquiry> {
    try {
      const response = await apiClient.post<InquiryResponse>(
        "/api/inquiry",
        data,
      );

      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async getAllInquiries(
    params?: PaginationParams,
  ): Promise<PaginatedInquiriesResponse> {
    try {
      const { page = 1, pageSize = 20 } = params || {};

      const response = await apiClient.get<PaginatedInquiriesResponse>(
        "/api/inquiry",
        {
          params: { page, pageSize },
        },
      );

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async getInquiryById(id: string): Promise<Inquiry> {
    try {
      const response = await apiClient.get<InquiryResponse>(
        `/api/inquiry/${id}`,
      );

      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async updateInquiry(
    data: UpdateInquiryRequest,
  ): Promise<Inquiry> {
    try {
      const { id, ...updateData } = data;

      const response = await apiClient.put<InquiryResponse>(
        `/api/inquiry/${id}`,
        updateData,
      );

      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async deleteInquiry(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/inquiry/${id}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async updateInquiryStatus(
    id: string,
    status: string,
  ): Promise<Inquiry> {
    try {
      const response = await apiClient.patch<InquiryResponse>(
        `/api/inquiry/${id}/status`,
        { status },
      );

      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: any): Error {
    if (error.response) {
      const apiError = error.response.data;
      return new Error(apiError?.message || "An error occurred");
    }

    if (error.request) {
      return new Error(
        "No response from server. Please check your connection.",
      );
    }

    return new Error(
      error.message || "An unexpected error occurred.",
    );
  }

  static async getInquiryDeadline(): Promise<string> {
  try {
    const response = await apiClient.get<InquiryDeadlineResponse>(
      "/api/inquiry/deadline",
    );

    return response.data.data.deadline;
  } catch (error: any) {
    throw this.handleError(error);
  }
}
}
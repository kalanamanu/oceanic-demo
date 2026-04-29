import apiClient from "@/lib/api-client";
import type {
  ExcelValidationResponse,
  QuotationItem,
  CreateQuotationRequest,
  CreateQuotationResponse,
} from "@/types/quotation.types";

export class QuotationService {
  /**
   * Download Excel Template
   */
  static async downloadTemplate(): Promise<Blob> {
    try {
      const response = await apiClient.get(
        "/api/customer-excel/template",
        {
          responseType: "blob", // IMPORTANT for file download
        }
      );

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate Uploaded Excel File
   */
  static async validateExcel(file: File): Promise<QuotationItem[]> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post<ExcelValidationResponse>(
        "/api/customer-excel/validate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Map backend → frontend model
      const mapped: QuotationItem[] = response.data.data.map((item) => ({
        // ===== backend fields =====
        item_no: item.item_no,
        description: item.description,
        customer_remark: item.customer_remark,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        impa_code: item.impa_code,
        osc_remark: item.osc_remark,

        // ===== frontend fields =====
        supplier_name: "",
        additional_charges: "",
        total_unit_rate_rs: "",
        total_rs: "",
        conva_basis: "",
        total_usd: "",
      }));

      return mapped;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit Final Quotation (Future Use)
   */
  static async createQuotation(
    data: CreateQuotationRequest
  ): Promise<CreateQuotationResponse> {
    try {
      const response = await apiClient.post<CreateQuotationResponse>(
        "/api/quotation",
        data
      );

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Centralized Error Handling
   */
  private static handleError(error: any): Error {
    if (error.response) {
      const apiError = error.response.data;
      return new Error(apiError.message || "An error occurred");
    } else if (error.request) {
      return new Error(
        "No response from server. Please check your connection."
      );
    } else {
      return new Error(error.message || "An unexpected error occurred.");
    }
  }
}
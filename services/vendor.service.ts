import apiClient from "@/lib/api-client";
import type {
  Vendor,
  CreateVendorRequest,
  UpdateVendorRequest,
  VendorListResponse,
  VendorSingleResponse,
  VendorActionResponse,
  VendorStatus,
  VendorPIC,
  VendorCategory,
  VendorDocument,
  CreateVendorDocumentRequest,
} from "@/types/vendor.types";

export class VendorService {
  /* ==============================
     VENDOR CORE
  ============================== */

  static async getAllVendors(): Promise<Vendor[]> {
    try {
      const res = await apiClient.get<VendorListResponse>("/api/vendor");
      return res.data.data;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Failed to fetch vendors");
    }
  }

  static async getVendorById(id: string): Promise<Vendor> {
    try {
      const res = await apiClient.get<VendorSingleResponse>(`/api/vendor/${id}`);
      return res.data.data;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Failed to fetch vendor");
    }
  }

  static async createVendor(payload: CreateVendorRequest): Promise<{ vendor_id: string }> {
    try {
      const res = await apiClient.post<VendorActionResponse>("/api/vendor", payload);
      return { vendor_id: res.data.vendor_id! };
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Failed to create vendor");
    }
  }

  static async updateVendor(id: string, payload: UpdateVendorRequest): Promise<void> {
    try {
      await apiClient.put(`/api/vendor/${id}`, payload);
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Failed to update vendor");
    }
  }

  static async deleteVendor(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/vendor/${id}`);
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Failed to delete vendor");
    }
  }

  /* ==============================
     STATUS
  ============================== */

  static async getVendorStatus(id: string): Promise<VendorStatus> {
    try {
      const res = await apiClient.get<{ data: VendorStatus }>(
        `/api/vendor/${id}/status`,
      );
      return res.data.data;
    } catch {
      throw new Error("Failed to fetch vendor status");
    }
  }

  static async updateVendorStatus(
    id: string,
    payload: {
      is_md_approved: boolean;
      is_manager_approved: boolean;
    },
  ): Promise<void> {
    try {
      await apiClient.patch(`/api/vendor/${id}/status`, payload);
    } catch {
      throw new Error("Failed to update vendor status");
    }
  }

  /* ==============================
     RELATIONS
  ============================== */

  static async getVendorPICs(id: string): Promise<VendorPIC[]> {
    try {
      const res = await apiClient.get<{ data: VendorPIC[] }>(
        `/api/vendor/${id}/pics`,
      );
      return res.data.data;
    } catch {
      throw new Error("Failed to fetch vendor PICs");
    }
  }

  static async getVendorCategories(id: string): Promise<VendorCategory[]> {
    try {
      const res = await apiClient.get<{ data: VendorCategory[] }>(
        `/api/vendor/${id}/categories`,
      );
      return res.data.data;
    } catch {
      throw new Error("Failed to fetch vendor categories");
    }
  }

  static async getVendorsByCategory(categoryId: string): Promise<Vendor[]> {
    try {
      const res = await apiClient.get<{ data: Vendor[] }>(
        `/api/vendor/category/${categoryId}`,
      );
      return res.data.data;
    } catch {
      throw new Error("Failed to fetch vendors by category");
    }
  }

  /* ==============================
     DOCUMENTS (NEW)
  ============================== */

  // Get all documents (optionally filter)
  static async getVendorDocuments(params?: {
    vendor_id?: string;
    document_type?: string;
  }): Promise<VendorDocument[]> {
    try {
      const res = await apiClient.get<{
        data: VendorDocument[];
      }>("/api/vendor/documents", { params });

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch documents",
      );
    }
  }

  // Get single document
  static async getVendorDocumentById(
    documentId: string,
  ): Promise<VendorDocument> {
    try {
      const res = await apiClient.get<{ data: VendorDocument }>(
        `/api/vendor/documents/${documentId}`,
      );
      return res.data.data;
    } catch {
      throw new Error("Failed to fetch document");
    }
  }

  // Create document
  static async createVendorDocument(
    payload: CreateVendorDocumentRequest,
  ): Promise<{ document_id: string }> {
    try {
      const res = await apiClient.post<{
        document_id: string;
      }>("/api/vendor/documents", payload);

      return { document_id: res.data.document_id };
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to create document",
      );
    }
  }

  // Update document
  static async updateVendorDocument(
    documentId: string,
    payload: Partial<CreateVendorDocumentRequest>,
  ): Promise<void> {
    try {
      await apiClient.put(`/api/vendor/documents/${documentId}`, payload);
    } catch {
      throw new Error("Failed to update document");
    }
  }

  // Delete document
  static async deleteVendorDocument(documentId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/vendor/documents/${documentId}`);
    } catch {
      throw new Error("Failed to delete document");
    }
  }
}
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
} from "@/types/vendor.types";

// ==============================
// Vendor Service
// ==============================

export class VendorService {
  // ------------------------------
  // Get all vendors
  // ------------------------------
  static async getAllVendors(): Promise<Vendor[]> {
    try {
      const res = await apiClient.get<VendorListResponse>("/api/vendor");
      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch vendors",
      );
    }
  }

  // ------------------------------
  // Get vendor by ID
  // ------------------------------
  static async getVendorById(id: string): Promise<Vendor> {
    try {
      const res = await apiClient.get<VendorSingleResponse>(
        `/api/vendor/${id}`,
      );
      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch vendor",
      );
    }
  }

  // ------------------------------
  // Create vendor
  // ------------------------------
  static async createVendor(
    payload: CreateVendorRequest,
  ): Promise<{ vendor_id: string }> {
    try {
      const res = await apiClient.post<VendorActionResponse>(
        "/api/vendor",
        payload,
      );

      return {
        vendor_id: res.data.vendor_id!,
      };
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to create vendor",
      );
    }
  }

  // ------------------------------
  // Update vendor
  // ------------------------------
  static async updateVendor(
    id: string,
    payload: UpdateVendorRequest,
  ): Promise<void> {
    try {
      await apiClient.put(`/api/vendor/${id}`, payload);
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to update vendor",
      );
    }
  }

  // ------------------------------
  // Delete vendor
  // ------------------------------
  static async deleteVendor(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/vendor/${id}`);
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to delete vendor",
      );
    }
  }

  // ------------------------------
  // Get vendor status
  // ------------------------------
  static async getVendorStatus(id: string): Promise<VendorStatus> {
    try {
      const res = await apiClient.get<{ data: VendorStatus }>(
        `/api/vendor/${id}/status`,
      );
      return res.data.data;
    } catch (err: any) {
      throw new Error("Failed to fetch vendor status");
    }
  }

  // ------------------------------
  // Update vendor status
  // ------------------------------
  static async updateVendorStatus(
    id: string,
    payload: {
      is_md_approved: boolean;
      is_manager_approved: boolean;
    },
  ): Promise<void> {
    try {
      await apiClient.patch(`/api/vendor/${id}/status`, payload);
    } catch (err: any) {
      throw new Error("Failed to update vendor status");
    }
  }

  // ------------------------------
  // Get vendor PICs
  // ------------------------------
  static async getVendorPICs(id: string): Promise<VendorPIC[]> {
    try {
      const res = await apiClient.get<{ data: VendorPIC[] }>(
        `/api/vendor/${id}/pics`,
      );
      return res.data.data;
    } catch (err: any) {
      throw new Error("Failed to fetch vendor PICs");
    }
  }

  // ------------------------------
  // Get vendor categories
  // ------------------------------
  static async getVendorCategories(id: string): Promise<VendorCategory[]> {
    try {
      const res = await apiClient.get<{ data: VendorCategory[] }>(
        `/api/vendor/${id}/categories`,
      );
      return res.data.data;
    } catch (err: any) {
      throw new Error("Failed to fetch vendor categories");
    }
  }

  // ------------------------------
  // Get vendors by category
  // ------------------------------
  static async getVendorsByCategory(categoryId: string): Promise<Vendor[]> {
    try {
      const res = await apiClient.get<{ data: Vendor[] }>(
        `/api/vendor/category/${categoryId}`,
      );
      return res.data.data;
    } catch (err: any) {
      throw new Error("Failed to fetch vendors by category");
    }
  }
}
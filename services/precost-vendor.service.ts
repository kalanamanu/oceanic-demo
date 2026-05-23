import apiClient from "@/lib/api-client";

import type {
  GetPreCostVendorsResponse,
  GetPreCostVendorItemsResponse,
  PreCostVendor,
  PreCostVendorItem,
} from "@/types/precost-vendor.types";

export class PreCostVendorService {
  /* ================= GET ALL VENDORS FOR PRE COST ================= */

  static async getVendorsByPreCostId(
    preCostId: string,
  ): Promise<PreCostVendor[]> {
    try {
      const res = await apiClient.get<GetPreCostVendorsResponse>(
        `/api/precost-vendor/${preCostId}/vendors`,
      );

      return res.data?.data || [];
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to fetch vendors",
      );
    }
  }

  /* ================= GET VENDOR ITEMS ================= */

  static async getVendorItems(
    preCostId: string,
    vendorId: string,
  ): Promise<PreCostVendorItem[]> {
    try {
      const res =
        await apiClient.get<GetPreCostVendorItemsResponse>(
          `/api/precost-vendor/${preCostId}/vendor/${vendorId}/items`,
        );

      return res.data?.data || [];
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to fetch vendor items",
      );
    }
  }
}
import apiClient from "@/lib/api-client";

export interface Vendor {
  id: string;
  name: string;
}

export class VendorService {
  static async getAllVendors(): Promise<Vendor[]> {
    try {
      const res = await apiClient.get("/api/vendor");
      return res.data.data || res.data;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Failed to fetch vendors");
    }
  }
}
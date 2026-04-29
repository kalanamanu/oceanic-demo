import apiClient from "@/lib/api-client";
import type { BasisListResponse, Basis } from "@/types/basis.types";

export class BasisService {
  static async getBasis(): Promise<Basis> {
    try {
      const res = await apiClient.get<BasisListResponse>("/api/basis");
      return res.data.data.basisList[0]; // active basis
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch basis",
      );
    }
  }
}
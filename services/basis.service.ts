import apiClient from "@/lib/api-client";

import type {
  Basis,
  BasisListResponse,
  CreateBasisRequest,
  CreateBasisResponse,
} from "@/types/basis.types";

export class BasisService {
  /* ================= GET ALL BASIS ================= */
  static async getAllBasis(): Promise<Basis[]> {
    try {
      const res = await apiClient.get<BasisListResponse>("/api/basis");

      return res.data.data.basisList;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch basis",
      );
    }
  }

  /* ================= GET ACTIVE BASIS ================= */
  static async getActiveBasis(): Promise<Basis | null> {
    try {
      const res = await apiClient.get<BasisListResponse>("/api/basis");

      const list = res.data.data.basisList;

      return list.find((b) => b.is_active) || null;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch active basis",
      );
    }
  }

  /* ================= CREATE BASIS ================= */
  static async createBasis(
    payload: CreateBasisRequest,
  ): Promise<Basis> {
    try {
      const res = await apiClient.post<CreateBasisResponse>(
        "/api/basis",
        payload,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to create basis",
      );
    }
  }
}
import apiClient from "@/lib/api-client";

import type {
  MarginListResponse,
  CreateMarginRequest,
  CreateMarginResponse,
} from "@/types/margin.types";

import type {
  CreateUSDRateRequest,
  CreateUSDRateResponse,
  LatestUSDRateResponse,
  USDRateHistoryResponse,
} from "@/types/usd-rate.types";

import type {
  BasisCalculationResponse,
  BasisCalculation
} from "@/types/basis.types";

export class BasisService {
  /* ================= MARGINS ================= */

  static async getAllMargins(): Promise<MarginListResponse["data"]["basisList"]> {
    try {
      const res = await apiClient.get<MarginListResponse>(
        "api/basis/margins",
      );

      return res.data.data.basisList;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch margins",
      );
    }
  }

  static async createMargin(
    payload: CreateMarginRequest,
  ): Promise<CreateMarginResponse["data"]> {
    try {
      const res = await apiClient.post<CreateMarginResponse>(
        "api/basis/margins",
        payload,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to create margin",
      );
    }
  }

  /* ================= USD RATE ================= */

  static async createUSDRate(
    payload: CreateUSDRateRequest,
  ): Promise<CreateUSDRateResponse["data"]> {
    try {
      const res = await apiClient.post<CreateUSDRateResponse>(
        "api/basis/usdrate",
        payload,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to create USD rate",
      );
    }
  }

  static async getLatestUSDRate(): Promise<LatestUSDRateResponse["data"]> {
    try {
      const res = await apiClient.get<LatestUSDRateResponse>(
        "api/basis/usdrate/latest",
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch latest USD rate",
      );
    }
  }

  static async getUSDRateHistory(): Promise<USDRateHistoryResponse["data"]> {
    try {
      const res = await apiClient.get<USDRateHistoryResponse>(
        "api/basis/usdrate/history",
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch USD rate history",
      );
    }
  }

  /* ================= BASIS CALCULATION ================= */

 static async calculateBasis(
  marginId: number,
): Promise<BasisCalculation> {
  try {
    const res = await apiClient.get<BasisCalculationResponse>(
      `api/basis/margins/${marginId}/basis`,
    );

    const data = res.data.data;

    return {
      margin: data.margin,
      usdRate: data.usdRate,
      basis: Number(data.basis), 
    };
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || "Failed to calculate basis",
    );
  }
}
}
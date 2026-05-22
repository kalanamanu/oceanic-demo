import apiClient from "@/lib/api-client";

import type {
  ConfirmOrderResponse,
  ConfirmedOrder,
  ConfirmedOrderDetails,
  UpdateConfirmedOrderStatusPayload,
} from "@/types/confirmed-order.types";

export class ConfirmedOrderService {
  /* ================= DOWNLOAD TEMPLATE ================= */

  static async downloadTemplate(preCostId: string): Promise<Blob> {
    try {
      const res = await apiClient.get(
        `/api/precost/template/${preCostId}`,
        {
          responseType: "blob",
        },
      );

      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to download confirm template",
      );
    }
  }

  /* ================= UPLOAD & PROCESS CONFIRM ORDER ================= */

  static async confirmOrder(
    preCostId: string,
    file: File,
  ): Promise<ConfirmOrderResponse> {
    try {
      const formData = new FormData();

      formData.append("file", file);

      const res = await apiClient.post(
        `/api/precost/confirm/${preCostId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return res.data?.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to confirm order",
      );
    }
  }

  /* ================= GET ALL CONFIRMED ORDERS ================= */

  static async getAllConfirmedOrders(): Promise<ConfirmedOrder[]> {
    try {
      const res = await apiClient.get(
        "/api/precost/confirmed",
      );

      return res.data?.data || [];
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to fetch confirmed orders",
      );
    }
  }

  /* ================= GET CONFIRMED ORDER BY ID ================= */

  static async getConfirmedOrderById(
    confirmedPreCostId: string,
  ): Promise<ConfirmedOrderDetails> {
    try {
      const res = await apiClient.get(
        `/api/precost/confirmed/${confirmedPreCostId}`,
      );

      return res.data?.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to fetch confirmed order",
      );
    }
  }

  /* ================= UPDATE STATUS ================= */

  static async updateStatus(
    confirmedPreCostId: string,
    payload: UpdateConfirmedOrderStatusPayload,
  ): Promise<any> {
    try {
      const res = await apiClient.patch(
        `/api/precost/confirmed/${confirmedPreCostId}/status`,
        payload,
      );

      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to update confirmation status",
      );
    }
  }

  /* ================= DELETE CONFIRMED ORDER ================= */

  static async deleteConfirmedOrder(
    confirmedPreCostId: string,
  ): Promise<any> {
    try {
      const res = await apiClient.delete(
        `/api/precost/confirmed/${confirmedPreCostId}`,
      );

      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to delete confirmed order",
      );
    }
  }
}
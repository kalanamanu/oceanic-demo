import apiClient from "@/lib/api-client";

export class PreCostService {
  /* ================= CREATE DRAFT ================= */
  static async createDraft(): Promise<any> {
    try {
      const res = await apiClient.post("/api/precost/draft");
      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to create draft",
      );
    }
  }

  /* ================= CREATE / FINALIZE ================= */
  static async createPreCost(payload: any): Promise<any> {
    try {
      const res = await apiClient.post("/api/precost", payload);
      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to create precost",
      );
    }
  }

  /* ================= GET ALL ================= */
  static async getAllPreCosts(): Promise<any[]> {
    try {
      const res = await apiClient.get("/api/precost");

      return res.data?.data || [];
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch precosts",
      );
    }
  }

  /* ================= GET BY ID ================= */
  static async getPreCostById(id: string): Promise<any> {
    try {
      const res = await apiClient.get(`/api/precost/${id}`);

      return res.data?.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch precost",
      );
    }
  }

  /* ================= UPDATE ================= */
  static async updatePreCost(id: string, payload: any): Promise<any> {
    try {
      const res = await apiClient.put(`/api/precost/${id}`, payload);

      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to update precost",
      );
    }
  }

  /* ================= DELETE ================= */
  static async deletePreCost(id: string): Promise<any> {
    try {
      const res = await apiClient.delete(`/api/precost/${id}`);

      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to delete precost",
      );
    }
  }

  /* ================= UPDATE STATUS ================= */
  static async updateStatus(
    id: string,
    payload: {
      status: "PENDING" | "COMPLETED";
    },
  ): Promise<any> {
    try {
      const res = await apiClient.patch(
        `/api/precost/${id}/status`,
        payload,
      );

      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to update precost status",
      );
    }
  }

  /* =======================================================
     TEMP VENDOR MANAGEMENT
  ======================================================= */

  /* ================= CREATE TEMP VENDOR ================= */
  static async createTempVendor(
    precostId: string,
    payload: {
      vendor_name: string;
      contact_person: string;
      email: string;
      phone: string;
    },
  ): Promise<any> {
    try {
      const res = await apiClient.post(
        `/api/precost/${precostId}/temp-vendors`,
        payload,
      );

      return res.data?.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to create temp vendor",
      );
    }
  }

  /* ================= GET TEMP VENDORS ================= */
  static async getTempVendors(
    precostId: string,
  ): Promise<any[]> {
    try {
      const res = await apiClient.get(
        `/api/precost/${precostId}/temp-vendors`,
      );

      return res.data?.data || [];
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to fetch temp vendors",
      );
    }
  }

  /* ================= UPDATE TEMP VENDOR APPROVAL ================= */
  static async updateTempVendorApproval(
    tempVendorId: string,
    isApproved: boolean,
  ): Promise<any> {
    try {
      const res = await apiClient.patch(
        `/api/precost/temp-vendors/${tempVendorId}/approval`,
        {
          is_approved: isApproved,
        },
      );

      return res.data?.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to update temp vendor approval",
      );
    }
  }

  /* ================= UPDATE TEMP VENDOR ================= */
  static async updateTempVendor(
    tempVendorId: string,
    payload: {
      vendor_name?: string;
      contact_person?: string;
      email?: string;
      phone?: string;
      is_approved?: boolean;
    },
  ): Promise<any> {
    try {
      const res = await apiClient.put(
        `/api/precost/temp-vendors/${tempVendorId}`,
        payload,
      );

      return res.data?.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to update temp vendor",
      );
    }
  }

  /* ================= DELETE TEMP VENDOR ================= */
  static async deleteTempVendor(
    tempVendorId: string,
  ): Promise<any> {
    try {
      const res = await apiClient.delete(
        `/api/precost/temp-vendors/${tempVendorId}`,
      );

      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to delete temp vendor",
      );
    }
  }
}
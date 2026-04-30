import apiClient from "@/lib/api-client";

export class PreCostService {
  static async createDraft() {
    try {
      const res = await apiClient.post("/api/precost/draft");
      return res.data;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Failed to create draft");
    }
  }

   static async createPreCost(payload: any): Promise<any> {
    const res = await apiClient.post("/api/precost", payload);
    return res.data;
  }
}


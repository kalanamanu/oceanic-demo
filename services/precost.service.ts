import apiClient from "@/lib/api-client";

export class PreCostService {
/* ================= CREATE DRAFT ================= */
static async createDraft(): Promise<any> {
try {
const res = await apiClient.post("/api/precost/draft");
return res.data;
} catch (err: any) {
throw new Error(
err?.response?.data?.message || "Failed to create draft"
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
err?.response?.data?.message || "Failed to create precost"
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
      err?.response?.data?.message || "Failed to fetch precosts"
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
      err?.response?.data?.message || "Failed to fetch precost"
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
err?.response?.data?.message || "Failed to update precost"
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
      err?.response?.data?.message || "Failed to delete precost"
    );
  }
}

/* ================= UPDATE STATUS ================= */
static async updateStatus(
  id: string,
  payload: { status: "PENDING" | "COMPLETED" }
): Promise<any> {
  try {
    const res = await apiClient.patch(
      `/api/precost/${id}/status`,
      payload
    );
    return res.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || "Failed to update precost status"
    );
  }
}
}

// src/services/upload.service.ts

import apiClient from "@/lib/api-client";
import type {
  UploadFileResponse,
  GetSignedUrlResponse,
  UploadFileRequest
} from "@/types/upload.types";

export class UploadService {
  /* ================= UPLOAD FILE ================= */
  static async uploadFile(payload: UploadFileRequest
    
  ) {
    try {
      const formData = new FormData();
      formData.append("file", payload.file);
      formData.append("use_for", payload.useFor); 

      const res = await apiClient.post<UploadFileResponse>(
        "/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return res.data.data; 
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "File upload failed",
      );
    }
  }

  /* ================= GET SIGNED URL ================= */
  static async getFileUrl(fileId: number): Promise<string> {
    try {
      const res = await apiClient.post<GetSignedUrlResponse>(
        `/api/upload/signed-url/${fileId}`,
      );

      return res.data.data.file_url;
    } catch {
      throw new Error("Failed to get file URL");
    }
  }
}
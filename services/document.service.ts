import apiClient from "@/lib/api-client";
import {
  GenerateDocumentRequest,
  GenerateDocumentResponse,
  DocumentJobStatusResponse,
  CancelJobResponse,
} from "@/types/document.types";

export class DocumentService {
  /**
   * Step 1: Create document generation job
   */
  static async generateDocument(
    payload: GenerateDocumentRequest,
  ): Promise<GenerateDocumentResponse> {
    const res = await apiClient.post("/api/document/generate", payload);
    return res.data;
  }

  /**
   * Step 2: Poll job status
   */
  static async getJobStatus(
    jobId: string,
  ): Promise<DocumentJobStatusResponse> {
    const res = await apiClient.get(
      `/api/document/job/${jobId}/status`,
    );
    return res.data;
  }

  /**
   * Step 3: Download file as Blob
   */
  static async downloadDocument(fileName: string): Promise<Blob> {
    const res = await apiClient.get(
      `/api/document/download/${fileName}`,
      {
        responseType: "blob",
      },
    );

    return res.data;
  }

  /**
   * Cancel job
   */
  static async cancelJob(jobId: string): Promise<CancelJobResponse> {
    const res = await apiClient.delete(
      `/api/document/job/${jobId}`,
    );

    return res.data;
  }

  /**
   * Helper: browser download trigger
   */
  static triggerDownload(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  }
}
import { DocumentService } from "./document.service";
import { DocumentJobStatusResponse } from "@/types/document.types";

export async function waitForDocumentJob(
  jobId: string,
  {
    interval = 2000,
    timeout = 300000, // 5 min
  } = {},
): Promise<DocumentJobStatusResponse> {
  const start = Date.now();

  while (true) {
    const status = await DocumentService.getJobStatus(jobId);

    if (status.state === "completed") return status;

    if (status.state === "failed") {
      throw new Error(status.error || "Document generation failed");
    }

    if (Date.now() - start > timeout) {
      throw new Error("Document generation timeout");
    }

    await new Promise((r) => setTimeout(r, interval));
  }
}
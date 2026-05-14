import { DocumentService } from "./document.service";
import { DocumentJobStatusResponse } from "@/types/document.types";

interface WaitOptions {
  interval?: number; // ms
  timeout?: number; // ms
}

export async function waitForDocumentJob(
  jobId: string,
  options: WaitOptions = {},
): Promise<DocumentJobStatusResponse> {
  const interval = options.interval ?? 1000;
  const timeout = options.timeout ?? 300000;

  const startTime = Date.now();

  while (true) {
    const status = await DocumentService.getJobStatus(jobId);

    if (status.state === "completed") {
      return status;
    }

    if (status.state === "failed") {
      throw new Error(status.error || "Document generation failed");
    }

    if (Date.now() - startTime > timeout) {
      throw new Error("Document generation timeout");
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}
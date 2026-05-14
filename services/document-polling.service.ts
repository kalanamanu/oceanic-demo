import { DocumentService } from "./document.service";
import { DocumentJobStatusResponse } from "@/types/document.types";

interface WaitOptions {
  interval?: number; // default 2000ms
  maxAttempts?: number; // default 3
}

export async function waitForDocumentJob(
  jobId: string,
  options: WaitOptions = {},
): Promise<DocumentJobStatusResponse> {
  const interval = options.interval ?? 2000;
  const maxAttempts = options.maxAttempts ?? 5;

  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    const status = await DocumentService.getJobStatus(jobId);

    // success
    if (status.state === "completed") {
      return status;
    }

    // backend failure
    if (status.state === "failed") {
      throw new Error(status.error || "Document generation failed");
    }

    // still processing
    if (attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, interval));
    }
  }

  // timeout after 3 attempts
  throw new Error(
    "Document generation is taking too long. Please try again."
  );
}
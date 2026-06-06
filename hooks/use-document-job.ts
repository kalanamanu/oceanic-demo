"use client";

import { useState, useRef } from "react";
import { DocumentService } from "@/services/document.service";
import { toast } from "sonner";

interface EngineOptions {
  pollInterval?: number;
  maxAttempts?: number;
  autoSaveDraft?: boolean;
}

export function useDocumentEngine(options?: EngineOptions) {
  const {
    pollInterval = 2000,
    maxAttempts = 6,
    autoSaveDraft = true,
  } = options || {};

  const [loading, setLoading] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);

  const lastPayloadRef = useRef<any>(null);

  /* =========================
     DRAFT
  ========================= */
  const saveDraft = async (payload: any) => {
    try {
      const res = await fetch(
        "/api/document/draft",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      const id = json?.data?.draft_id || null;

      setDraftId(id);
      return id;
    } catch (err) {
      console.error("Draft error:", err);
      return null;
    }
  };

  /* =========================
     JOB RUNNER
  ========================= */
  const runJob = async (
    payload: any,
    label = "Document"
  ) => {
    try {
      setLoading(true);
      lastPayloadRef.current = payload;

      // STEP 1: CREATE JOB
      const res = await DocumentService.generateDocument(payload);

      if (!res.jobId) throw new Error("Job creation failed");

      toast.info(`${label} generation started...`);

      // STEP 2: POLLING
      let attempt = 0;
      let job: any;

      while (attempt < maxAttempts) {
        job = await DocumentService.getJobStatus(res.jobId);

        if (job.state === "completed") break;

        if (job.state === "failed") {
          throw new Error(job.error || "Generation failed");
        }

        await new Promise((r) => setTimeout(r, pollInterval));
        attempt++;
      }

      if (!job?.result?.fileName) {
        throw new Error("File not ready");
      }

      // STEP 3: DOWNLOAD
      const blob = await DocumentService.downloadDocument(
        job.result.fileName
      );

      DocumentService.triggerDownload(blob, job.result.fileName);

      toast.success(`${label} downloaded`);

      return job.result;
    } catch (err: any) {
      toast.error(err.message || "Document failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CANCEL JOB
  ========================= */
  const cancelJob = async (jobId: string) => {
    try {
      await DocumentService.cancelJob(jobId);
      toast.success("Job cancelled");
    } catch (err) {
      toast.error("Failed to cancel job");
    }
  };

  /* =========================
     AUTO DRAFT SAVE (SMART)
  ========================= */
  const autoSave = async (payload: any) => {
    if (!autoSaveDraft) return;

    // avoid spam saving same payload
    const last = JSON.stringify(lastPayloadRef.current);
    const current = JSON.stringify(payload);

    if (last === current) return;

    await saveDraft(payload);
  };

  /* =========================
     RESTORE (future use)
  ========================= */
  const restoreDraft = async (draftId: string) => {
    // optional backend endpoint later
    console.log("restore draft:", draftId);
  };

  return {
    // states
    loading,
    draftId,

    // actions
    runJob,
    saveDraft,
    autoSave,
    cancelJob,
    restoreDraft,
  };
}
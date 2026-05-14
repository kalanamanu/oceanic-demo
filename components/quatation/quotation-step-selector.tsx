"use client";

import { Button } from "@/components/ui/button";

interface Props {
  downloading: boolean;
  onUploadClick: () => void;
  onDownload: () => void;
}

export function QuotationStepSelector({
  downloading,
  onUploadClick,
  onDownload,
}: Props) {
  return (
    <div className="border p-8 text-center rounded space-y-4">
      <p>Download → Fill → Upload</p>

      <div className="flex justify-center gap-4">
        <Button onClick={onUploadClick}>Upload Excel</Button>

        <Button variant="outline" onClick={onDownload} disabled={downloading}>
          {downloading ? "Downloading..." : "Download Template"}
        </Button>
      </div>
    </div>
  );
}

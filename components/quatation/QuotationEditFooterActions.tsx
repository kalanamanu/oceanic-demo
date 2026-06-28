"use client";

import { Button } from "@/components/ui/button";

interface Props {
  onSave: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function QuotationEditFooterActions({
  onSave,
  onCancel,
  loading,
}: Props) {
  return (
    <div className="flex justify-between pt-6">
      <Button
        variant="outline"
        onClick={onCancel || (() => window.history.back())}
      >
        Cancel
      </Button>

      <Button onClick={onSave} disabled={loading}>
        {loading ? "Updating..." : "Update"}
      </Button>
    </div>
  );
}

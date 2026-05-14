"use client";

import { Button } from "@/components/ui/button";

interface Props {
  onSave: () => void;
}

export function QuotationFooterActions({ onSave }: Props) {
  return (
    <div className="flex justify-between pt-6">
      <Button variant="outline" onClick={() => window.history.back()}>
        Back
      </Button>

      <Button onClick={onSave}>Save</Button>
    </div>
  );
}

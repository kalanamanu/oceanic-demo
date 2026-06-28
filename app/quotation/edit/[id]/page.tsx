import { Suspense } from "react";
import { PreCostEditContent } from "./PreCostEditContent";

export default function QuotationCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading quotation form...</p>
          </div>
        </div>
      }
    >
      <PreCostEditContent />
    </Suspense>
  );
}

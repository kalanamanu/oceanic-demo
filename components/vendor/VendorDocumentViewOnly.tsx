import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { VendorDocumentList } from "./VendorDocumentList";

export function VendorDocumentViewOnly({ vendorId }: { vendorId: string }) {
  return (
    <section>
      <h2 className="font-bold flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4" />
        Documents
      </h2>
      <Card>
        <CardContent className="p-4">
          <VendorDocumentList vendorId={vendorId} readOnly={true} />
        </CardContent>
      </Card>
    </section>
  );
}

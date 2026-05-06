import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function VendorPICSection({ pics }: { pics: any[] }) {
  return (
    <section>
      <h2 className="font-bold mb-3 flex items-center gap-2">
        <User className="w-4 h-4" />
        Person In Charge (PIC)
      </h2>

      <div className="grid md:grid-cols-2 gap-3">
        {pics?.length ? (
          pics.map((p: any) => (
            <Card key={p.pic_id}>
              <CardContent className="p-4">
                <p className="font-semibold">
                  {p.firstName} {p.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{p.email}</p>
                <p className="text-sm text-muted-foreground">
                  {p.phone_number}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No PICs available
          </p>
        )}
      </div>
    </section>
  );
}

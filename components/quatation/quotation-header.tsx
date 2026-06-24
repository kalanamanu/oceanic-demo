"use client";

interface Props {
  inquiry: any;
  basis: any;
  formatBasis: (v: number) => string;
}

export function QuotationHeader({ inquiry, basis, formatBasis }: Props) {
  if (!inquiry) return null;

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Generate Quotation
        </h1>
        <p className="text-sm text-muted-foreground">
          Review inquiry details and pricing basis before generating quotation
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border rounded-xl p-5 bg-muted/20">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Inquiry ID</p>
          <p className="font-medium">{inquiry.inq_id}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Vessel</p>
          <p className="font-medium">{inquiry.vessel_name}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Agent</p>
          <p className="font-medium">{inquiry.agent}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Port</p>
          <p className="font-medium">{inquiry.port}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">ETA</p>
          <p className="font-medium">
            {inquiry.eta ? new Date(inquiry.eta).toLocaleString() : "-"}
          </p>
        </div>

        {/* BASIS */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Basis</p>
          <p className="font-medium">
            {basis ? formatBasis(Number(basis.basis)) : "Loading..."}
          </p>
        </div>

        {/* USD RATE */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">USD Rate</p>
          <p className="font-medium">{basis?.usdRate ?? "Loading..."}</p>
        </div>

        {/* MARGIN */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Margin</p>
          <p className="font-medium">
            {basis?.margin != null ? `${basis.margin}%` : "Loading..."}
          </p>
        </div>
      </div>

      {/* BASIS HIGHLIGHT CARD */}
      {/* <div className="border rounded-xl p-4 bg-background shadow-sm">
        <p className="text-xs text-muted-foreground">Current Basis Value</p>
        <p className="text-lg font-semibold">
          {basis ? formatBasis(Number(basis.basis)) : "Loading..."}
        </p>
      </div> */}
    </div>
  );
}

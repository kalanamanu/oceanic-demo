"use client";

interface Props {
  inquiry: any;
  basis: any;
  formatBasis: (v: number) => string;
}

export function QuotationHeader({ inquiry, basis, formatBasis }: Props) {
  if (!inquiry || !basis) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Generate Quotation</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border p-4 rounded text-sm">
        <div>
          <b>Ref:</b> {inquiry.inq_id}
        </div>

        <div>
          <b>Vessel:</b> {inquiry.vessel_name}
        </div>

        <div>
          <b>Agent:</b> {inquiry.agent}
        </div>

        <div>
          <b>Port:</b> {inquiry.port}
        </div>

        <div>
          <b>ETA:</b> {new Date(inquiry.eta).toLocaleString()}
        </div>

        <div>
          <b>Basis:</b> {formatBasis(basis.basis)}
        </div>

        <div>
          <b>USD Rate:</b> {basis.USDRate}
        </div>

        <div>
          <b>Margin:</b> {basis.margin}%
        </div>
      </div>
    </div>
  );
}

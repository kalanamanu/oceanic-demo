"use client";

interface Props {
  precost: any;
  basis: any;
  formatBasis: (v: number) => string;
}

export function PreCostEditHeader({ precost, basis, formatBasis }: Props) {
  if (!precost) return null;

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Pre-Cost</h1>
        <p className="text-sm text-muted-foreground">
          Update pre-cost details, items, and charges before final approval
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border rounded-xl p-5 bg-muted/20">
        {/* PRE COST ID */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Pre-Cost ID</p>
          <p className="font-medium">{precost.pre_cost_id}</p>
        </div>

        {/* VESSEL */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Vessel</p>
          <p className="font-medium">{precost.vessel_name}</p>
        </div>

        {/* STATUS */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Status</p>
          <p className="font-medium">{precost.status}</p>
        </div>

        {/* DATE ARRIVED */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Date Arrived</p>
          <p className="font-medium">
            {precost.date_arrived
              ? new Date(precost.date_arrived).toLocaleDateString()
              : "-"}
          </p>
        </div>

        {/* DATE SAILD */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Date Sailed</p>
          <p className="font-medium">
            {precost.date_saild
              ? new Date(precost.date_saild).toLocaleDateString()
              : "-"}
          </p>
        </div>

        {/* USD RATE (from basis, fallback to precost) */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">USD Rate</p>
          <p className="font-medium">
            {basis?.usdRate ?? precost.usd_rate ?? "Loading..."}
          </p>
        </div>

        {/* DISCOUNT */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Discount</p>
          <p className="font-medium">{precost.discount ?? 0}</p>
        </div>

        {/* TOTAL LKR */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total (LKR)</p>
          <p className="font-medium">{precost.total_cost ?? "-"}</p>
        </div>

        {/* TOTAL USD */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total (USD)</p>
          <p className="font-medium">{precost.total_cost_usd ?? "-"}</p>
        </div>

        {/* BASIS */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Basis</p>
          <p className="font-medium">
            {basis
              ? formatBasis(Number(basis.basis))
              : (precost.usd_rate ?? "Loading...")}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

interface InquirySelectorProps {
  inquiries: any[];
  value: string;
  onChange: (value: string) => void;
}

export function InquirySelector({
  inquiries,
  value,
  onChange,
}: InquirySelectorProps) {
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();

    return inquiries.filter((inq: any) => {
      return (
        inq.vessel_name?.toLowerCase().includes(q) ||
        inq.port?.toLowerCase().includes(q) ||
        inq.agent?.toLowerCase().includes(q) ||
        inq.customer?.toLowerCase().includes(q) ||
        inq.inq_id?.toLowerCase().includes(q)
      );
    });
  }, [search, inquiries]);

  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const handleViewTodoList = (
    e: React.MouseEvent<HTMLButtonElement>,
    inquiryId: string,
  ) => {
    e.stopPropagation();

    // IMPORTANT:
    // Encode inquiry IDs like:
    // OSC/INQ/2026/COLOMBO/0010
    // ->
    // OSC%2FINQ%2F2026%2FCOLOMBO%2F0010
    router.push(`/pic-tasks/${encodeURIComponent(inquiryId)}`);
  };

  return (
    <div className="space-y-4">
      {/* TIP */}
      <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md border">
        Select an inquiry or open its PIC Todo list for full task management.
      </div>

      {/* TITLE */}
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold">Inquiries</label>
        <span className="text-xs text-muted-foreground">
          {filtered.length} results
        </span>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search vessel, port, agent, inquiry ID..."
        className="w-full border rounded-md px-3 py-2 text-sm bg-background text-foreground border-border focus:ring-2 focus:ring-primary"
      />

      {/* LIST */}
      <div className="space-y-3">
        {filtered.map((inq: any) => {
          const isSelected = value === inq.inq_id;

          return (
            <div
              key={inq.inq_id}
              onClick={() => onChange(inq.inq_id)}
              className={`rounded-lg border p-4 cursor-pointer transition-all flex flex-col gap-3 ${
                isSelected
                  ? "border-primary bg-card shadow-md ring-2 ring-primary/20"
                  : "bg-card hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">{inq.vessel_name}</p>

                  <p className="text-xs text-muted-foreground">
                    {inq.port} • {inq.agent}
                  </p>

                  <p className="text-[11px] mt-1 font-mono text-muted-foreground">
                    {inq.inq_id}
                  </p>
                </div>

                <span className="text-[10px] px-2 py-1 rounded-full bg-muted">
                  {inq.status?.name || "Pending"}
                </span>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <p>Customer: {inq.customer || "-"}</p>
                <p>ETA: {formatDate(inq.eta)}</p>
                <p>Received: {formatDate(inq.received_date)}</p>
                <p>Email: {inq.customerEmail || "-"}</p>
              </div>

              {/* PIC INFO */}
              <div className="text-xs">
                <p className="font-medium">Key PIC</p>
                <p className="text-muted-foreground">
                  {inq.key_pic?.name || "Unassigned"}
                </p>
              </div>

              {/* ACTION BUTTON */}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className="w-full text-xs px-3 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
                  onClick={(e) => handleViewTodoList(e, inq.inq_id)}
                >
                  View PIC Todo List
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

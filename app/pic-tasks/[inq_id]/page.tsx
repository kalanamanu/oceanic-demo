"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { InquiryService } from "@/services/inquiry.service";
import { PicTodoService } from "@/services/picTodo.service";
import { PicTodoList } from "@/components/pic-tasks/PicTodoList";
import { PicTodoFormModal } from "@/components/pic-tasks/PicTodoFormModal";
import { Button } from "@/components/ui/button";
import {
  Ship,
  MapPin,
  User,
  Mail,
  CalendarDays,
  Clock,
  Plus,
  Loader2,
} from "lucide-react";

export default function PicTodoPage() {
  const { inq_id } = useParams<{ inq_id: string }>();

  const [inquiry, setInquiry] = React.useState<any>(null);
  const [todos, setTodos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const inquiryRes = await InquiryService.getAllInquiries({
        page: 1,
        pageSize: 100,
      });

      const found = inquiryRes.data.find((i: any) => i.inq_id === inq_id);
      setInquiry(found || null);

      const todoRes = await PicTodoService.getTodosByInquiry(inq_id);
      setTodos(todoRes);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  const formatTime24 = (time?: string) => {
    if (!time) return "-";

    // supports "HH:mm:ss" or "HH:mm"
    const [h, m] = time.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const formatDateTime = (date?: string) => {
    if (!date) return "-";

    const d = new Date(date);

    const ddmmyyyy = d.toLocaleDateString("en-GB");
    const hhmm = d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${ddmmyyyy} ${hhmm}`;
  };

  React.useEffect(() => {
    if (inq_id) loadData();
  }, [inq_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">Fetching inquiry details...</p>
      </div>
    );
  }

  if (!inquiry)
    return (
      <div className="p-12 text-center font-medium">Inquiry not found</div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* ================= HEADER SECTION ================= */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {inquiry.vessel_name}
              </h1>
            </div>
            <div className="flex items-center gap-2 ">
              <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                {inquiry.status?.name || "Pending"}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                Inquiry ID: {inq_id}
              </span>
            </div>
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all h-11 px-6 rounded-xl font-semibold"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Todo
          </Button>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <DetailItem
              icon={<MapPin className="h-4 w-4" />}
              label="Port"
              value={inquiry.port}
            />
            <DetailItem
              icon={<User className="h-4 w-4" />}
              label="Agent"
              value={inquiry.agent}
            />
          </div>

          <div className="space-y-4">
            <DetailItem
              icon={<User className="h-4 w-4" />}
              label="Customer"
              value={inquiry.customer || "-"}
            />
            <DetailItem
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={inquiry.customerEmail || "-"}
            />
          </div>

          <div className="space-y-4">
            <DetailItem
              icon={<CalendarDays className="h-4 w-4" />}
              label="ETA"
              value={formatDateTime(inquiry.eta)}
            />{" "}
            <DetailItem
              icon={<Clock className="h-4 w-4" />}
              label="Received"
              value={formatDateTime(inquiry.received_date)}
            />
          </div>
        </div>

        {/* PERSONNEL SECTION */}
        <div className="mt-8 pt-6 border-t grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Key PIC
            </p>
            <div>
              <p className="text-sm font-semibold">
                {inquiry.key_pic?.name || "Unassigned"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Other PICs
            </p>
            <div className="flex flex-wrap gap-2">
              {inquiry.other_pics?.length > 0 ? (
                inquiry.other_pics.map((p: any) => (
                  <span
                    key={p.id}
                    className="text-xs px-3 py-1.5 rounded-full bg-background border border-border font-medium shadow-sm"
                  >
                    {p.name}
                  </span>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No other personnel assigned
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= TASKS LIST ================= */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2 px-1">
          Assigned Tasks
          <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {todos.length}
          </span>
        </h2>
        <PicTodoList todos={todos} refresh={loadData} />
      </div>

      {/* ================= MODAL ================= */}
      <PicTodoFormModal
        open={open}
        onClose={() => setOpen(false)}
        inquiryId={inq_id}
        inquiry={inquiry}
        onSuccess={() => {
          setOpen(false);
          loadData();
        }}
      />
    </div>
  );
}

/** HELPER COMPONENT FOR CONSISTENT VISIBILITY **/
function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/70">
          {label}
        </p>
        <p className="text-sm font-medium leading-none">{value}</p>
      </div>
    </div>
  );
}

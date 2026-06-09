"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { InquiryService } from "@/services/inquiry.service";
import { PicTodoService } from "@/services/picTodo.service";
import { PicTodoList } from "@/components/pic-tasks/PicTodoList";
import { PicTodoFormModal } from "@/components/pic-tasks/PicTodoFormModal";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  User,
  Mail,
  CalendarDays,
  Clock,
  Plus,
  Loader2,
} from "lucide-react";

export default function PicTodoPage() {
  const params = useParams<{ inq_id: string }>();

  // decode route param safely
  const inq_id = React.useMemo(() => {
    return params?.inq_id ? decodeURIComponent(params.inq_id) : "";
  }, [params]);

  const [inquiry, setInquiry] = React.useState<any>(null);
  const [todos, setTodos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const loadData = async () => {
    if (!inq_id) return;

    setLoading(true);

    try {
      const inquiryRes = await InquiryService.getAllInquiries({
        page: 1,
        pageSize: 100,
      });

      const found = inquiryRes.data.find((i: any) => i.inq_id === inq_id);
      setInquiry(found || null);

      // ✅ FIXED API CALL (IMPORTANT)
      const todoRes = await PicTodoService.getTodosByInquiry(
        encodeURIComponent(inq_id),
      );

      setTodos(todoRes);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB");
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
      {/* HEADER */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {inquiry.vessel_name}
            </h1>

            <div className="flex items-center gap-2">
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

        {/* DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem icon={<MapPin />} label="Port" value={inquiry.port} />
          <DetailItem icon={<User />} label="Agent" value={inquiry.agent} />
          <DetailItem
            icon={<Mail />}
            label="Email"
            value={inquiry.customerEmail || "-"}
          />
          <DetailItem
            icon={<CalendarDays />}
            label="ETA"
            value={formatDateTime(inquiry.eta)}
          />
          <DetailItem
            icon={<Clock />}
            label="Received"
            value={formatDateTime(inquiry.received_date)}
          />
        </div>
      </div>

      {/* TASKS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2 px-1">
          Assigned Tasks
          <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {todos.length}
          </span>
        </h2>

        <PicTodoList todos={todos} refresh={loadData} />
      </div>

      {/* MODAL */}
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

/** HELPER **/
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
        <p className="text-[10px] font-bold uppercase text-muted-foreground/70">
          {label}
        </p>
        <p className="text-sm font-medium leading-none">{value}</p>
      </div>
    </div>
  );
}

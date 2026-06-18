"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CalendarService } from "@/services/calendar.service";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CalendarDays,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ================= TYPES ================= */
interface HolidayForm {
  day: number;
  name: string;
  type: "public" | "bank" | "mercantile" | "company";
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ================= PAGE ================= */
export default function CalendarHolidayPage() {
  const { calender_id } = useParams<{ calender_id: string }>();

  const [month, setMonth] = useState(1);
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState<HolidayForm>({
    day: 0,
    name: "",
    type: "public",
  });

  /* ================= LOAD MONTH ================= */
  const loadMonth = async () => {
    try {
      const data = await CalendarService.getCalendarMonth(calender_id, month);
      setDays(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to sync calendar metadata");
    }
  };

  useEffect(() => {
    if (calender_id) loadMonth();
  }, [calender_id, month]);

  /* ================= OPEN CREATE ================= */
  const openCreate = (day: number) => {
    setEditMode(false);
    setForm({ day, name: "", type: "public" });
    setShowModal(true);
  };

  /* ================= OPEN EDIT ================= */
  const openEdit = (holiday: any) => {
    setEditMode(true);
    setForm({
      day: holiday.day,
      name: holiday.holidayDetails.name,
      type: holiday.holidayDetails.type || "public",
    });
    setShowModal(true);
  };

  /* ================= SAVE HOLIDAY ================= */
  const saveHoliday = async () => {
    if (!form.name.trim()) {
      toast.error("Please provide an explicit descriptor label.");
      return;
    }
    try {
      setLoading(true);
      await CalendarService.createHolidays({
        calender_id,
        data: [
          {
            month,
            day: form.day,
            name: form.name,
            type: form.type,
            shouldConsiderAsHoliday: true,
          },
        ],
      });

      toast.success(
        editMode ? "Holiday modifications synchronized" : "Holiday flag saved",
      );
      setShowModal(false);
      loadMonth();
    } catch (err: any) {
      toast.error(err.message || "Execution exception error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE HOLIDAY ================= */
  const deleteHoliday = async (holidayId: string) => {
    try {
      await CalendarService.deleteHoliday(holidayId);
      toast.success("Holiday constraint removed");
      loadMonth();
    } catch (err: any) {
      toast.error(err.message || "Purge exception fault");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-1 border-b pb-5">
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Calendar Holidays
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Active Ledger Identifier Token:</span>
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs text-foreground font-semibold">
              {calender_id}
            </code>
          </div>
        </div>

        {/* WORKSPACE SIDEBAR GRID COUPLING */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* LEFT: CALENDAR PICKER COLUMN */}
          <div className="space-y-4 lg:col-span-1">
            <Card className="border-2 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Select Month Block
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  {MONTH_NAMES.map((name, index) => {
                    const mNum = index + 1;
                    const isSelected = month === mNum;
                    return (
                      <Button
                        key={mNum}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMonth(mNum)}
                        className={`text-xs h-9 justify-start font-medium px-2.5 transition-all shadow-none ${
                          isSelected
                            ? "font-bold"
                            : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="w-5 font-mono text-[10px] opacity-60">
                          {String(mNum).padStart(2, "0")}
                        </span>
                        {name.substring(0, 3)}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: DESKTOP 7-DAY MONTH GRID */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="border-2 shadow-sm overflow-hidden">
              <CardHeader className="border-b bg-muted/20 flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                    {MONTH_NAMES[month - 1]} Overview
                  </CardTitle>
                  <CardDescription>
                    Review system operational schedules and milestone
                    exclusions.
                  </CardDescription>
                </div>

                {/* Micro Toggles */}
                <div className="flex items-center border rounded-lg bg-background p-0.5 shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={month === 1}
                    onClick={() => setMonth((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-mono px-3 font-bold">
                    {String(month).padStart(2, "0")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={month === 12}
                    onClick={() => setMonth((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                {/* Weekday Label Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                  {WEEKDAYS.map((day) => {
                    const isWeekendHeader = day === "Sun" || day === "Sat";
                    return (
                      <div
                        key={day}
                        className={`text-[11px] font-bold uppercase tracking-wider py-1 rounded-md ${
                          isWeekendHeader
                            ? "text-amber-600 dark:text-amber-500 bg-amber-500/10"
                            : "text-muted-foreground"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>

                {/* Days Matrix */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((d, index) => {
                    const isHoliday = d.isHoliday && d.holidayDetails;

                    // Direct layout checking fallback: Column 1 (index % 7 === 0) is Sunday, Column 7 (index % 7 === 6) is Saturday
                    const isSundayColumn = index % 7 === 0;
                    const isSaturdayColumn = index % 7 === 6;
                    const isWeekend =
                      isSundayColumn ||
                      isSaturdayColumn ||
                      d.weekday === "Sun" ||
                      d.weekday === "Sat";

                    // Dynamic background box styling configurations
                    let dayCardStyles =
                      "bg-card hover:border-primary/40 text-card-foreground shadow-sm";
                    if (isHoliday) {
                      dayCardStyles =
                        "bg-rose-500/5 border-rose-500/20 text-rose-700 dark:text-rose-400";
                    } else if (isWeekend) {
                      // Noticeable amber structural framing configuration matching your layout's theme header
                      dayCardStyles =
                        "bg-amber-500/[0.03] border-amber-500/20 text-muted-foreground hover:border-amber-500/40 shadow-none";
                    }

                    return (
                      <div
                        key={d.date || index}
                        className={`group min-h-[90px] border-2 rounded-xl p-2.5 relative transition-all flex flex-col justify-between ${dayCardStyles}`}
                      >
                        {/* Day Metadata Row */}
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-base font-bold font-mono tracking-tight ${
                              isHoliday
                                ? "text-rose-600 dark:text-rose-400"
                                : isWeekend
                                  ? "text-amber-700"
                                  : "text-foreground"
                            }`}
                          >
                            {d.day}
                          </span>

                          {/* Grid Interactions Context */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                            {!isHoliday ? (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openCreate(d.day)}
                                className="h-6 w-6 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600 rounded-md"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => openEdit(d)}
                                  className="h-6 w-6 text-blue-500 hover:bg-blue-500/10 rounded-md"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    deleteHoliday(
                                      d.holidayDetails.calenderHolidays_id,
                                    )
                                  }
                                  className="h-6 w-6 text-rose-500 hover:bg-rose-500/10 rounded-md"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Holiday Label Anchor Layout */}
                        {isHoliday && (
                          <div className="mt-2">
                            <p className="text-[11px] font-bold tracking-tight line-clamp-2 leading-tight uppercase">
                              {d.holidayDetails.name}
                            </p>
                            <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 tracking-wider">
                              {d.holidayDetails.type || "Public"}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* DIALOG MODIFICATION PORTAL */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-[400px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight">
                {editMode ? "Modify Holiday Directive" : "Create Holiday"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">
                  Target Day
                </Label>
                <Input
                  value={`Day ${form.day} - ${MONTH_NAMES[month - 1]}`}
                  disabled
                  className="bg-muted font-medium text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">
                  Holiday Name
                </Label>
                <Input
                  placeholder="e.g. Poya Day ,Christmas Day, National Day"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-10 text-xs shadow-sm bg-card"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">
                  EType of Holiday
                </Label>
                <Select
                  value={form.type}
                  onValueChange={(val: any) => setForm({ ...form, type: val })}
                >
                  <SelectTrigger className="h-10 text-xs bg-card shadow-sm">
                    <SelectValue placeholder="Select context category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public Holiday Block</SelectItem>
                    <SelectItem value="bank">Bank Holiday Block</SelectItem>
                    <SelectItem value="mercantile">
                      Mercantile Statutory Holiday
                    </SelectItem>
                    <SelectItem value="company">
                      Company Internal Inbound Exemption
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="mt-2">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="h-10 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={saveHoliday}
                disabled={loading}
                className="h-10 rounded-xl bg-primary px-5"
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {loading ? "Saving System Matrix..." : "Commit Constraints"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

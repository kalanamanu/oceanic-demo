"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import Link from "next/link";

import { CalendarDays, Plus, Trash2, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { CalendarService } from "@/services/calendar.service";

interface CalendarYear {
  calender_id: string;
  year: number;
  isLeapYear: boolean;
}

export default function CalendarConfigurationPage() {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(String(currentYear));
  const [calendars, setCalendars] = useState<CalendarYear[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog Confirmation States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ================= LOAD CALENDARS ================= */
  const loadCalendars = async () => {
    try {
      const data = await CalendarService.getAllCalendars();
      setCalendars(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load calendars");
    }
  };

  useEffect(() => {
    loadCalendars();
  }, []);

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!year) return;

    try {
      setLoading(true);

      await CalendarService.createCalendar({
        year: Number(year),
      });

      toast.success("Calendar created successfully");

      setYear(String(currentYear));
      loadCalendars();
    } catch (err: any) {
      toast.error(err.message || "Failed to create calendar");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CONFIRMED DELETE ================= */
  const handleConfirmedDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await CalendarService.deleteCalendar(deleteId);

      toast.error("Calendar deleted successfully");
      loadCalendars();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete calendar");
    } finally {
      setDeleting(false);
      setDeleteId(null); // Close dialog
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Calendar Configuration
          </h1>
          <p className="text-muted-foreground">
            Manage calendar years, public holidays, company holidays and
            working-day calculations.
          </p>
        </div>

        {/* Create Calendar */}
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle>Create Calendar Year</CardTitle>
            <CardDescription>
              Generate a calendar for a specific year. Leap years are detected
              automatically.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-3 md:flex-row">
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Enter year"
                className="max-w-[220px] h-10 shadow-sm"
              />

              <Button
                onClick={handleCreate}
                disabled={loading}
                className="h-10"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {loading ? "Creating..." : "Create Calendar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Years */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold uppercase text-muted-foreground tracking-wider">
            Configured Calendar Years
          </h2>

          {calendars.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-muted p-4">
                  <CalendarDays className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  No calendars found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
                  Create your first calendar year to begin configuring
                  operational schedules and business milestones.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {calendars.map((calendar, index) => (
                <motion.div
                  key={calendar.calender_id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group border-2 transition-all hover:border-primary/30 shadow-sm flex flex-col justify-between h-full">
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="rounded-2xl bg-primary/10 p-3">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>

                        {calendar.isLeapYear && (
                          <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-500 border border-blue-500/20">
                            Leap Year
                          </span>
                        )}
                      </div>

                      <div>
                        <CardTitle className="text-2xl tracking-tight group-hover:text-primary transition-colors">
                          {calendar.year}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Calendar Year Configuration
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex gap-2.5">
                        <Link
                          href={`/system-configuration/calendar/${calendar.calender_id}`}
                        >
                          <Button variant="default" className="flex-1">
                            Manage Holidays
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive shadow-none"
                          onClick={() => setDeleteId(calendar.calender_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Guard Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="rounded-2xl max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This will permanently purge this calendar log layout and drop all
              configured public, internal, and marine logistical routing flags
              associated with this timeline block.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel disabled={deleting} className="rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Guard default close window to complete task flow
                handleConfirmedDelete();
              }}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl px-5"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {deleting ? "Purging..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

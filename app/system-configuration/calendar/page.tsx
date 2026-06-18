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

import { CalendarDays, Plus, Trash2, Calendar } from "lucide-react";
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

  /* ================= LOAD CALENDARS ================= */
  const loadCalendars = async () => {
    try {
      const data = await CalendarService.getAllCalendars();
      setCalendars(data);
    } catch (err: any) {
      toast.error(err.message);
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
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    try {
      await CalendarService.deleteCalendar(id);

      toast.success("Calendar deleted");
      loadCalendars();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
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
        <Card>
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
                className="max-w-[220px]"
              />

              <Button onClick={handleCreate} disabled={loading}>
                <Plus className="mr-2 h-4 w-4" />
                {loading ? "Creating..." : "Create Calendar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Years */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Configured Calendar Years
          </h2>

          {calendars.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <CalendarDays className="h-12 w-12 text-muted-foreground" />

                <h3 className="mt-4 text-lg font-medium">No calendars found</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first calendar year to begin configuring holidays.
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
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="rounded-xl bg-primary/10 p-3">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>

                        {calendar.isLeapYear && (
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                            Leap Year
                          </span>
                        )}
                      </div>

                      <CardTitle className="mt-4">{calendar.year}</CardTitle>

                      <CardDescription>
                        Calendar Year Configuration
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="default" className="flex-1">
                          Manage Holidays
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(calendar.calender_id)}
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
    </div>
  );
}

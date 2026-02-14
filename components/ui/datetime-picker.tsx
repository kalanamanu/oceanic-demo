"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DayPicker } from "react-day-picker";

interface DateTimePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  yearRange?: { start: number; end: number };
}

export function DateTimePicker({
  date,
  onDateChange,
  placeholder = "DD.MM.YYYY HH:MM",
  disabled = false,
  yearRange = { start: 1900, end: 2100 },
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date,
  );
  const [displayMonth, setDisplayMonth] = React.useState<Date>(
    date || new Date(),
  );
  const [hours, setHours] = React.useState<string>(
    date ? format(date, "HH") : "00",
  );
  const [minutes, setMinutes] = React.useState<string>(
    date ? format(date, "mm") : "00",
  );

  // Sync with external date prop changes
  React.useEffect(() => {
    if (date) {
      setSelectedDate(date);
      setDisplayMonth(date);
      setHours(format(date, "HH"));
      setMinutes(format(date, "mm"));
    }
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setSelectedDate(undefined);
      onDateChange?.(undefined);
      return;
    }
    newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  const handleHoursChange = (value: string) => {
    setHours(value);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(value), parseInt(minutes), 0, 0);
      setSelectedDate(newDate);
      onDateChange?.(newDate);
    }
  };

  const handleMinutesChange = (value: string) => {
    setMinutes(value);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hours), parseInt(value), 0, 0);
      setSelectedDate(newDate);
      onDateChange?.(newDate);
    }
  };

  const handleMonthChange = (month: string) => {
    const newMonth = new Date(displayMonth);
    newMonth.setMonth(parseInt(month));
    setDisplayMonth(newMonth);
  };

  const handleYearChange = (year: string) => {
    const newMonth = new Date(displayMonth);
    newMonth.setFullYear(parseInt(year));
    setDisplayMonth(newMonth);
  };

  // Generate options
  const hoursArray = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  const minutesArray = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  const yearsArray = Array.from(
    { length: yearRange.end - yearRange.start + 1 },
    (_, i) => yearRange.start + i,
  );
  const monthsArray = [
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
  ].map((label, index) => ({ value: index.toString(), label }));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 px-3",
            "border-border bg-background hover:bg-muted/50",
            "transition-colors duration-200",
            !selectedDate && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-70" />
          {selectedDate ? (
            <span className="truncate font-medium">
              {format(selectedDate, "dd.MM.yyyy")} at {hours}:{minutes}
            </span>
          ) : (
            <span className="font-normal">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
        <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden">
          {/* Header: Month & Year Selection */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/20">
            <Select
              value={displayMonth.getMonth().toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="h-9 w-[130px] text-sm font-semibold border-border/50 bg-background/50 hover:bg-muted/60 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthsArray.map((month) => (
                  <SelectItem
                    key={month.value}
                    value={month.value}
                    className="font-medium"
                  >
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={displayMonth.getFullYear().toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="h-9 w-[95px] text-sm font-semibold border-border/50 bg-background/50 hover:bg-muted/60 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[240px]">
                {yearsArray.map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className="font-medium"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={displayMonth}
              onMonthChange={setDisplayMonth}
              showOutsideDays={false}
              className="!m-0"
              classNames={{
                months: "relative",
                month: "space-y-4",
                caption: "hidden",
                nav: "hidden",
                table: "w-full border-collapse",
                head_row: "flex mb-1",
                head_cell:
                  "text-muted-foreground rounded-md w-10 font-semibold text-xs uppercase tracking-wide",
                row: "flex w-full mt-1.5",
                cell: "h-10 w-10 text-center text-sm p-0 relative",
                day: cn(
                  "h-10 w-10 p-0 font-medium rounded-lg",
                  "hover:bg-primary/10 hover:text-primary transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                ),
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-bold shadow-sm",
                day_today:
                  "bg-accent text-accent-foreground font-bold border border-border",
                day_outside: "text-muted-foreground/40 opacity-40",
                day_disabled:
                  "text-muted-foreground/30 opacity-30 cursor-not-allowed",
              }}
            />
          </div>

          {/* Footer: Time Selection */}
          <div className="px-4 py-3.5 border-t border-border/50 bg-muted/10">
            <div className="flex items-center justify-between mb-2.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Time (24H)
              </Label>
            </div>

            <div className="flex items-center justify-center gap-2">
              {/* Hours */}
              <Select value={hours} onValueChange={handleHoursChange}>
                <SelectTrigger className="h-11 w-20 border-border bg-background hover:bg-muted/50 transition-colors font-mono text-base font-bold">
                  <SelectValue placeholder="00" />
                </SelectTrigger>
                <SelectContent className="max-h-[220px]">
                  {hoursArray.map((hour) => (
                    <SelectItem
                      key={hour}
                      value={hour}
                      className="font-mono font-semibold text-base"
                    >
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-2xl font-bold text-muted-foreground/60 px-0.5">
                :
              </span>

              {/* Minutes */}
              <Select value={minutes} onValueChange={handleMinutesChange}>
                <SelectTrigger className="h-11 w-20 border-border bg-background hover:bg-muted/50 transition-colors font-mono text-base font-bold">
                  <SelectValue placeholder="00" />
                </SelectTrigger>
                <SelectContent className="max-h-[220px]">
                  {minutesArray.map((minute) => (
                    <SelectItem
                      key={minute}
                      value={minute}
                      className="font-mono font-semibold text-base"
                    >
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-[10px] text-muted-foreground/70 text-center mt-2.5 font-medium">
              Hours: 00-23 • Minutes: 00-59
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

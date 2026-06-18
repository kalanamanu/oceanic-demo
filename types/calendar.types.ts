export type HolidayType =
  | "public"
  | "bank"
  | "mercantile"
  | "religious"
  | "company"
  | "optional";

/* ================= CALENDAR ================= */

export interface Calendar {
  calender_id: string;
  year: number;
  isLeapYear: boolean;
}

/* ================= HOLIDAY ================= */

export interface Holiday {
  calenderHolidays_id: string;
  calender_id: string;

  month: number;
  day: number;

  name: string;
  type: HolidayType;

  shouldConsiderAsHoliday: boolean;
}

/* ================= MONTH DATE ================= */

export interface CalendarDate {
  date: string;
  day: number;
  weekday: string;

  isHoliday: boolean;

  holidayDetails: Holiday | null;
}

/* ================= CREATE CALENDAR ================= */

export interface CreateCalendarRequest {
  year: number;
}

export interface CreateCalendarResponse {
  success: boolean;
  message: string;
  data: Calendar;
}

/* ================= GET MONTH RESPONSE ================= */

export interface CalendarMonthResponse {
  success: boolean;
  message: string;
  data: CalendarDate[];
}

/* ================= DELETE CALENDAR ================= */

export interface DeleteCalendarResponse {
  success: boolean;
  message: string;
}

/* ================= CREATE HOLIDAYS ================= */

export interface CreateHolidayItem {
  month: number;
  day: number;

  name: string;
  type: HolidayType;

  shouldConsiderAsHoliday: boolean;
}

export interface CreateHolidaysRequest {
  calender_id: string;
  data: CreateHolidayItem[];
}

export interface CreateHolidaysResponse {
  success: boolean;
  message: string;
  data: Holiday[];
}

/* ================= GET HOLIDAY ================= */

export interface HolidayResponse {
  success: boolean;
  message: string;
  data: Holiday;
}

/* ================= UPDATE HOLIDAY ================= */

export interface UpdateHolidayRequest {
  month: number;
  day: number;

  name: string;
  type: HolidayType;

  shouldConsiderAsHoliday: boolean;
}

export interface UpdateHolidayResponse {
  success: boolean;
  message: string;
  data: Holiday;
}

/* ================= COMMON ACTION RESPONSE ================= */

export interface CalendarActionResponse {
  success: boolean;
  message: string;
}
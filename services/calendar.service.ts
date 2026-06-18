import apiClient from "@/lib/api-client";

import type {
  Calendar,
  CalendarDate,
  Holiday,

  CreateCalendarRequest,
  CreateCalendarResponse,

  CalendarMonthResponse,

  CreateHolidaysRequest,
  CreateHolidaysResponse,

  HolidayResponse,

  UpdateHolidayRequest,
  UpdateHolidayResponse,

  CalendarActionResponse,
} from "@/types/calendar.types";

export class CalendarService {
  /* ================= CREATE CALENDAR ================= */

  static async createCalendar(
    payload: CreateCalendarRequest,
  ): Promise<Calendar> {
    try {
      const res = await apiClient.post<CreateCalendarResponse>(
        "/api/calender",
        payload,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to create calendar",
      );
    }
  }

  /* ================= GET MONTH ================= */

  static async getCalendarMonth(
    calenderId: string,
    month: number,
  ): Promise<CalendarDate[]> {
    try {
      const res = await apiClient.get<CalendarMonthResponse>(
        `/api/calender/${calenderId}/month/${month}`,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to fetch calendar month",
      );
    }
  }

  /* ================= DELETE CALENDAR ================= */

  static async deleteCalendar(
    calenderId: string,
  ): Promise<void> {
    try {
      await apiClient.delete(
        `/api/calender/${calenderId}`,
      );
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to delete calendar",
      );
    }
  }

  /* ================= CREATE HOLIDAYS ================= */

  static async createHolidays(
    payload: CreateHolidaysRequest,
  ): Promise<Holiday[]> {
    try {
      const res = await apiClient.post<CreateHolidaysResponse>(
        "/api/calender/holidays",
        payload,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to create holidays",
      );
    }
  }

  /* ================= GET HOLIDAY ================= */

  static async getHolidayById(
    holidayId: string,
  ): Promise<Holiday> {
    try {
      const res = await apiClient.get<HolidayResponse>(
        `/api/calender/holidays/${holidayId}`,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to fetch holiday",
      );
    }
  }

  /* ================= UPDATE HOLIDAY ================= */

  static async updateHoliday(
    holidayId: string,
    payload: UpdateHolidayRequest,
  ): Promise<Holiday> {
    try {
      const res = await apiClient.put<UpdateHolidayResponse>(
        `/api/calender/holidays/${holidayId}`,
        payload,
      );

      return res.data.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to update holiday",
      );
    }
  }

  /* ================= DELETE HOLIDAY ================= */

  static async deleteHoliday(
    holidayId: string,
  ): Promise<void> {
    try {
      await apiClient.delete(
        `/api/calender/holidays/${holidayId}`,
      );
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
          "Failed to delete holiday",
      );
    }
  }
}
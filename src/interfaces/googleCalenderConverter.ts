import { calendar_v3 } from "googleapis";

export type GoogleCalendarEvent = calendar_v3.Schema$Event;

export interface GoogleCalenderConverter<T> {
  execute: (args: T) => GoogleCalendarEvent[];
}

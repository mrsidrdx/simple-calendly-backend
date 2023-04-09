// Define the Attendee type
export interface Attendee {
  email: string;
  displayName: string;
}

// Define the CalendarEvent type
export interface CalendarEvent {
  description: string;
  summary: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees: Attendee[];
  timeZone: string;
}

// Define the ScheduleResponse type
export interface ScheduleResponse {
  id: string;
  description: string;
  summary: string;
  startDateTime: string;
  endDateTime: string;
  attendees: Attendee[];
}

export interface EventSlot {
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
}

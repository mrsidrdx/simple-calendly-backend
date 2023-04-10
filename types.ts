// Define the Attendee type
interface Attendee {
  email: string;
  displayName: string;
}

// Define the CalendarEvent type
interface CalendarEvent {
  description: string;
  summary: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees: Attendee[];
  timeZone: string;
}

// Define the ScheduleResponse type
interface ScheduleResponse {
  id: string;
  description: string;
  summary: string;
  startDateTime: string;
  endDateTime: string;
  attendees: Attendee[];
}

interface EventSlot {
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
}

export {
  CalendarEvent,
  ScheduleResponse,
  EventSlot
}

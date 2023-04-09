import { EventSlot } from "./types";

export const totalSlots: EventSlot[] = [
  {
    start: { dateTime: "2023-04-13T16:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-13T17:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-11T18:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-11T19:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-11T02:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-11T03:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-15T05:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-15T06:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-11T00:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-11T01:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-10T06:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-10T07:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-12T02:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-12T03:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-12T21:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-12T22:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-12T01:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-12T02:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-11T22:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-11T23:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
];

export function checkSlotOverlap(slot1: EventSlot, slot2: EventSlot): boolean {
  const start1 = new Date(slot1.start.dateTime).getTime();
  const end1 = new Date(slot1.end.dateTime).getTime();
  const start2 = new Date(slot2.start.dateTime).getTime();
  const end2 = new Date(slot2.end.dateTime).getTime();

  if (start1 === end1 || start2 === end2) {
    return false; // zero-length slots don't overlap with anything
  }

  return !(end1 <= start2 || end2 <= start1);
}

export function isTimeSlotAvailable(eventSlots: EventSlot[], startDateTime: string, endDateTime: string): boolean {
  // Loop through all the EventSlots
  for (const eventSlot of eventSlots) {
    if (startDateTime >= eventSlot.start.dateTime && endDateTime <= eventSlot.end.dateTime) {
      return true;
    }
  }
  return false;
}

export function normalizeResponses(resp: object, status_code?: number): object {
  return {
    'status': status_code ?? 200,
    'data': resp
  };
}

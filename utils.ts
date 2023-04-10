import { EventSlot } from "./types";

const totalSlots: EventSlot[] = [
  {
    start: { dateTime: "2023-04-10T06:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-10T07:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-11T00:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-11T01:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-11T02:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-11T03:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-11T18:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-11T19:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-11T22:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-11T23:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-12T01:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-12T02:30:00+05:30", timeZone: "Asia/Kolkata" },
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
    start: { dateTime: "2023-04-13T16:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-13T17:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
  {
    start: { dateTime: "2023-04-15T05:30:00+05:30", timeZone: "Asia/Kolkata" },
    end: { dateTime: "2023-04-15T06:30:00+05:30", timeZone: "Asia/Kolkata" },
  },
];

/**
 * Filters an array of event slots based on whether they occur within a specified time interval.
 * @param totalSlots - The array of event slots to filter.
 * @param startDateTime - The start of the time interval to filter by, in ISO 8601 format.
 * @param endDateTime - The end of the time interval to filter by, in ISO 8601 format.
 * @returns An array of event slots that occur within the specified time interval.
 */
function filterSlotsByDateTime(totalSlots: EventSlot[], startDateTime: string, endDateTime: string): EventSlot[] {
  // Create Date objects from the input strings
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  // Filter the slots based on whether they occur within the time interval
  return totalSlots.filter(slot => {
    const slotStartDateTime = new Date(slot.start.dateTime);
    const slotEndDateTime = new Date(slot.end.dateTime);
    return slotStartDateTime >= start && slotEndDateTime <= end;
  });
}

/**
 * Checks whether two EventSlot objects overlap in time.
 *
 * @param slot1 The first EventSlot to check.
 * @param slot2 The second EventSlot to check.
 * @returns A boolean indicating whether the two slots overlap.
 */
function checkSlotOverlap(slot1: EventSlot, slot2: EventSlot): boolean {
  // Convert the start and end times of each slot to Unix timestamps.
  const start1 = new Date(slot1.start.dateTime).getTime();
  const end1 = new Date(slot1.end.dateTime).getTime();
  const start2 = new Date(slot2.start.dateTime).getTime();
  const end2 = new Date(slot2.end.dateTime).getTime();

  // Check for zero-length slots, which don't overlap with anything.
  if (start1 === end1 || start2 === end2) {
    return false;
  }

  // Check if the slots overlap by comparing their start and end times.
  return !(end1 <= start2 || end2 <= start1);
}

/**
 * Checks if a given time slot is available by comparing it with a list of existing event slots.
 * @param {EventSlot[]} eventSlots - An array of existing event slots.
 * @param {string} startDateTime - The start time of the time slot in ISO 8601 format.
 * @param {string} endDateTime - The end time of the time slot in ISO 8601 format.
 * @returns {boolean} - A boolean indicating whether the time slot is available or not.
 */
function isTimeSlotAvailable(eventSlots: EventSlot[], startDateTime: string, endDateTime: string): boolean {
  // Loop through all the EventSlots
  for (const eventSlot of eventSlots) {
    // If the start and end times of the given time slot fall within an existing event slot, it is not available
    if (startDateTime >= eventSlot.start.dateTime && endDateTime <= eventSlot.end.dateTime) {
      return false;
    }
  }
  // If none of the existing event slots overlap with the given time slot, it is available
  return true;
}


/**
 * Returns a standardized response object containing a status code and a data payload.
 * @param {object} resp - The response data to be returned in the response object.
 * @param {number} [status_code=200] - The HTTP status code to be returned in the response object. Defaults to 200.
 * @returns {object} - A dictionary with 'status' and 'data' keys containing the specified status code and response data, respectively.
 */
function normalizeResponses(resp: object, status_code?: number): object {
  // If a status code is not provided, default to 200
  const status = status_code ?? 200;
  // Create a dictionary with 'status' and 'data' keys
  const response = { 'status': status, 'data': resp };
  // Return the response object
  return response;
}

export {
  totalSlots,
  filterSlotsByDateTime,
  checkSlotOverlap,
  isTimeSlotAvailable,
  normalizeResponses
};

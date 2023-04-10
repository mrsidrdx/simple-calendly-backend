import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import {
  checkSlotOverlap,
  filterSlotsByDateTime,
  isTimeSlotAvailable,
  totalSlots,
} from "./utils";
import { CalendarEvent, EventSlot, ScheduleResponse } from "./types";
import { InvalidTimeSlotRange } from "./errors";

export class GoogleCalendar {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri:
        process.env.NODE_ENV === "development"
          ? `http://localhost:${process.env.PORT}/oauth2callback`
          : "https://simple-calendly-backend.vercel.app/oauth2callback",
    });
  }

  public getAuthUrl(): string {
    const scopes = [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ];
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
    return authUrl;
  }

  public async setAuthToken({
    authorizationCode,
  }: {
    authorizationCode: string;
  }): Promise<void> {
    const { tokens } = await this.oauth2Client.getToken(authorizationCode);
    this.oauth2Client.setCredentials(tokens);
  }

  private getOAuth2Client(): OAuth2Client {
    return this.oauth2Client;
  }

  /**
   * Retrieves calendar events within a specified time range from a given calendar.
   * @param {string} startTime - The start time of the time range in ISO 8601 format.
   * @param {string} endTime - The end time of the time range in ISO 8601 format.
   * @param {string} calendarId - The ID of the calendar to retrieve events from.
   * @returns {Promise<ScheduleResponse[]>} - A Promise that resolves to an array of ScheduleResponse objects containing event data.
   */
  public async getHostCalendarEvents(
    startTime: string,
    endTime: string,
    calendarId: string
  ): Promise<ScheduleResponse[]> {
    // Create a Google Calendar API client with OAuth2 authentication
    const calendar = google.calendar({
      version: "v3",
      auth: this.getOAuth2Client(),
    });

    // Retrieve calendar events within the specified time range using the Google Calendar API
    const events = await calendar.events.list({
      calendarId: calendarId,
      timeMin: startTime,
      timeMax: endTime,
      singleEvents: true,
      orderBy: "startTime",
    });

    // If events exist, map them to an array of ScheduleResponse objects
    return (
      events?.data?.items!.map((event) => ({
        id: event.id!,
        summary: event.summary ?? "",
        description: event.description!,
        startDateTime: event.start?.dateTime!,
        endDateTime: event.end?.dateTime!,
        attendees:
          event.attendees?.map((attendee) => ({
            email: attendee.email!,
            displayName: attendee.displayName!,
          })) ?? [],
      })) ?? []
    );
  }

  /**
   * Retrieves non-host calendar events based on the provided parameters.
   * @param {string} startTime - The start time of the event window in ISO 8601 format.
   * @param {string} endTime - The end time of the event window in ISO 8601 format.
   * @param {string} calendarId - The calendar ID to retrieve events from.
   * @param {string} email - The email address to filter events by.
   * @returns {Promise<ScheduleResponse[]>} - A promise that resolves to an array of ScheduleResponse objects.
   */
  public async getNonHostCalendarEvents(
    startTime: string,
    endTime: string,
    calendarId: string,
    email: string
  ): Promise<ScheduleResponse[]> {
    // Retrieve all events from the host's calendar during the specified time window
    const hostEvents = await this.getHostCalendarEvents(
      startTime,
      endTime,
      calendarId
    );

    // Filter out events where the provided email is an attendee
    const nonHostEvents = hostEvents.filter((event) => {
      return event.attendees.some((attendee) => {
        return attendee.email === email;
      });
    });

    return nonHostEvents;
  }

  /**

  Retrieves the available event slots based on the host's calendar events.
  @param {string} startTime - The start time of the available event slots in ISO 8601 format.
  @param {string} endTime - The end time of the available event slots in ISO 8601 format.
  @param {string} timeZone - The time zone in which the event slots are to be retrieved.
  @param {string} calendarId - The ID of the calendar containing the host's events.
  @returns {Promise<EventSlot[]>} - A promise that resolves to an array of available EventSlots.
  */
  public async getAvailableSlots(
    startTime: string,
    endTime: string,
    timeZone: string,
    calendarId: string
  ): Promise<EventSlot[]> {
    // Retrieve the host's calendar events within the specified time frame
    const hostEvents = await this.getHostCalendarEvents(
      startTime,
      endTime,
      calendarId
    );
    // Extract busy slots from the host's calendar events
    const busySlots: EventSlot[] = hostEvents.map((event) => {
      return {
        start: { dateTime: event.startDateTime, timeZone },
        end: { dateTime: event.endDateTime, timeZone },
      };
    });

    // Filter total slots by the specified time frame
    const filteredTotalSlots = filterSlotsByDateTime(
      totalSlots,
      startTime,
      endTime
    );

    // Extract the available slots by removing busy slots from total slots
    const availableSlots = filteredTotalSlots.filter(
      (slot) => !busySlots.some((busySlot) => checkSlotOverlap(slot, busySlot))
    );

    return availableSlots;
  }

  /**

  Adds an event to a Google calendar and returns the details of the added event.
  @param {CalendarEvent} event - The event object containing details of the event to be added.
  @param {string} calendarId - The ID of the calendar to add the event to.
  @returns {Promise<ScheduleResponse>} - A Promise that resolves to a ScheduleResponse object representing the added event.
  @throws {InvalidTimeSlotRange} - If the requested time slot is not available in the calendar.
  */
  public async addEventToGoogleCalendar(
    event: CalendarEvent,
    calendarId: string
  ): Promise<ScheduleResponse> {
    const calendar = google.calendar({
      version: "v3",
      auth: this.getOAuth2Client(),
    });
    try {
      // Get available time slots from the calendar
      const availableSlots = await this.getAvailableSlots(
        event.start.dateTime,
        event.end.dateTime,
        event.timeZone,
        calendarId
      );
      // Check if the requested time slot is available
      if (
        !isTimeSlotAvailable(
          availableSlots,
          event.start.dateTime,
          event.end.dateTime
        )
      ) {
        throw new InvalidTimeSlotRange(
          "The requested time slot is not available"
        );
      }

      // Insert the event into the calendar
      const addedEvent = await calendar.events.insert({
        calendarId: calendarId,
        requestBody: event,
      });

      // Return the details of the added event
      return {
        id: addedEvent.data.id!,
        summary: addedEvent.data.summary ?? "",
        description: addedEvent.data.description!,
        startDateTime: addedEvent.data.start?.dateTime!,
        endDateTime: addedEvent.data.end?.dateTime!,
        attendees:
          addedEvent.data.attendees?.map((attendee) => ({
            email: attendee.email!,
            displayName: attendee.displayName!,
          })) ?? [],
      };
    } catch (error) {
      throw error;
    }
  }
}

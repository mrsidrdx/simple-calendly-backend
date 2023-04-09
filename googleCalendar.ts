import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { checkSlotOverlap, isTimeSlotAvailable, totalSlots } from "./utils";
import { CalendarEvent, EventSlot, ScheduleResponse } from "./types";
import { InvalidTimeSlotRange } from "./errors";

export class GoogleCalendar {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `http://localhost:${process.env.PORT}/oauth2callback`,
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

  public async setAuthToken({ authorizationCode }: { authorizationCode: string }): Promise<void> {
    const { tokens } = await this.oauth2Client.getToken(authorizationCode);
    this.oauth2Client.setCredentials(tokens);
  }

  private getOAuth2Client(): OAuth2Client {
    return this.oauth2Client;
  }

  public async getHostCalendarEvents(
    startTime: string,
    endTime: string,
    calendarId: string
  ): Promise<ScheduleResponse[]> {
    const calendar = google.calendar({
      version: "v3",
      auth: this.getOAuth2Client(),
    });
    const events = await calendar.events.list({
      calendarId: calendarId,
      timeMin: startTime,
      timeMax: endTime,
      singleEvents: true,
      orderBy: "startTime",
    });

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

  public async getNonHostCalendarEvents(
    startTime: string,
    endTime: string,
    calendarId: string,
    email: string
  ): Promise<ScheduleResponse[]> {
    const hostEvents = await this.getHostCalendarEvents(
      startTime,
      endTime,
      calendarId
    );
    const nonHostEvents = hostEvents.filter((event) => {
      return event.attendees.some((attendee) => {
        return attendee.email === email;
      });
    });
    return nonHostEvents;
  }

  public async getAvailableSlots(
    startTime: string,
    endTime: string,
    timeZone: string,
    calendarId: string
  ): Promise<EventSlot[]> {
    const hostEvents = await this.getHostCalendarEvents(
      startTime,
      endTime,
      calendarId
    );
    const busySlots = hostEvents.map((event) => {
      return {
        start: { dateTime: event.startDateTime, timeZone },
        end: { dateTime: event.endDateTime, timeZone },
      };
    });
    const availableSlots = totalSlots.filter(
      (slot) => !busySlots.some((busySlot) => checkSlotOverlap(slot, busySlot))
    );

    return availableSlots;
  }

  public async addEventToGoogleCalendar(
    event: CalendarEvent,
    calendarId: string
  ): Promise<ScheduleResponse> {
    const calendar = google.calendar({
      version: "v3",
      auth: this.getOAuth2Client(),
    });

    try {
      const availableSlots = await this.getAvailableSlots(event.start.dateTime, event.end.dateTime, event.timeZone, calendarId);
      
      if (!isTimeSlotAvailable(availableSlots, event.start.dateTime, event.end.dateTime)) {
        throw new InvalidTimeSlotRange('The requested time slot is not available');
      }

      const addedEvent = await calendar.events.insert({
        calendarId: calendarId,
        requestBody: event,
      });

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

import { GoogleCalendar } from "./googleCalendar";
import { Request, Response, NextFunction } from 'express';
import { normalizeResponses } from "./utils";
import { InvalidTimeSlotRange } from "./errors";
import { availabilitySchema, hostMeetingsSchema, scheduleMeetingSchema, userMeetingsSchema } from "./schema";
import { ZodError } from "zod";

export class MeetingsController {
    private googleCalendar: GoogleCalendar;

    constructor() {
      this.googleCalendar = new GoogleCalendar();
    }

    public async authorizeOAuth2Client(authorizationCode: string) {
      await this.googleCalendar.setAuthToken({authorizationCode});
    }

    public async initiateOAuth(req: Request, res: Response, next: NextFunction) {
      try {
        const authUrl = this.googleCalendar.getAuthUrl();
        return res.status(200).json(normalizeResponses({
          'authUrl': authUrl
        }));
      } catch (err) {
        return res.status(500).json(normalizeResponses({
          'message': 'Error initiating oauth'
        }, 500));
      }
    }

    public async getAvailability(req: Request, res: Response, next: NextFunction) {
      try {
        const { startDateTime, endDateTime, timeZone, calendarId } = availabilitySchema.parse(req.query);
        const availableSlots = await this.googleCalendar.getAvailableSlots(startDateTime!.toString(), endDateTime!.toString(), timeZone!.toString(), calendarId!.toString());
        return res.status(200).json(normalizeResponses(availableSlots));
      } catch (err) {
        if (err instanceof ZodError) {
          return res.status(400).json(normalizeResponses({
            'message': err.message,
            'errors': err.errors,
            'issues': err.issues
          }, 400));
        }
        return res.status(500).json(normalizeResponses({
          'message': 'Error fetching available slots'
        }, 500));
      }
    }
  
    public async scheduleMeeting(req: Request, res: Response, next: NextFunction) {
      try {
        const { event, calendarId } = scheduleMeetingSchema.parse(req.body);
        const addedEvent = await this.googleCalendar.addEventToGoogleCalendar(event, calendarId);
        return res.status(200).json(normalizeResponses(addedEvent));
      } catch (err) {
        let errorMessage = 'Error scheduling event';
        if (err instanceof ZodError) {
          return res.status(400).json(normalizeResponses({
            'message': err.message,
            'errors': err.errors,
            'issues': err.issues
          }, 400));
        }
        if (err instanceof InvalidTimeSlotRange) {
          errorMessage = err.message;
        }
        return res.status(500).json(normalizeResponses({
          'message': errorMessage
        }, 500));
      }
    }
  
    public async getHostMeetings(req: Request, res: Response, next: NextFunction) {
      try {
        const { startDateTime, endDateTime, calendarId } = hostMeetingsSchema.parse(req.query);
        const hostEvents = await this.googleCalendar.getHostCalendarEvents(startDateTime!.toString(), endDateTime!.toString(), calendarId!.toString());
        return res.status(200).json(normalizeResponses(hostEvents));
      } catch (err) {
        if (err instanceof ZodError) {
          return res.status(400).json(normalizeResponses({
            'message': err.message,
            'errors': err.errors,
            'issues': err.issues
          }, 400));
        }
        return res.status(500).json(normalizeResponses({
          'message': 'Error fetching host events'
        }, 500));
      }
    }
  
    public async getUserMeetings(req: Request, res: Response, next: NextFunction) {
      try {
        const { email, startDateTime, endDateTime, calendarId } = userMeetingsSchema.parse(req.query);
        const userEvents = await this.googleCalendar.getNonHostCalendarEvents(startDateTime!.toString(), endDateTime!.toString(), calendarId!.toString(), email!.toString());
        return res.status(200).json(normalizeResponses(userEvents));
      } catch (err) {
        if (err instanceof ZodError) {
          return res.status(400).json(normalizeResponses({
            'message': err.message,
            'errors': err.errors,
            'issues': err.issues
          }, 400));
        }
        return res.status(500).json(normalizeResponses({
          'message': 'Error fetching non host events'
        }, 500));
      }
    }
  }
  
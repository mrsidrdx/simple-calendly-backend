import { z } from "zod";

const availabilitySchema = z
  .object({
    startDateTime: z
      .string({
        required_error: "Start date time is required",
        invalid_type_error: "Start date time must be a string",
      })
      .datetime({
        offset: true,
        message:
          "Invalid datetime string! Must be UTC. For e.g. 2023-04-13T16:30:00+05:30",
      }),
    endDateTime: z
      .string({
        required_error: "End date time is required",
        invalid_type_error: "End date time must be a string",
      })
      .datetime({
        offset: true,
        message:
          "Invalid datetime string! Must be UTC. For e.g. 2023-04-13T16:30:00+05:30",
      }),
    timeZone: z.string({
      required_error: "Time zone is required. For e.g. Asia/Kolkata",
      invalid_type_error: "Time zone must be a string",
    }),
    calendarId: z.string({
      required_error: "Calendar Id is required",
      invalid_type_error: "Calendar Id must be a string",
    }),
  })
  .required();

const hostMeetingsSchema = z
  .object({
    startDateTime: z
      .string({
        required_error: "Start date time is required",
        invalid_type_error: "Start date time must be a string",
      })
      .datetime({
        offset: true,
        message:
          "Invalid datetime string! Must be UTC. For e.g. 2023-04-13T16:30:00+05:30",
      }),
    endDateTime: z
      .string({
        required_error: "End date time is required",
        invalid_type_error: "End date time must be a string",
      })
      .datetime({
        offset: true,
        message:
          "Invalid datetime string! Must be UTC. For e.g. 2023-04-13T16:30:00+05:30",
      }),
    calendarId: z.string({
      required_error: "Calendar Id is required",
      invalid_type_error: "Calendar Id must be a string",
    }),
  })
  .required();

const userMeetingsSchema = z
  .object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email({ message: "Invalid email string!" }),
    startDateTime: z
      .string({
        required_error: "Start date time is required",
        invalid_type_error: "Start date time must be a string",
      })
      .datetime({
        offset: true,
        message:
          "Invalid datetime string! Must be UTC. For e.g. 2023-04-13T16:30:00+05:30",
      }),
    endDateTime: z
      .string({
        required_error: "End date time is required",
        invalid_type_error: "End date time must be a string",
      })
      .datetime({
        offset: true,
        message:
          "Invalid datetime string! Must be UTC. For e.g. 2023-04-13T16:30:00+05:30",
      }),
    calendarId: z.string({
      required_error: "Calendar Id is required",
      invalid_type_error: "Calendar Id must be a string",
    }),
  })
  .required();

const scheduleMeetingSchema = z
  .object({
    event: z
      .object({
        description: z.string({
          required_error: "Description is required",
          invalid_type_error: "Description must be a string",
        }),
        summary: z.string({
          required_error: "Summary is required",
          invalid_type_error: "Summary must be a string",
        }),
        start: z
          .object({
            dateTime: z
              .string({
                required_error: "Start date time is required",
                invalid_type_error: "Start date time must be a string",
              })
              .datetime({
                offset: true,
                message:
                  "Invalid datetime string! Must be UTC. For e.g. 2023-04-13T16:30:00+05:30",
              }),
            timeZone: z.string({
              required_error: "Time zone is required. For e.g. Asia/Kolkata",
              invalid_type_error: "Time zone must be a string",
            }),
          })
          .required(),
        end: z
          .object({
            dateTime: z
              .string({
                required_error: "End date time is required",
                invalid_type_error: "End date time must be a string",
              })
              .datetime({
                offset: true,
                message:
                  "Invalid datetime string! Must be UTC. For e.g. 2023-04-13T16:30:00+05:30",
              }),
            timeZone: z.string({
              required_error: "Time zone is required. For e.g. Asia/Kolkata",
              invalid_type_error: "Time zone must be a string",
            }),
          })
          .required(),
        attendees: z.array(
          z.object({
            email: z
              .string({
                required_error: "Email is required",
                invalid_type_error: "Email must be a string",
              })
              .email({ message: "Invalid email string!" }),
            displayName: z.string({
              required_error: "Display name is required.",
              invalid_type_error: "Display name must be a string",
            }),
          })
        ),
        timeZone: z.string({
          required_error: "Time zone is required. For e.g. Asia/Kolkata",
          invalid_type_error: "Time zone must be a string",
        }),
      })
      .required(),
    calendarId: z.string({
      required_error: "Calendar Id is required",
      invalid_type_error: "Calendar Id must be a string",
    }),
  })
  .required();

export {
  availabilitySchema,
  hostMeetingsSchema,
  userMeetingsSchema,
  scheduleMeetingSchema,
};

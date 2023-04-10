import express from "express";
import { MeetingsController } from "./controller";

const router = express.Router();

const meetingsController = new MeetingsController();

router.get(
  "/initiate-auth",
  meetingsController.initiateOAuth.bind(meetingsController)
);

router.get(
  "/availability",
  meetingsController.getAvailability.bind(meetingsController)
);

router.post(
  "/schedule",
  meetingsController.scheduleMeeting.bind(meetingsController)
);

router.get(
  "/host-meetings",
  meetingsController.getHostMeetings.bind(meetingsController)
);

router.get(
  "/user-meetings",
  meetingsController.getUserMeetings.bind(meetingsController)
);

router.get("/oauth2callback", (req, res, next) => {
  try {
    const code = req.query.code;
    if (code) {
      meetingsController.authorizeOAuth2Client(code.toString());
    }
    res.status(201).json({
      status: "success",
      code: code,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
    });
  }
});

export default router;

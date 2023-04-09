import { MeetingsController } from "./controller";

const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

import { Request, Response, NextFunction } from 'express';

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const meetingsController = new MeetingsController();

app.get(
  "/initiate-auth",
  meetingsController.initiateOAuth.bind(meetingsController)
);
app.get(
  "/availability",
  meetingsController.getAvailability.bind(meetingsController)
);
app.post(
  "/schedule",
  meetingsController.scheduleMeeting.bind(meetingsController)
);
app.get(
  "/host-meetings",
  meetingsController.getHostMeetings.bind(meetingsController)
);
app.get(
  "/user-meetings",
  meetingsController.getUserMeetings.bind(meetingsController)
);
app.get("/oauth2callback", (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.query.code;
    if (code) {
      meetingsController.authorizeOAuth2Client(code.toString());
    }
    res.status(201).json({
      status: "success",
      code: code
    });
  } catch (error) {
    res.status(500).json({
      status: "failure"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Export the Express API
module.exports = app

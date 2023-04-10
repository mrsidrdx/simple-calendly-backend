const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');

import { Request, Response, NextFunction } from 'express';
import meetingsApiRouter from "./meetingsApiRouter";

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

if (process.env.NODE_ENV === 'vercel') {
  const swaggerDocument = require('./swagger-static/swagger-vercel.json');
  const SWAGGER_CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCssUrl: SWAGGER_CSS_URL }));
} else {
  const swaggerDocument = require('./swagger-static/swagger-dev.json');
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use("/", meetingsApiRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    message: "API is running!"
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Export the Express API
module.exports = app

// src/server.ts
import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import winston from "winston";

// Load environment variables
dotenv.config();

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "http://localhost";

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  logger.info(`Server is running at ${URL}`);
});

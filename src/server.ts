// src/server.ts
import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import winston from "winston";
import { server } from "./graphql/schema.js";
import { expressMiddleware } from "@as-integrations/express5";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message, method, path, status, duration, size }) => {
        if (method && path) {
          return `${timestamp} ${method} ${path} ${status} ${duration}ms - ${size}`;
        }
        if (typeof message === "object") {
          return `${timestamp} ${level}: ${JSON.stringify(message, null, 2)}`;
        }
        return `${timestamp} ${level}: ${message}`;
      }
    )
  ),
  transports: [new winston.transports.Console()],
});

const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "http://localhost";

// Add JSON parsing middleware
app.use(express.json());

// Express middleware for logging HTTP requests
const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const originalSend = res.send;
  // Override send to capture response size
  res.send = function (body) {
    res.locals.body = body;
    return originalSend.call(this, body);
  };

  // Log when the response is finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const size =
      res.getHeader("content-length") ||
      (res.locals.body ? JSON.stringify(res.locals.body).length : 0);
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}`,
      size: size,
    });
  });

  next();
};

app.use(loggingMiddleware);

// Start the server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Then start Apollo Server
    await server.start();

    // Set up routes
    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req }) => {
          return { req };
        },
      })
    );
    app.get("/", (_req: Request, res: Response) => {
      res.send("Hello, world!");
    });

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Server is running at ${URL}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

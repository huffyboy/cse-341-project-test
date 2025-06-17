// src/server.ts
import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import winston from "winston";
import { server } from "./graphql/schema.js";
import { expressMiddleware } from "@as-integrations/express5";
import { connectDB } from "./config/db.js";
import logger from "./config/logger.js";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "./utils/auth.js";
import { Customer } from "./models/customer.js";
import { GraphQLContext } from "./graphql/context.js";
import cors from "cors";

// Load environment variables
dotenv.config();

// Configure Winston logger
const loggerWinston = winston.createLogger({
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
const URL = process.env.URL || `http://localhost:${PORT}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for all routes
app.use(cors());

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
    loggerWinston.info({
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

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

app.get("/config.js", (_req, res) => {
  res.type("application/javascript");
  res.send(
    `window.GITHUB_CLIENT_ID = "${process.env.GITHUB_CLIENT_ID || ""}";`
  );
});

app.get("/auth/github/callback", (req, res) => {
  const code = req.query.code;
  if (typeof code === "string") {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GitHub OAuth Code</title>
        <style>
          body { font-family: sans-serif; background: #f7f7f7; text-align: center; padding: 40px; }
          .container { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; display: inline-block; padding: 32px 48px; }
          .code { font-size: 1.2em; background: #eee; padding: 8px 16px; border-radius: 4px; margin: 16px 0; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>GitHub OAuth Code</h1>
          <p>Copy the code below and paste it into the <b>authenticateWithGithub</b> mutation in the GraphQL Playground.</p>
          <div class="code">${code}</div>
          <p><a href="/graphql" target="_blank">Go to GraphQL Playground</a></p>
        </div>
      </body>
      </html>
    `);
  } else {
    res
      .status(400)
      .send(
        "No code found in the URL. Please try logging in with GitHub again."
      );
  }
});

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
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }): Promise<GraphQLContext> => {
          const authHeader = req.headers.authorization;
          if (!authHeader) {
            return { customer: undefined };
          }

          const token = authHeader.split(" ")[1];
          if (!token) {
            return { customer: undefined };
          }

          try {
            const decoded = verifyToken(token);
            const customer = await Customer.findById(decoded.customerId);
            return { customer: customer || undefined };
          } catch (error) {
            logger.error("Error verifying token:", error);
            return { customer: undefined };
          }
        },
      })
    );

    // Add a route to handle GET requests to /graphql
    app.get("/graphql", (_req, res) => {
      res.redirect("/graphql");
    });

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Server is running at ${URL}`);
      logger.info(`GraphQL Sandbox available at ${URL}/graphql`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

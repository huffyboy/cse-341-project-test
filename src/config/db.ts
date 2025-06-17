// src/config/db.ts
import mongoose from "mongoose";
import { config } from "dotenv";
import logger from "./logger.js";

// Load environment variables
config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

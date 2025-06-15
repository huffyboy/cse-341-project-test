// src/config/db.ts
import mongoose from "mongoose";
import { config } from "dotenv";
import logger from "./logger.js";

// Load environment variables
config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;

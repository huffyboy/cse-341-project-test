// src/models/Announcements.ts
import mongoose, { Schema, Document, model } from "mongoose";

interface IAnnouncement extends Document {
  _id: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  content: string;
  scheduledTime: Date;
  isSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    content: { type: String, required: true },
    scheduledTime: { type: Date, required: true },
    isSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IAnnouncement>("Announcement", AnnouncementSchema);

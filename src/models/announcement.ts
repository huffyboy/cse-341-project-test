// src/models/Announcements.ts
import mongoose, { Schema, Document, model } from "mongoose";

interface IAnnouncement extends Document {
    _id: mongoose.Types.ObjectId;
    customer_id: mongoose.Types.ObjectId;
    content: string;
    scheduled_time: Date;
    is_sent: boolean;
    created_at: Date;
    updated_at: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>({
    customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    content: { type: String, required: true },
    scheduled_time: { type: Date, required: true },
    is_sent: { type: Boolean, default: false },
}, { timestamps: true });

export default model<IAnnouncement>("Announcement", AnnouncementSchema);

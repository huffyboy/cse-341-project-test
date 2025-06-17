// src/schemas/announcement.zod.ts
import { z } from "zod";

// Base schema for common fields
const baseAnnouncementSchema = z.object({
  content: z
    .string()
    .min(1, "Content cannot be empty")
    .max(160, "Content must be less than 160 characters")
    .trim(),
  scheduledTime: z
    .string()
    .datetime("Invalid date format")
    .refine(
      (date) => new Date(date) > new Date(),
      "Scheduled time must be in the future"
    ),
  isSent: z.boolean().default(false),
});

// Schema for creating a new announcement
export const announcementSchema = baseAnnouncementSchema.extend({
  customerId: z
    .string()
    .min(1, "Customer ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
});

// Schema for updating an existing announcement
export const announcementUpdateSchema = baseAnnouncementSchema
  .extend({
    customerId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format")
      .optional(),
  })
  .partial();

// Type inference
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type AnnouncementUpdateInput = z.infer<typeof announcementUpdateSchema>;

// Validation functions
export const validateAnnouncement = (data: unknown) =>
  announcementSchema.parse(data);
export const validateAnnouncementUpdate = (data: unknown) =>
  announcementUpdateSchema.parse(data);

// src/graphql/resolvers/announcement.ts
import {
  validateAnnouncement,
  validateAnnouncementUpdate,
  AnnouncementInput,
  AnnouncementUpdateInput,
} from "../../schemas/announcement.zod.js";
import Announcement from "../../models/announcement.js";

export const announcementResolvers = {
  Query: {
    announcements: async () => {
      return await Announcement.find();
    },
    announcement: async (_: unknown, { id }: { id: string }) => {
      return await Announcement.findById(id);
    },
  },
  Mutation: {
    createAnnouncement: async (
      _: unknown,
      { input }: { input: AnnouncementInput }
    ) => {
      const validatedData = validateAnnouncement(input);
      const announcement = new Announcement(validatedData);
      return await announcement.save();
    },
    updateAnnouncement: async (
      _: unknown,
      { id, input }: { id: string; input: AnnouncementUpdateInput }
    ) => {
      const validatedData = validateAnnouncementUpdate(input);
      return await Announcement.findByIdAndUpdate(id, validatedData, {
        new: true,
      });
    },
    deleteAnnouncement: async (_: unknown, { id }: { id: string }) => {
      await Announcement.findByIdAndDelete(id);
      return true;
    },
  },
};

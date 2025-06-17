// src/graphql/resolvers/announcement.ts
import {
  validateAnnouncement,
  validateAnnouncementUpdate,
  AnnouncementInput,
  AnnouncementUpdateInput,
} from "../../schemas/announcement.zod.js";
import Announcement from "../../models/announcement.js";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
  isValidationError,
  AuthenticationError,
} from "../../utils/errors.js";
import { GraphQLContext } from "../context.js";

export const announcementResolvers = {
  Query: {
    announcements: async () => {
      try {
        return await Announcement.find();
      } catch {
        throw new DatabaseError("Failed to fetch announcements");
      }
    },
    announcement: async (_: unknown, { id }: { id: string }) => {
      try {
        const announcement = await Announcement.findById(id);
        if (!announcement) {
          throw new NotFoundError("Announcement");
        }
        return announcement;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new DatabaseError("Failed to fetch announcement");
      }
    },
  },
  Mutation: {
    createAnnouncement: async (
      _: unknown,
      { input }: { input: AnnouncementInput },
      context: GraphQLContext
    ) => {
      if (!context.customer) throw new AuthenticationError();
      try {
        const validatedData = validateAnnouncement(input);
        const announcement = new Announcement(validatedData);
        return await announcement.save();
      } catch (error) {
        if (isValidationError(error)) {
          throw new ValidationError(error.message);
        }
        throw new DatabaseError("Failed to create announcement");
      }
    },
    updateAnnouncement: async (
      _: unknown,
      { id, input }: { id: string; input: AnnouncementUpdateInput },
      context: GraphQLContext
    ) => {
      if (!context.customer) throw new AuthenticationError();
      try {
        const validatedData = validateAnnouncementUpdate(input);
        const announcement = await Announcement.findByIdAndUpdate(
          id,
          validatedData,
          {
            new: true,
          }
        );
        if (!announcement) {
          throw new NotFoundError("Announcement");
        }
        return announcement;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        if (isValidationError(error)) {
          throw new ValidationError(error.message);
        }
        throw new DatabaseError("Failed to update announcement");
      }
    },
    deleteAnnouncement: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.customer) throw new AuthenticationError();
      try {
        const announcement = await Announcement.findByIdAndDelete(id);
        if (!announcement) {
          throw new NotFoundError("Announcement");
        }
        return true;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new DatabaseError("Failed to delete announcement");
      }
    },
  },
};

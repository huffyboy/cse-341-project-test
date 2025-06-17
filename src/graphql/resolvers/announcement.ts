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
  DatabaseError,
  isValidationError,
  AuthenticationError,
} from "../../utils/errors.js";
import { GraphQLContext } from "../context.js";
import { ZodError } from "zod";
import { GraphQLError } from "graphql";

export const announcementResolvers = {
  Query: {
    announcements: async () => {
      try {
        return await Announcement.find().populate("customer");
      } catch {
        throw new DatabaseError("Failed to fetch announcements");
      }
    },
    announcement: async (_: unknown, { id }: { id: string }) => {
      try {
        const announcement =
          await Announcement.findById(id).populate("customer");
        if (!announcement) {
          throw new NotFoundError("Announcement");
        }
        return announcement;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: error.getCode(),
              statusCode: error.getStatusCode(),
            },
          });
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
      if (!context.customer) {
        throw new AuthenticationError();
      }
      try {
        const validatedData = validateAnnouncement(input);
        const announcement = new Announcement(validatedData);
        await announcement.save();
        return await announcement.populate("customer");
      } catch (error) {
        if (error instanceof ZodError) {
          throw new GraphQLError(error.errors[0].message, {
            extensions: {
              code: "VALIDATION_ERROR",
              statusCode: 400,
            },
          });
        }
        if (isValidationError(error)) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "VALIDATION_ERROR",
              statusCode: 400,
            },
          });
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
        ).populate("customer");
        if (!announcement) {
          throw new NotFoundError("Announcement");
        }
        return announcement;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: error.getCode(),
              statusCode: error.getStatusCode(),
            },
          });
        }
        if (error instanceof ZodError) {
          throw new GraphQLError(error.errors[0].message, {
            extensions: {
              code: "VALIDATION_ERROR",
              statusCode: 400,
            },
          });
        }
        if (isValidationError(error)) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "VALIDATION_ERROR",
              statusCode: 400,
            },
          });
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
          throw new GraphQLError(error.message, {
            extensions: {
              code: error.getCode(),
              statusCode: error.getStatusCode(),
            },
          });
        }
        throw new DatabaseError("Failed to delete announcement");
      }
    },
  },
};

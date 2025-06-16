// src/graphql/schema.ts
import { ApolloServer } from "@apollo/server";
// import { expressMiddleware } from '@apollo/server/express4';
import { announcementType } from "./types/announcement.js";
import { customerType } from "./types/customer.js";

interface GraphQLError {
  message: string;
  extensions?: {
    originalError?: {
      message?: string;
    };
    stack?: string;
  };
}

// Combine all type definitions
export const typeDefs = `
    ${announcementType}
    ${customerType}
`;

// Import resolvers (we'll create these next)
import { announcementResolvers } from "./resolvers/announcement.js";
import { customerResolvers } from "./resolvers/customer.js";

// Combine all resolvers
export const resolvers = {
  Query: {
    ...announcementResolvers.Query,
    ...customerResolvers.Query,
  },
  Mutation: {
    ...announcementResolvers.Mutation,
    ...customerResolvers.Mutation,
  },
  // Add any custom type resolvers here
  Customer: {
    // Add any customer-specific resolvers here
  },
  Announcement: {
    // Add any announcement-specific resolvers here
  },
};

// Create Apollo Server instance
export const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Add any additional server options here
  formatError: (error: GraphQLError) => {
    // Remove stack trace in production
    const originalError = error.extensions?.originalError;
    return {
      ...error,
      message: originalError?.message || error.message,
      extensions: {
        ...error.extensions,
        stack:
          process.env.NODE_ENV === "production"
            ? undefined
            : error.extensions?.stack,
      },
    };
  },
});

// src/graphql/schema.ts
import { ApolloServer } from "@apollo/server";
// import { expressMiddleware } from '@apollo/server/express4';
import { announcementType } from "./types/announcement.js";
import { customerType } from "./types/customer.js";
import logger from "../config/logger.js";

interface ApolloError {
  message: string;
  extensions?: {
    originalError?: {
      message?: string;
      statusCode?: number;
      code?: string;
    };
    code?: string;
    statusCode?: number;
    stack?: string;
  };
}

// Combine all type definitions
export const typeDefs = `
    ${announcementType}
    ${customerType}
`;

// Import resolvers
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
  formatError: (error: ApolloError) => {
    const originalError = error.extensions?.originalError;
    let statusCode = 500;
    let code = "INTERNAL_SERVER_ERROR";

    // Handle GraphQL validation errors
    if (error.extensions?.code === "GRAPHQL_VALIDATION_FAILED") {
      statusCode = 400;
      code = "VALIDATION_ERROR";
    }
    // Handle our custom errors
    else if (error.extensions?.code) {
      statusCode = error.extensions.statusCode || 500;
      code = error.extensions.code;
    }
    // Handle other errors
    else if (originalError) {
      statusCode = originalError.statusCode || 500;
      code = originalError.code || "INTERNAL_SERVER_ERROR";
    }

    // Log the error
    logger.error({
      message: error.message,
      code,
      statusCode,
      stack:
        process.env.NODE_ENV === "production"
          ? undefined
          : error.extensions?.stack,
    });

    return {
      message: error.message,
      extensions: {
        code,
        statusCode,
        stack:
          process.env.NODE_ENV === "production"
            ? undefined
            : error.extensions?.stack,
      },
    };
  },
  plugins: [
    {
      async requestDidStart() {
        const startTime = Date.now();
        return {
          async didResolveOperation(requestContext) {
            const operation = requestContext.operation?.operation;
            const operationName = requestContext.operationName;
            const variables = requestContext.request.variables;
            logger.info({
              message: "GraphQL Operation Started",
              operation,
              operationName,
              variables,
              timestamp: new Date().toISOString(),
            });
          },
          async willSendResponse(requestContext) {
            const duration = Date.now() - startTime;
            const operation = requestContext.operation?.operation;
            const operationName = requestContext.operationName;
            logger.info({
              message: "GraphQL Operation Completed",
              operation,
              operationName,
              duration: `${duration}ms`,
              timestamp: new Date().toISOString(),
            });
          },
          async didEncounterErrors(requestContext) {
            const errors = requestContext.errors;
            const operation = requestContext.operation?.operation;
            const operationName = requestContext.operationName;
            logger.error({
              message: "GraphQL Operation Error",
              operation,
              operationName,
              errors: errors.map((e) => ({
                message: e.message,
                code: e.extensions?.code,
                statusCode: e.extensions?.statusCode,
              })),
              timestamp: new Date().toISOString(),
            });
          },
        };
      },
    },
  ],
});

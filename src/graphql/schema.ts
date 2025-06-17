// src/graphql/schema.ts
import { ApolloServer } from "@apollo/server";
import { GraphQLFormattedError } from "graphql";
import { announcementType } from "./types/announcement.js";
import { customerType } from "./types/customer.js";
import { authType } from "./types/auth.js";
import { announcementResolvers } from "./resolvers/announcement.js";
import { customerResolvers } from "./resolvers/customer.js";
import { authResolvers } from "./resolvers/auth.js";
import logger from "../config/logger.js";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";

// Combine type definitions
const typeDefs = [announcementType, customerType, authType];

// Combine resolvers
const resolvers = {
  Query: {
    ...announcementResolvers.Query,
    ...customerResolvers.Query,
  },
  Mutation: {
    ...announcementResolvers.Mutation,
    ...customerResolvers.Mutation,
    ...authResolvers.Mutation,
  },
};

interface ApolloError {
  message: string;
  extensions?: {
    code?: string;
    statusCode?: number;
  };
}

interface GraphQLRequestWithOperation {
  operation?: {
    operation?: string;
  };
}

// Create Apollo Server instance
export const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error: GraphQLFormattedError) => {
    const originalError = (error as { originalError?: ApolloError })
      .originalError;

    // If the error already has extensions, use them
    if (error.extensions) {
      // Remove stack trace from extensions
      const extensions = { ...error.extensions };
      delete extensions.stacktrace;
      return {
        message: error.message,
        extensions,
      };
    }

    // Otherwise, format the error with appropriate status code and code
    const statusCode = originalError?.extensions?.statusCode || 500;
    const code = originalError?.extensions?.code || "INTERNAL_SERVER_ERROR";

    // Log the error without stack trace
    logger.error("GraphQL Error", {
      message: error.message,
      code,
      statusCode,
      path: error.path,
    });

    return {
      message: error.message,
      extensions: {
        code,
        statusCode,
      },
    };
  },
  plugins: [
    {
      async requestDidStart() {
        return {
          async willSendResponse(requestContext) {
            const { request, response } = requestContext;
            const operation =
              (request as GraphQLRequestWithOperation).operation?.operation ||
              "unknown";
            const operationName = request.operationName || "unnamed";

            if (response.body.kind === "single") {
              const errors = response.body.singleResult.errors;
              if (errors?.length) {
                // Log errors without stack traces
                logger.error("GraphQL Operation Error", {
                  operation,
                  operationName,
                  errors: errors.map((e) => ({
                    message: e.message,
                    code: e.extensions?.code,
                    statusCode: e.extensions?.statusCode,
                  })),
                });
              } else {
                logger.info("GraphQL Operation Success", {
                  operation,
                  operationName,
                });
              }
            }
          },
        };
      },
    },
    // Add the GraphQL Playground plugin
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
  // Enable introspection and disable CSRF prevention for the Playground
  introspection: true,
  csrfPrevention: false,
});

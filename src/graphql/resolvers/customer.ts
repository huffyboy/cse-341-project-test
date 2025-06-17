// src/graphql/resolvers/customer.ts
import {
  validateCustomer,
  validateCustomerUpdate,
  CustomerInput,
  CustomerUpdateInput,
} from "../../schemas/customer.zod.js";
import { Customer, ICustomer } from "../../models/customer.js";
import {
  NotFoundError,
  DatabaseError,
  AuthenticationError,
} from "../../utils/errors.js";
import { GraphQLError } from "graphql";
import { GraphQLContext } from "../context.js";
import { ZodError } from "zod";

export const customerResolvers = {
  Query: {
    customers: async () => {
      try {
        return await Customer.find();
      } catch {
        throw new DatabaseError("Failed to fetch customers");
      }
    },
    customer: async (_: unknown, { id }: { id: string }) => {
      try {
        const customer = await Customer.findById(id);
        if (!customer) {
          throw new NotFoundError("Customer");
        }
        return customer;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: error.getCode(),
              statusCode: error.getStatusCode(),
            },
          });
        }
        throw new DatabaseError("Failed to fetch customer");
      }
    },
  },
  Mutation: {
    createCustomer: async (
      _: unknown,
      { input }: { input: CustomerInput },
      context: GraphQLContext
    ) => {
      if (!context.customer) throw new AuthenticationError();
      try {
        const validatedData = validateCustomer(input);
        const customer = new Customer(validatedData);
        return await customer.save();
      } catch (error) {
        if (error instanceof ZodError) {
          const message = error.errors[0]?.message || "Validation error";
          throw new GraphQLError(message, {
            extensions: {
              code: "VALIDATION_ERROR",
              statusCode: 400,
            },
          });
        }
        throw new DatabaseError("Failed to create customer");
      }
    },
    updateCustomer: async (
      _: unknown,
      { id, input }: { id: string; input: CustomerUpdateInput },
      context: GraphQLContext
    ) => {
      if (!context.customer) throw new AuthenticationError();
      try {
        const validatedData = validateCustomerUpdate(input);
        const customer = await Customer.findOneAndUpdate(
          { _id: id },
          { $set: validatedData },
          {
            new: true,
            runValidators: true,
          }
        );
        if (!customer) {
          throw new NotFoundError("Customer");
        }
        // Manually check and update accountSetupComplete
        customer.accountSetupComplete = customer.isAccountSetupComplete();
        await customer.save();
        return customer;
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
          const message = error.errors[0]?.message || "Validation error";
          throw new GraphQLError(message, {
            extensions: {
              code: "VALIDATION_ERROR",
              statusCode: 400,
            },
          });
        }

        throw new GraphQLError("Failed to update customer", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500,
          },
        });
      }
    },
    deleteCustomer: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.customer) throw new AuthenticationError();
      try {
        const customer = await Customer.findByIdAndDelete(id);
        if (!customer) {
          throw new NotFoundError("Customer");
        }
        return true;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new DatabaseError("Failed to delete customer");
      }
    },
  },
  Customer: {
    accountSetupComplete: (parent: ICustomer) =>
      parent.accountSetupComplete ?? false,
  },
};

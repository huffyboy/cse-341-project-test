// src/graphql/resolvers/customer.ts
import {
  validateCustomer,
  validateCustomerUpdate,
  CustomerInput,
  CustomerUpdateInput,
} from "../../schemas/customer.zod.js";
import { Customer } from "../../models/customer.js";

export const customerResolvers = {
  Query: {
    customers: async () => {
      return await Customer.find();
    },
    customer: async (_: unknown, { id }: { id: string }) => {
      return await Customer.findById(id);
    },
  },
  Mutation: {
    createCustomer: async (_: unknown, { input }: { input: CustomerInput }) => {
      const validatedData = validateCustomer(input);
      const customer = new Customer(validatedData);
      return await customer.save();
    },
    updateCustomer: async (
      _: unknown,
      { id, input }: { id: string; input: CustomerUpdateInput }
    ) => {
      const validatedData = validateCustomerUpdate(input);
      return await Customer.findByIdAndUpdate(id, validatedData, { new: true });
    },
    deleteCustomer: async (_: unknown, { id }: { id: string }) => {
      await Customer.findByIdAndDelete(id);
      return true;
    },
  },
};

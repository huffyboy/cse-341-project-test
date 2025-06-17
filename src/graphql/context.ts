import { ICustomer, Customer } from "../models/customer.js";
import { verifyToken } from "../utils/auth.js";

export interface GraphQLContext {
  token?: string;
  customer?: ICustomer;
}

export const createContext = async (req: {
  headers: { authorization?: string };
}): Promise<GraphQLContext> => {
  const context: GraphQLContext = {};

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    context.token = token;
    try {
      const payload = verifyToken(token);
      const customer = await Customer.findById(payload.customerId);
      if (customer) {
        context.customer = customer;
      }
    } catch {
      // Invalid token, do not set customer
    }
  }

  return context;
};

import { Customer } from "../../models/customer.js";
import { generateToken } from "../../utils/auth.js";
import { NotFoundError } from "../../utils/errors.js";
import passport from "passport";
import { Document } from "mongoose";
import { ICustomer } from "../../models/customer.js";
import logger from "../../config/logger.js";

interface CustomerDocument extends Document {
  _id: string;
  email: string;
  oauthProviders: Array<{
    provider: string;
    providerId: string;
    displayName?: string;
    email?: string;
    profileUrl?: string;
  }>;
  toObject(): ICustomer;
}

export const authResolvers = {
  Mutation: {
    authenticateWithGithub: async (
      parent: unknown,
      { code }: { code: string }
    ) => {
      void parent;

      return new Promise((resolve, reject) => {
        passport.authenticate(
          "github",
          { session: false },
          (err: Error | null, customer: CustomerDocument | null) => {
            if (err) {
              logger.error("GitHub Auth Error:", err);
              reject(err);
              return;
            }
            if (!customer) {
              logger.error("No customer returned from GitHub auth");
              reject(new Error("Failed to authenticate with GitHub"));
              return;
            }

            logger.info("GitHub Auth Success:", {
              customerId: customer._id,
              email: customer.email,
              oauthProviders: customer.oauthProviders,
            });

            resolve({
              token: generateToken(customer._id.toString()),
              customer: {
                ...customer.toObject(),
                _id: customer._id.toString(),
              },
            });
          }
        )({ query: { code } });
      });
    },
    refreshToken: async (
      parent: unknown,
      args: unknown,
      context: { token?: string }
    ) => {
      void parent;
      void args;
      if (!context.token) {
        throw new Error("No token provided");
      }

      const customer = await Customer.findOne({
        "oauthProviders.providerId": context.token,
      });
      if (!customer) {
        throw new NotFoundError("Customer not found");
      }

      return {
        token: generateToken(customer._id.toString()),
        customer: {
          ...customer.toObject(),
          _id: customer._id.toString(),
        },
      };
    },
  },
};

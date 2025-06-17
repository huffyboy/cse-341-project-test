import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import jwt from "jsonwebtoken";
import { Customer } from "../models/customer.js";
import { Profile } from "passport";
import { VerifyCallback } from "passport-oauth2";
import logger from "../config/logger.js";

// Load environment variables
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined");
}

// JWT token generation
export const generateToken = (customerId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ customerId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);
};

// JWT token verification
export const verifyToken = (token: string): { customerId: string } => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, process.env.JWT_SECRET) as { customerId: string };
};

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: `${process.env.URL || "http://localhost:3000"}/auth/github/callback`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        logger.info("GitHub Profile:", {
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          emails: profile.emails,
          photos: profile.photos,
        });

        // Find or create customer
        let customer = await Customer.findOne({
          "oauthProviders.provider": "github",
          "oauthProviders.providerId": profile.id,
        });

        if (!customer) {
          // Create new customer if not found
          const email =
            profile.emails?.[0]?.value || `${profile.username}@github.user`;

          customer = await Customer.create({
            email,
            oauthProviders: [
              {
                provider: "github",
                providerId: profile.id,
                displayName: profile.displayName || profile.username,
                email,
                profileUrl: profile.photos?.[0]?.value,
              },
            ],
          });
        }

        logger.info("Customer created/found:", {
          id: customer._id,
          email: customer.email,
          oauthProviders: customer.oauthProviders,
        });

        done(null, customer);
      } catch (error) {
        logger.error("GitHub Strategy Error:", error);
        done(error as Error);
      }
    }
  )
);

export default passport;

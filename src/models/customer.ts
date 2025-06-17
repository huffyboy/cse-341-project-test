// src/models/Customer.ts
import mongoose from "mongoose";

export interface IOAuthProvider {
  provider: "google" | "github";
  providerId: string;
  displayName?: string;
  email?: string;
  profileUrl?: string;
}

export interface ICustomer {
  _id: mongoose.Types.ObjectId;
  orgName?: string;
  orgHandle?: string;
  email?: string;
  phone?: string;
  timezone?: string;
  marketingConsent?: boolean;
  oauthProviders: IOAuthProvider[];
  accountSetupComplete: boolean;
  isAccountSetupComplete(): boolean;
}

const customerSchema = new mongoose.Schema<ICustomer>(
  {
    orgName: {
      type: String,
      required: false,
    },
    orgHandle: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Allows null/undefined values to be unique
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Allows null/undefined values to be unique
    },
    phone: {
      type: String,
    },
    timezone: {
      type: String,
      required: false,
      default: "UTC",
    },
    marketingConsent: {
      type: Boolean,
      required: false,
      default: false,
    },
    oauthProviders: [
      {
        provider: {
          type: String,
          enum: ["google", "github"],
          required: true,
        },
        providerId: {
          type: String,
          required: true,
        },
        displayName: String,
        email: String,
        profileUrl: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    accountSetupComplete: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add a method to check if account setup is complete
customerSchema.methods.isAccountSetupComplete = function (): boolean {
  const hasValidOAuth = this.oauthProviders && this.oauthProviders.length > 0;
  const hasRequiredFields = Boolean(
    this.orgName &&
      this.orgHandle &&
      this.email &&
      this.timezone &&
      this.marketingConsent !== undefined
  );

  return hasValidOAuth && hasRequiredFields;
};

// Pre-save middleware to update accountSetupComplete
customerSchema.pre("save", function (this: ICustomer, next) {
  this.accountSetupComplete = this.isAccountSetupComplete();
  next();
});

export const Customer = mongoose.model<ICustomer>("Customer", customerSchema);

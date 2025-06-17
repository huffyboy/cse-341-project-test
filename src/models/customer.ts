// src/models/Customer.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOauthProvider {
  _id: mongoose.Types.ObjectId;
  providerId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomer extends Document {
  _id: mongoose.Types.ObjectId;
  orgName: string;
  orgHandle: string;
  timezone: string;
  email: string;
  phone: string;
  oauthProviders: IOauthProvider[];
  accountSetupComplete: boolean;
  marketingConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OauthProviderSchema = new Schema<IOauthProvider>(
  {
    providerId: { type: String, required: true },
    email: { type: String, required: false },
  },
  { timestamps: true }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    orgName: { type: String, required: true },
    orgHandle: { type: String, required: true },
    timezone: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    phone: { type: String, required: false, unique: true },
    oauthProviders: { type: [OauthProviderSchema], required: true },
    accountSetupComplete: { type: Boolean, default: false },
    marketingConsent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);

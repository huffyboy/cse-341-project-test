// src/models/Customer.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOauthProvider {
    _id: mongoose.Types.ObjectId;
    provider_id: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export interface ICustomer extends Document {
    _id: mongoose.Types.ObjectId;
    org_name: string;
    org_phandle: string;
    timezone: string;
    email: string;
    phone: string;
    oauth_providers: IOauthProvider[];
    account_setup_complete: boolean;
    marketing_consent: boolean;
    created_at: Date;
    updated_at: Date;
}

const OauthProviderSchema = new Schema<IOauthProvider>({
    provider_id: { type: String, required: true },
    email: { type: String, required: false },
}, { timestamps: true });

const CustomerSchema = new Schema<ICustomer>({
    org_name: { type: String, required: true },
    org_phandle: { type: String, required: true },
    timezone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    oauth_providers: { type: [OauthProviderSchema], required: true },
    account_setup_complete: { type: Boolean, default: false },
    marketing_consent: { type: Boolean, default: false },
}, { timestamps: true });

export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);

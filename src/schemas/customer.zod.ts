// src/schemas/customer.zod.ts
import { z } from "zod";

// OAuth provider schema
const oauthProviderSchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  email: z.string().email("Invalid email address").optional(),
});

// Base schema for common fields
const baseCustomerSchema = z.object({
  orgName: z
    .string()
    .min(1, "Organization name is required")
    .max(100, "Organization name must be less than 100 characters")
    .trim(),
  orgHandle: z
    .string()
    .trim()
    .min(3, "Organization handle must be at least 3 characters")
    .max(30, "Organization handle must be less than 30 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Organization handle can only contain lowercase letters, numbers, and hyphens"
    )
    .transform((val) => val.toLowerCase())
    .refine(
      (val) => !val.includes("--"),
      "Organization handle cannot contain consecutive hyphens"
    )
    .refine(
      (val) => !val.includes(" "),
      "Organization handle cannot contain spaces"
    ),
  timezone: z
    .string()
    .min(1, "Timezone is required")
    .refine((tz) => {
      try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
      } catch {
        return false;
      }
    }, "Invalid timezone"),
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional(),
  oauthProviders: z
    .array(oauthProviderSchema)
    .min(1, "At least one OAuth provider is required"),
  accountSetupComplete: z.boolean().default(false),
  marketingConsent: z.boolean().default(false),
});

// Schema for creating a new customer
export const customerSchema = baseCustomerSchema;

// Schema for updating an existing customer
export const customerUpdateSchema = baseCustomerSchema
  .extend({
    oauthProviders: z.array(oauthProviderSchema).optional(),
  })
  .partial();

// Type inference
export type CustomerInput = z.infer<typeof customerSchema>;
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>;

// Validation functions
export const validateCustomer = (data: unknown) => customerSchema.parse(data);
export const validateCustomerUpdate = (data: unknown) =>
  customerUpdateSchema.parse(data);

// src/graphql/types/customer.ts
export const customerType = `
    "A customer of the system"
    type Customer {
        "Unique identifier for the customer"
        _id: ID!
        "The name of the customer's organization"
        orgName: String!
        "The handle to interact with the customer's organization"
        orgHandle: String!
        "The timezone of the customer"
        timezone: String!
        "The email of the customer"
        email: String!
        "The phone number of the customer"
        phone: String!
        "Whether the customer has completed account setup"
        accountSetupComplete: Boolean!
        "Whether the customer has given marketing consent"
        marketingConsent: Boolean!
        "The OAuth providers connected to this customer"
        oauthProviders: [OAuthProvider!]!
        "When the customer was created"
        createdAt: String!
        "When the customer was last updated"
        updatedAt: String!
    }

    "OAuth provider information for a customer"
    type OAuthProvider {
        "Unique identifier for the OAuth provider"
        _id: ID!
        "The provider's unique identifier"
        providerId: String!
        "The email associated with this OAuth provider (if available)"
        email: String
        "When this OAuth provider was connected"
        createdAt: String!
        "When this OAuth provider was last updated"
        updatedAt: String!
    }

    input CustomerInput {
        "The name of the customer's organization"
        orgName: String!
        "The handle to interact with the customer's organization"
        orgHandle: String!
        "The timezone of the customer"
        timezone: String!
        "The email of the customer"
        email: String!
        "The phone number of the customer"
        phone: String!
        "Whether the customer has given marketing consent"
        marketingConsent: Boolean!
    }

    input CustomerUpdateInput {
        "The name of the customer's organization"
        orgName: String
        "The handle to interact with the customer's organization"
        orgHandle: String
        "The timezone of the customer"
        timezone: String
        "The email of the customer"
        email: String
        "The phone number of the customer"
        phone: String
        "Whether the customer has completed account setup"
        accountSetupComplete: Boolean
        "Whether the customer has given marketing consent"
        marketingConsent: Boolean
    }

    type Query {
        "Get all customers"
        customers: [Customer!]!
        "Get a specific customer by ID"
        customer(id: ID!): Customer!
    }

    type Mutation {
        "Create a new customer"
        createCustomer(input: CustomerInput!): Customer!
        "Update an existing customer"
        updateCustomer(id: ID!, input: CustomerUpdateInput!): Customer!
        "Delete a customer"
        deleteCustomer(id: ID!): Boolean!
    }
`;

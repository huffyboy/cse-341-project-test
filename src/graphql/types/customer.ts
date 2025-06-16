// src/graphql/types/customer.ts
export const customerType = `
    "A customer of the system"
    type Customer {
        "Unique identifier for the customer"
        _id: ID!
        "The name of the customer's organization"
        org_name: String!
        "The handle to interact with the customer's organization"
        org_handle: String!
        "The timezone of the customer"
        timezone: String!
        "The email of the customer"
        email: String!
        "The phone number of the customer"
        phone: String!
        "Whether the customer has completed account setup"
        account_setup_complete: Boolean!
        "Whether the customer has given marketing consent"
        marketing_consent: Boolean!
        "The OAuth providers connected to this customer"
        oauth_providers: [OAuthProvider!]!
        "When the customer was created"
        created_at: String!
        "When the customer was last updated"
        updated_at: String!
    }

    "OAuth provider information for a customer"
    type OAuthProvider {
        "Unique identifier for the OAuth provider"
        _id: ID!
        "The email associated with this OAuth provider (if available)"
        email: String
        "When this OAuth provider was connected"
        created_at: String!
    }

    input CustomerInput {
        "The name of the customer's organization"
        org_name: String!
        "The handle to interact with the customer's organization"
        org_handle: String!
        "The timezone of the customer"
        timezone: String!
        "The email of the customer"
        email: String!
        "The phone number of the customer"
        phone: String!
        "Whether the customer has given marketing consent"
        marketing_consent: Boolean!
    }

    input CustomerUpdateInput {
        "The name of the customer's organization"
        org_name: String
        "The handle to interact with the customer's organization"
        org_handle: String
        "The timezone of the customer"
        timezone: String
        "The email of the customer"
        email: String
        "The phone number of the customer"
        phone: String
        "Whether the customer has completed account setup"
        account_setup_complete: Boolean
        "Whether the customer has given marketing consent"
        marketing_consent: Boolean
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

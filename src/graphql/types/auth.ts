import { gql } from "apollo-server-express";

export const authType = gql`
  type AuthPayload {
    token: String!
    customer: Customer!
  }

  type OAuthProvider {
    provider: String!
    providerId: String!
    displayName: String
    email: String
    profileUrl: String
  }

  extend type Customer {
    oauthProviders: [OAuthProvider!]!
  }

  extend type Mutation {
    # OAuth authentication
    authenticateWithGithub(code: String!): AuthPayload!

    # Token refresh
    refreshToken: AuthPayload!
  }
`;

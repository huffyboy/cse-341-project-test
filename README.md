# Technical Documentation

## Project Structure

```text
.
├── src/
│   ├── config/         # Configuration files
│   ├── graphql/
│   │   ├── types/
│   │   │   ├── customer.ts      # Customer GraphQL type definitions
│   │   │   ├── announcement.ts  # Announcement GraphQL type definitions
│   │   │   └── auth.ts          # Authentication GraphQL type definitions
│   │   ├── resolvers/
│   │   │   ├── customer.ts      # Customer GraphQL resolvers
│   │   │   ├── announcement.ts  # Announcement GraphQL resolvers
│   │   │   └── auth.ts          # Authentication GraphQL resolvers
│   │   ├── context.ts           # GraphQL context with authentication
│   │   └── schema.ts            # Main GraphQL schema and server setup
│   ├── middlewares/   # Express middlewares
│   ├── models/
│   │   ├── customer.ts          # Customer database model
│   │   └── announcement.ts      # Announcement database model
│   ├── schemas/
│   │   ├── customer.zod.ts      # Customer validation schema
│   │   └── announcement.zod.ts  # Announcement validation schema
│   ├── utils/         # Utility functions
│   │   ├── auth.ts              # Authentication utilities
│   │   └── errors.ts            # Error handling utilities
│   └── server.ts      # Main server entry point
├── public/            # Static files
├── dist/              # Compiled output
├── tsconfig.json      # TypeScript configuration
├── package.json       # Project dependencies and scripts
├── pnpm-lock.yaml     # PNPM lock file
├── eslint.config.js   # ESLint configuration (flat config format)
├── .prettierrc.json   # Prettier configuration
├── .prettierignore    # Prettier ignore patterns
└── .gitignore         # Git ignore patterns
```

## Tech Stack

- Node.js with TypeScript
- Apollo Server for GraphQL
  - Operation logging for debugging and monitoring
  - Error handling with stack traces in development
  - Interactive API documentation via GraphQL Playground
- Express.js
- MongoDB (based on schema structure)
- Zod for runtime validation
- ESLint with flat config format
- Prettier for code formatting
- Passport.js for OAuth authentication
  - GitHub OAuth2 strategy
  - JWT token-based session management

## Authentication

### OAuth Implementation

The application uses GitHub OAuth2 for authentication:

1. **OAuth Flow**:

   - User clicks "Login with GitHub"
   - Redirects to GitHub for authorization
   - GitHub redirects back with an authorization code
   - Server exchanges code for access token
   - Creates/updates customer record with GitHub profile data

2. **Customer Creation**:

   - Minimal customer record created with OAuth provider info
   - Required fields are optional initially
   - `accountSetupComplete` flag tracks setup progress
   - Fields can be updated later via GraphQL mutations

3. **JWT Token**:
   - Generated after successful OAuth authentication
   - Contains customer ID
   - Used for subsequent authenticated requests
   - Set in Authorization header: `Bearer <token>`

### GraphQL Authentication

1. **Context**:

   - Token extracted from Authorization header
   - Customer loaded from database
   - Available in all resolvers

2. **Protected Operations**:
   - Customer profile updates
   - Announcement management
   - Other authenticated operations

## Error Handling

All errors follow a consistent format in GraphQL responses:

```json
{
  "errors": [{
    "message": "Error message",
    "extensions": {
      "code": "ERROR_CODE",
      "statusCode": 400/404/500
    }
  }]
}
```

### Error Logging

- All errors are logged with:
  - Error message
  - Error code
  - Status code
  - Stack trace (in development only)
- Operation logging includes:
  - Operation type
  - Operation name
  - Duration
  - Error details (if any)

## API Documentation

The API documentation is available through GraphQL Playground at `/graphql`

## GraphQL Schema

### Types

1. Customer (`src/graphql/types/customer.ts`)

   - GraphQL type definitions for Customer
   - Core customer data model
   - Optional fields for OAuth flow

2. Announcement (`src/graphql/types/announcement.ts`)

   - GraphQL type definitions for Announcement
   - Announcement data model

3. Auth (`src/graphql/types/auth.ts`)
   - Authentication types
   - OAuth provider information
   - JWT token handling

### Resolvers

1. Customer (`src/graphql/resolvers/customer.ts`)

   - Query and Mutation resolvers for Customer operations
   - Profile updates and management

2. Announcement (`src/graphql/resolvers/announcement.ts`)

   - Query and Mutation resolvers for Announcement operations

3. Auth (`src/graphql/resolvers/auth.ts`)
   - OAuth authentication
   - Token refresh
   - Session management

### Data Models

1. Customer (`src/models/customer.ts`)

   - MongoDB model for Customer collection
   - OAuth provider integration
   - Account setup tracking

2. Announcement (`src/models/announcement.ts`)
   - MongoDB model for Announcement collection

### Validation Schemas

1. Customer (`src/schemas/customer.zod.ts`)

   - Zod validation schema for Customer data
   - Field validation rules
   - Update validation

2. Announcement (`src/schemas/announcement.zod.ts`)
   - Zod validation schema for Announcement data

## Development

- TypeScript configuration in `tsconfig.json`
- ESLint and Prettier for code formatting
- PNPM as package manager
- GraphQL schema validation and error handling configured
- Consistent camelCase naming convention for all models and fields

# Technical Documentation

## Project Structure

```text
.
├── src/
│   ├── config/         # Configuration files
│   ├── graphql/
│   │   ├── types/
│   │   │   ├── customer.ts      # Customer GraphQL type definitions
│   │   │   └── announcement.ts  # Announcement GraphQL type definitions
│   │   ├── resolvers/
│   │   │   ├── customer.ts      # Customer GraphQL resolvers
│   │   │   └── announcement.ts  # Announcement GraphQL resolvers
│   │   └── schema.ts            # Main GraphQL schema and server setup
│   ├── middlewares/   # Express middlewares
│   ├── models/
│   │   ├── customer.ts          # Customer database model
│   │   └── announcement.ts      # Announcement database model
│   ├── schemas/
│   │   ├── customer.zod.ts      # Customer validation schema
│   │   └── announcement.zod.ts  # Announcement validation schema
│   ├── utils/         # Utility functions
│   └── server.ts      # Main server entry point
├── dist/              # Compiled output
├── tsconfig.json      # TypeScript configuration
├── package.json       # Project dependencies and scripts
├── pnpm-lock.yaml     # PNPM lock file
├── eslint.config.js   # ESLint configuration
├── .eslintignore      # ESLint ignore patterns
├── .prettierrc.json   # Prettier configuration
├── .prettierignore    # Prettier ignore patterns
└── .gitignore         # Git ignore patterns
```

## Tech Stack

- Node.js with TypeScript
- Apollo Server for GraphQL
- Express.js
- MongoDB (based on schema structure)
- Zod for runtime validation

## GraphQL Schema

### Types

1. Customer (`src/graphql/types/customer.ts`)

   - GraphQL type definitions for Customer
   - Core customer data model

2. Announcement (`src/graphql/types/announcement.ts`)
   - GraphQL type definitions for Announcement
   - Announcement data model

### Resolvers

1. Customer (`src/graphql/resolvers/customer.ts`)

   - Query and Mutation resolvers for Customer operations

2. Announcement (`src/graphql/resolvers/announcement.ts`)
   - Query and Mutation resolvers for Announcement operations

### Data Models

1. Customer (`src/models/customer.ts`)

   - MongoDB model for Customer collection

2. Announcement (`src/models/announcement.ts`)
   - MongoDB model for Announcement collection

### Validation Schemas

1. Customer (`src/schemas/customer.zod.ts`)

   - Zod validation schema for Customer data

2. Announcement (`src/schemas/announcement.zod.ts`)
   - Zod validation schema for Announcement data

## Development

- TypeScript configuration in `tsconfig.json`
- ESLint and Prettier for code formatting
- PNPM as package manager
- GraphQL schema validation and error handling configured

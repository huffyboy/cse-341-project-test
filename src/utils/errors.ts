// src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    // eslint-disable-next-line no-unused-vars
    public statusCode: number = 500,
    // eslint-disable-next-line no-unused-vars
    public code: string = "INTERNAL_SERVER_ERROR"
  ) {
    super(message);
    this.name = "AppError";
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  getCode(): string {
    return this.code;
  }

  toJSON(): Record<string, unknown> {
    return {
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      name: this.name,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Not authorized to perform this action") {
    super(message, 403, "FORBIDDEN");
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(message, 500, "DATABASE_ERROR");
  }
}

export const isValidationError = (
  error: unknown
): error is Error & { name: string } => {
  return error instanceof Error && error.name === "ValidationError";
};

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError("An unexpected error occurred");
};

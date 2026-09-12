export type ErrorCode =
  | "INVALID_IMAGE"
  | "IMAGE_TOO_LARGE"
  | "UNSUPPORTED_IMAGE_TYPE"
  | "MODEL_IMAGE_INVALID"
  | "JEWELRY_IMAGE_INVALID"
  | "INVALID_CATEGORY"
  | "INVALID_SETTINGS"
  | "AI_PROVIDER_ERROR"
  | "AI_TIMEOUT"
  | "STORAGE_ERROR"
  | "RATE_LIMITED"
  | "UNAUTHORIZED"
  | "AUTH_REQUIRED"
  | "FORBIDDEN"
  | "MEMBERSHIP_REQUIRED"
  | "MEMBERSHIP_PENDING"
  | "MEMBERSHIP_EXPIRED"
  | "LIMIT_EXCEEDED"
  | "DUPLICATE_UTR"
  | "ALREADY_APPROVED"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 400,
    details?: unknown,
    isOperational: boolean = true
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code: ErrorCode = "INVALID_IMAGE", details?: unknown) {
    super(code, message, 400, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests. Please try again later.") {
    super("RATE_LIMITED", message, 429);
  }
}

export class AiProviderError extends AppError {
  constructor(message: string, details?: unknown) {
    super("AI_PROVIDER_ERROR", message, 502, details);
  }
}

export class AiTimeoutError extends AppError {
  constructor(message: string = "AI generation timed out. Please try again.") {
    super("AI_TIMEOUT", message, 504);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found.") {
    super("NOT_FOUND", message, 404);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required.", details?: unknown) {
    super("AUTH_REQUIRED", message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden.", details?: unknown) {
    super("FORBIDDEN", message, 403, details);
  }
}

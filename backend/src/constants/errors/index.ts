export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  BUSINESS_RULE_ERROR: 'BUSINESS_RULE_ERROR',
} as const;

export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Request validation failed',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  CONFLICT: 'Resource conflict',
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred',
  DATABASE_ERROR: 'Database operation failed',
  BUSINESS_RULE_ERROR: 'Business rule violation',
} as const;

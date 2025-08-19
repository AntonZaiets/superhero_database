export class AppError extends Error {
  constructor(message, statusCode = 500, details = undefined) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(msg, details) {
    return new AppError(msg, 400, details);
  }

  static notFound(details, msg = 'Not found') {
    return new AppError(msg, 404, details);
  }

  static unsupported(details, msg = 'Unsupported') {
    return new AppError(msg, 415, details);
  }

  static internal(details, msg = 'Internal server error') {
    return new AppError(msg, 500, details);
  }
}

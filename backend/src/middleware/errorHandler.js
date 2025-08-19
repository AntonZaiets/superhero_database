import { logger } from '../lib/logger.js';

export const errorHandler = (err, req, res) => {
  const status = err?.statusCode || 500;

  logger.error({
    msg: err.message,
    status,
    path: req.path,
    method: req.method,
    details: err.details,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  res.status(status).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      details: err.details,
    },
  });
};

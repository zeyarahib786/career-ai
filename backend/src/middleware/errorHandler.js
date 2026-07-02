'use strict';
const logger = require('../services/logger');

const errorHandler = (err, req, res, _next) => {
  let status  = err.statusCode || 500;
  let message = err.message    || 'Internal Server Error';

  if (err.name === 'ValidationError')
    { status = 400; message = Object.values(err.errors).map(e => e.message).join(', '); }
  if (err.code === 11000)
    { status = 409; message = `Duplicate: ${Object.keys(err.keyValue||{})[0]}`; }
  if (err.name === 'CastError')
    { status = 400; message = `Invalid value for: ${err.path}`; }
  if (err.name === 'JsonWebTokenError')  { status = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError')  { status = 401; message = 'Token expired'; }
  if (err.type === 'entity.too.large')   { status = 413; message = 'Request too large'; }

  if (status >= 500) logger.error('Server error', {
    message: err.message, stack: err.stack, url: req.originalUrl, method: req.method,
    requestId: req.requestId,
  });

  res.status(status).json({
    success: false, error: message,
    requestId: req.requestId,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

const notFound = (req, res) => res.status(404).json({
  success:false, error:`Not found: ${req.method} ${req.originalUrl}`, requestId: req.requestId
});

module.exports = { errorHandler, notFound };

'use strict';
require('dotenv').config();

const required = ['MONGODB_URI','JWT_SECRET','SMTP_HOST','EMAIL_FROM_ADDRESS'];
required.forEach(k => {
  if (!process.env[k]) throw new Error(`Missing required env var: ${k}`);
});

module.exports = {
  env:        process.env.NODE_ENV     || 'development',
  port:       parseInt(process.env.PORT, 10) || 5000,
  apiVersion: process.env.API_VERSION  || 'v1',
  isDev:      process.env.NODE_ENV     !== 'production',

  db:   { uri: process.env.MONGODB_URI },

  jwt:  { secret: process.env.JWT_SECRET, expire: process.env.JWT_EXPIRE || '7d' },

  cors: { origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map(s => s.trim()) },

  email: {
    host:        process.env.SMTP_HOST,
    port:        parseInt(process.env.SMTP_PORT, 10) || 587,
    secure:      process.env.SMTP_SECURE === 'true',
    user:        process.env.SMTP_USER,
    pass:        process.env.SMTP_PASS,
    fromName:    process.env.EMAIL_FROM_NAME    || 'Solvagence Global AI Academy',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || 'academy@solvagence.com',
    academy:     process.env.EMAIL_ACADEMY      || 'academy@solvagence.com',
    leaders:     process.env.EMAIL_LEADERS      || 'leaders@solvagence.com',
  },

  stripe: {
    secretKey:     process.env.STRIPE_SECRET_KEY      || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET  || '',
  },

  rateLimit: {
    windowMs:      parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max:           parseInt(process.env.RATE_LIMIT_MAX, 10)        || 100,
    enrollmentMax: parseInt(process.env.ENROLLMENT_RATE_LIMIT_MAX, 10) || 5,
  },

  vat: {
    rate:    parseFloat(process.env.VAT_RATE)    || 0.05,
    country: process.env.VAT_COUNTRY             || 'AE',
  },

  log: {
    level: process.env.LOG_LEVEL || 'info',
    dir:   process.env.LOG_DIR   || './logs',
  },
};

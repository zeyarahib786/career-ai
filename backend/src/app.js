'use strict';
const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const compression= require('compression');
const morgan     = require('morgan');
const config     = require('./config/env');
const logger     = require('./services/logger');
const requestId  = require('./middleware/requestId');
const { apiLimiter }             = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ── Request ID (correlation / tracing) ─────────────────────────────────────
app.use(requestId);

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", 'https://fonts.googleapis.com'],
      fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:      ["'self'", 'data:', 'https:'],
      connectSrc:  ["'self'"],
      objectSrc:   ["'none'"],
      frameAncestors: ["'none'"],
      baseUri:     ["'self'"],
      formAction:  ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || config.cors.origins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Request-ID'],
  exposedHeaders: ['X-Request-ID','X-Total-Count'],
}));

// ── Body parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit:'10kb' }));
app.use(express.urlencoded({ extended:false, limit:'10kb' }));

// ── Compression ─────────────────────────────────────────────────────────────
app.use(compression());

// ── HTTP logging ─────────────────────────────────────────────────────────────
app.use(config.isDev
  ? morgan('dev')
  : morgan('combined', { stream:{ write: msg => logger.http(msg.trim()) } })
);

// ── Rate limiting ────────────────────────────────────────────────────────────
app.use(`/api/${config.apiVersion}`, apiLimiter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({
  status:'ok', service:'Solvagence Global AI Academy API',
  version:config.apiVersion, env:config.env, ts:new Date().toISOString(),
}));

// ── API routes ────────────────────────────────────────────────────────────────
const base = `/api/${config.apiVersion}`;
app.use(`${base}/certifications`, require('./routes/certifications'));
app.use(`${base}/tracks`,         require('./routes/tracks'));
app.use(`${base}/enrollments`,    require('./routes/enrollments'));
app.use(`${base}/pricing`,        require('./routes/pricing'));

// ── 404 / Error ───────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;

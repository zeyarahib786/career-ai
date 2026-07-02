'use strict';
const rateLimit = require('express-rate-limit');
const config    = require('../config/env');

const msg = (text) => ({ success:false, error:text });

exports.apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max:      config.rateLimit.max,
  standardHeaders:true, legacyHeaders:false,
  message:  msg('Too many requests — please try again later'),
  skip: () => process.env.NODE_ENV === 'test',
});

exports.enrollmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      config.rateLimit.enrollmentMax,
  message:  msg('Too many enrollment attempts — please wait 15 minutes'),
  skip: () => process.env.NODE_ENV === 'test',
});

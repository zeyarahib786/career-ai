'use strict';
const { Router } = require('express');
const ctrl = require('../controllers/enrollmentController');
const { enrollmentRules, refParam, validate } = require('../middleware/validate');
const { enrollmentLimiter } = require('../middleware/rateLimiter');

const r = Router();
r.post('/',              enrollmentLimiter, enrollmentRules, validate, ctrl.create);
r.get('/:reference',     [refParam, validate], ctrl.getByReference);
module.exports = r;

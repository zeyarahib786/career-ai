'use strict';
const { Router } = require('express');
const ctrl = require('../controllers/pricingController');
const { pricingRules, validate } = require('../middleware/validate');

const r = Router();
r.post('/calculate', pricingRules, validate, ctrl.calculate);
r.get('/rules',      ctrl.getRules);
module.exports = r;

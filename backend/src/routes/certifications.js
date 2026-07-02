'use strict';
const { Router } = require('express');
const ctrl = require('../controllers/certificationController');
const { localeQuery, certCode, trackId, validate } = require('../middleware/validate');

const r = Router();
r.get('/',                      [localeQuery, validate], ctrl.getAll);
r.get('/track/:id',             [trackId, localeQuery, validate], ctrl.getByTrack);
r.get('/:code',                 [certCode, localeQuery, validate], ctrl.getOne);
module.exports = r;

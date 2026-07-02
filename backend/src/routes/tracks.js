'use strict';
const { Router } = require('express');
const ctrl = require('../controllers/trackController');
const { localeQuery, trackId, validate } = require('../middleware/validate');

const r = Router();
r.get('/',     [localeQuery, validate], ctrl.getAll);
r.get('/:id',  [trackId, localeQuery, validate], ctrl.getOne);
module.exports = r;

'use strict';
const { body, param, query, validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({
    success:false, error:'Validation failed',
    details: errs.array().map(e => ({ field:e.path, message:e.msg })),
  });
  next();
};

exports.enrollmentRules = [
  body('firstName').trim().notEmpty().isLength({ min:2, max:100 }).withMessage('First name required'),
  body('lastName').trim().notEmpty().isLength({ min:2, max:100 }).withMessage('Last name required'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').trim().notEmpty().withMessage('Phone required'),
  body('country').trim().notEmpty().isLength({ min:2, max:3 }).withMessage('Country required'),
  body('jobTitle').trim().notEmpty().withMessage('Job title required'),
  body('organisation').trim().notEmpty().withMessage('Organisation required'),
  body('certificationCodes').isArray({ min:1 }).withMessage('Select at least one certification'),
  body('certificationCodes.*').matches(/^SGA-0[1-6]$/).withMessage('Invalid certification code'),
  body('cohortType').isIn(['individual','team']).withMessage('Invalid cohort type'),
  body('seats').optional().isInt({ min:1, max:999 }).withMessage('Seats must be 1–999'),
  body('dataConsent').equals('true').withMessage('Data consent required'),
];

exports.pricingRules = [
  body('certificationCodes').isArray({ min:1 }).withMessage('Certification codes required'),
  body('certificationCodes.*').matches(/^SGA-0[1-6]$/).withMessage('Invalid code'),
  body('seats').optional().isInt({ min:1 }),
  body('cohortType').optional().isIn(['individual','team']),
  body('country').optional().isLength({ min:2, max:3 }),
];

exports.localeQuery = query('locale').optional().isIn(['en','ar']).withMessage('locale must be en or ar');
exports.certCode    = param('code').matches(/^SGA-0[1-6]$/).withMessage('Invalid cert code');
exports.trackId     = param('id').isIn(['t1','t2','t3','t4']).withMessage('Invalid track id');
exports.refParam    = param('reference').matches(/^SGA-[A-Z0-9]+$/).withMessage('Invalid reference');

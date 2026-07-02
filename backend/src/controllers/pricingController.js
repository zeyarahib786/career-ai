'use strict';
const Certification  = require('../models/Certification');
const pricingService = require('../services/pricingService');
const AppError       = require('../utils/AppError');

const calculate = async (req, res, next) => {
  try {
    const { certificationCodes, seats=1, cohortType='individual', country='' } = req.body;
    const certs = await Certification.find({ code:{ $in:certificationCodes }, isActive:true });
    if (!certs.length) return next(new AppError('No valid certifications found', 400));
    const pricing = pricingService.calculateFromDocs(certs, seats, cohortType, country);
    res.json({ success:true, data:pricing });
  } catch (err) { next(err); }
};

const getRules = (_req, res) => res.json({ success:true, data: {
  currency:'USD', vatRate:0.05, vatAppliesIn:['AE'],
  vatNote:'UAE VAT 5% applies when billing country is AE',
  bundleDiscount:{ minCertifications:2, rate:0.05, description:'5% for 2+ certifications' },
  teamDiscounts: pricingService.TEAM_TIERS.map(t => ({
    minSeats:t.min, maxSeats:t.max===Infinity?null:t.max, rate:t.rate })),
}});

module.exports = { calculate, getRules };

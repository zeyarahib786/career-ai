'use strict';
const config = require('../config/env');

const BUNDLE_RATE = 0.05;   // 5% for 2+ certs
const TEAM_TIERS = [
  { min:15, max:Infinity, rate:'custom' },
  { min:6,  max:14,       rate:0.20 },
  { min:2,  max:5,        rate:0.10 },
  { min:1,  max:1,        rate:0 },
];

/**
 * Calculate pricing from raw cert prices.
 * Mirrors frontend pricing logic exactly for consistency.
 */
const calculate = (certPrices, seats, cohortType, country = '') => {
  if (!certPrices || !certPrices.length) throw new Error('No certifications selected');

  const certCount  = certPrices.length;
  const seatCount  = Math.max(1, parseInt(seats, 10) || 1);
  const basePerSeat= certPrices.reduce((s, p) => s + p, 0);
  const subtotal   = basePerSeat * seatCount;

  const bundleRate   = certCount >= 2 ? BUNDLE_RATE : 0;
  const bundleAmount = Math.round(subtotal * bundleRate * 100) / 100;
  const afterBundle  = subtotal - bundleAmount;

  let teamRate = 0;
  const isCustom = cohortType === 'team' && seatCount >= 15;
  if (cohortType === 'team' && !isCustom) {
    const tier = TEAM_TIERS.find(t => seatCount >= t.min && seatCount <= t.max);
    teamRate = (tier && tier.rate !== 'custom') ? tier.rate : 0;
  }
  const teamAmount   = Math.round(afterBundle * teamRate * 100) / 100;
  const afterDiscount= afterBundle - teamAmount;
  const discountTotal= bundleAmount + teamAmount;

  const vatApplies = country.toUpperCase() === config.vat.country;
  const vatRate    = vatApplies ? config.vat.rate : 0;
  const vatAmount  = Math.round(afterDiscount * vatRate * 100) / 100;
  const total      = afterDiscount + vatAmount;

  return {
    certCount,
    seats:            seatCount,
    cohortType,
    basePerSeat,
    subtotalUSD:      Math.round(subtotal * 100) / 100,
    bundleRate,
    bundleAmountUSD:  bundleAmount,
    teamRate,
    teamAmountUSD:    teamAmount,
    discountUSD:      Math.round(discountTotal * 100) / 100,
    afterDiscountUSD: Math.round(afterDiscount * 100) / 100,
    vatApplies,
    vatRate,
    vatAmountUSD:     vatAmount,
    totalUSD:         Math.round(total * 100) / 100,
    currency:         'USD',
    isCustom,
    customMessage:    isCustom ? 'Contact leaders@solvagence.com for enterprise pricing' : null,
    savings:          Math.round(discountTotal * 100) / 100,
  };
};

const calculateFromDocs = (certDocs, seats, cohortType, country) =>
  calculate(certDocs.map(c => c.priceUSD), seats, cohortType, country);

module.exports = { calculate, calculateFromDocs, BUNDLE_RATE, TEAM_TIERS };

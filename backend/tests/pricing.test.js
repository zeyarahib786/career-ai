'use strict';
// Stub env before any require that chains to config/env.js
process.env.MONGODB_URI        = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET         = 'test_secret_32_chars_minimum_xxx';
process.env.SMTP_HOST          = 'smtp.test.local';
process.env.EMAIL_FROM_ADDRESS = 'test@test.com';
process.env.NODE_ENV           = 'test';
process.env.VAT_RATE           = '0.05';
process.env.VAT_COUNTRY        = 'AE';

const { calculate } = require('../src/services/pricingService');

describe('PricingService', () => {
  test('single cert, individual, no VAT', () => {
    const r = calculate([1495], 1, 'individual', 'GB');
    expect(r.subtotalUSD).toBe(1495);
    expect(r.bundleRate).toBe(0);
    expect(r.vatApplies).toBe(false);
    expect(r.totalUSD).toBe(1495);
  });

  test('bundle discount 5% for 2+ certs', () => {
    const r = calculate([1495, 1795], 1, 'individual', 'GB');
    expect(r.bundleRate).toBe(0.05);
    expect(r.bundleAmountUSD).toBe(164.5);
    expect(r.afterDiscountUSD).toBe(3290 - 164.5);
  });

  test('team 10% for 2-5 seats', () => {
    const r = calculate([1495], 3, 'team', 'GB');
    expect(r.teamRate).toBe(0.10);
    expect(r.teamAmountUSD).toBeGreaterThan(0);
  });

  test('team 20% for 6-14 seats', () => {
    const r = calculate([1495], 8, 'team', 'GB');
    expect(r.teamRate).toBe(0.20);
  });

  test('UAE VAT 5% applies for country AE', () => {
    const r = calculate([1495], 1, 'individual', 'AE');
    expect(r.vatApplies).toBe(true);
    expect(r.vatRate).toBe(0.05);
    expect(r.totalUSD).toBeGreaterThan(r.afterDiscountUSD);
  });

  test('15+ seats → isCustom enterprise', () => {
    const r = calculate([1495], 20, 'team', 'GB');
    expect(r.isCustom).toBe(true);
    expect(r.customMessage).toBeTruthy();
  });

  test('empty cert prices throws', () => {
    expect(() => calculate([], 1, 'individual', 'GB')).toThrow('No certifications selected');
  });

  test('bundle + UAE VAT combined', () => {
    const r = calculate([1495, 1795], 1, 'individual', 'AE');
    expect(r.bundleRate).toBe(0.05);
    expect(r.vatApplies).toBe(true);
    expect(r.totalUSD).toBeGreaterThan(r.afterDiscountUSD);
  });
});

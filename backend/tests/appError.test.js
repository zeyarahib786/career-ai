'use strict';
const AppError = require('../src/utils/AppError');
describe('AppError', () => {
  test('message and statusCode', () => {
    const e = new AppError('not found', 404);
    expect(e.message).toBe('not found'); expect(e.statusCode).toBe(404); expect(e.isOperational).toBe(true);
  });
  test('defaults to 500', () => { expect(new AppError('err').statusCode).toBe(500); });
});

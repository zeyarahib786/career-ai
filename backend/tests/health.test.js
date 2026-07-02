'use strict';
// Set required env vars BEFORE any imports so env.js validation passes
process.env.MONGODB_URI     = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET      = 'test_secret_32_chars_minimum_xxx';
process.env.SMTP_HOST       = 'smtp.test.local';
process.env.EMAIL_FROM_ADDRESS = 'test@test.com';
process.env.NODE_ENV        = 'test';

jest.mock('../src/config/database', () => ({
  connectDB:    jest.fn().mockResolvedValue(undefined),
  disconnectDB: jest.fn().mockResolvedValue(undefined),
}));

const request = require('supertest');
const app     = require('../src/app');

describe('API core', () => {
  it('GET /health → 200 with ok status', async () => {
    const r = await request(app).get('/health');
    expect(r.status).toBe(200);
    expect(r.body.status).toBe('ok');
    expect(r.body.service).toContain('Solvagence');
  });

  it('GET unknown route → 404', async () => {
    const r = await request(app).get('/api/v1/not-a-real-route');
    expect(r.status).toBe(404);
    expect(r.body.success).toBe(false);
  });

  it('GET /api/v1/pricing/rules → 200', async () => {
    const r = await request(app).get('/api/v1/pricing/rules');
    expect(r.status).toBe(200);
    expect(r.body.data.currency).toBe('USD');
  });

  it('POST /api/v1/pricing/calculate validates input → 400', async () => {
    const r = await request(app)
      .post('/api/v1/pricing/calculate')
      .send({ certificationCodes: ['INVALID'] });
    expect(r.status).toBe(400);
    expect(r.body.success).toBe(false);
  });
});

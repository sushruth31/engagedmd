import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from './app.js';

const app = buildApp();

describe('POST /api/validate', () => {
  it('returns valid + card type for a good number', async () => {
    const res = await request(app).post('/api/validate').send({ cardNumber: '4532015112830366' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ valid: true, cardType: 'Visa' });
  });

  it('returns valid:false with a reason for a bad number', async () => {
    const res = await request(app).post('/api/validate').send({ cardNumber: '4532015112830367' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ valid: false });
  });

  it('rejects a missing cardNumber field with 400', async () => {
    const res = await request(app).post('/api/validate').send({});
    expect(res.status).toBe(400);
  });

  it('rejects malformed JSON with 400', async () => {
    const res = await request(app)
      .post('/api/validate')
      .set('Content-Type', 'application/json')
      .send('{bad json');
    expect(res.status).toBe(400);
  });

  it('rejects an oversized body with 413', async () => {
    const res = await request(app).post('/api/validate').send({ cardNumber: '4'.repeat(2000) });
    expect(res.status).toBe(413);
  });
});

describe('GET /health', () => {
  it('reports ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

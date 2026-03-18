const request = require('supertest');
const app = require('../src/app');

describe('App – Core Routes', () => {
  describe('GET /api/health', () => {
    it('should return 200 and status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('message', 'ShopSmart Backend is running');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /', () => {
    it('should return welcome text', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('ShopSmart Backend Service');
    });
  });

  describe('Unknown routes', () => {
    it('should return 404 for unknown API route', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });
});

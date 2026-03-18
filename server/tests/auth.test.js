const jwt = require('jsonwebtoken');

// We test the generateToken pattern and the middleware logic in isolation

describe('Auth – Token Generation', () => {
  const JWT_SECRET = process.env.JWT_SECRET;

  it('should generate a valid JWT token', () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
  });

  it('should decode to the correct user id', () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(token, JWT_SECRET);

    expect(decoded.id).toBe(userId);
  });

  it('should reject token signed with wrong secret', () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = jwt.sign({ id: userId }, 'wrong-secret', { expiresIn: '1h' });

    expect(() => {
      jwt.verify(token, JWT_SECRET);
    }).toThrow();
  });

  it('should reject expired tokens', () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '0s' });

    // Small delay to ensure expiry
    expect(() => {
      jwt.verify(token, JWT_SECRET);
    }).toThrow();
  });
});

describe('Auth – Middleware Logic', () => {
  it('should reject request without Authorization header', async () => {
    const request = require('supertest');
    const app = require('../src/app');

    const res = await request(app).get('/api/auth/profile');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('should reject request with malformed token', async () => {
    const request = require('supertest');
    const app = require('../src/app');

    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalid-token-here');

    expect(res.statusCode).toBe(401);
  });
});

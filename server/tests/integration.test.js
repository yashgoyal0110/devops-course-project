const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');

/**
 * Integration tests: Test the interaction between multiple modules
 * (routes + middleware + models) working together through HTTP.
 *
 * These mock only the database layer to test the full Express pipeline.
 */

const bcrypt = require('bcryptjs');
const hashedPassword = bcrypt.hashSync('password123', 10);

const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'test@example.com',
  password: hashedPassword,
  role: 'user',
  createdAt: new Date(),
  matchPassword: async function (entered) {
    return bcrypt.compare(entered, this.password);
  },
  save: jest.fn().mockResolvedValue(true)
};

// Mock User model for auth integration
jest.mock('../src/models/User', () => {
  const Model = jest.fn();

  Model.findOne = jest.fn().mockImplementation((query) => {
    if (query.email === 'test@example.com') {
      // For login: .select('+password') is chained
      // For register check: no .select
      return {
        select: jest.fn().mockResolvedValue(mockUser)
      };
    }
    // For new users — return null (user doesn't exist)
    // Register route calls findOne without .select, login calls with .select
    return {
      select: jest.fn().mockResolvedValue(null)
    };
  });

  Model.findById = jest.fn().mockImplementation((id) => {
    if (id === '507f1f77bcf86cd799439011') {
      return {
        select: jest.fn().mockResolvedValue(mockUser)
      };
    }
    return {
      select: jest.fn().mockResolvedValue(null)
    };
  });

  Model.create = jest.fn().mockResolvedValue({
    _id: '507f1f77bcf86cd799439099',
    name: 'New User',
    email: 'new@example.com',
    role: 'user'
  });

  return Model;
});

jest.mock('../src/models/Product', () => jest.fn());
jest.mock('../src/models/Category', () => jest.fn());
jest.mock('../src/models/Cart', () => jest.fn());
jest.mock('../src/models/Order', () => jest.fn());

describe('Integration – Auth Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Re-setup the mocks after clearing
    const User = require('../src/models/User');

    User.findOne.mockImplementation((query) => {
      if (query && query.email === 'test@example.com') {
        return {
          select: jest.fn().mockResolvedValue(mockUser)
        };
      }
      // New emails return null (no select needed for register check)
      return null;
    });

    // findById must work both ways:
    //   - middleware: User.findById(id).select('-password')  → chainable
    //   - profile route: await User.findById(id)             → thenable (Promise-like)
    User.findById.mockImplementation((id) => {
      const user =
        id === '507f1f77bcf86cd799439011'
          ? {
              _id: '507f1f77bcf86cd799439011',
              name: 'Test User',
              email: 'test@example.com',
              role: 'user',
              createdAt: new Date()
            }
          : null;

      return {
        select: jest.fn().mockResolvedValue(user),
        then: (resolve, reject) => Promise.resolve(user).then(resolve, reject)
      };
    });

    User.create.mockResolvedValue({
      _id: '507f1f77bcf86cd799439099',
      name: 'New User',
      email: 'new@example.com',
      role: 'user'
    });
  });

  it('should register a new user and return token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'New User', email: 'new@example.com', password: 'password123' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should reject registering an existing email', async () => {
    const User = require('../src/models/User');
    // Override findOne to simulate existing user for this test
    User.findOne.mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser)
    }));

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('should login with valid credentials and return token', async () => {
    const User = require('../src/models/User');
    User.findOne.mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser)
    }));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', '507f1f77bcf86cd799439011');
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('name', 'Test User');
  });

  it('should reject login with wrong password', async () => {
    const User = require('../src/models/User');
    User.findOne.mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser)
    }));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should access protected profile route with valid token', async () => {
    const token = jwt.sign(
      { id: '507f1f77bcf86cd799439011' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const User = require('../src/models/User');
    const profileUser = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      createdAt: new Date()
    };
    // The protect middleware calls User.findById(decoded.id).select('-password')
    // The profile route calls await User.findById(req.user._id) directly
    User.findById.mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(profileUser),
      then: (resolve, reject) => Promise.resolve(profileUser).then(resolve, reject)
    }));

    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Test User');
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  it('should reject protected route without token', async () => {
    const res = await request(app).get('/api/auth/profile');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});

describe('Integration – Health + Root', () => {
  it('health endpoint returns timestamp in ISO format', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);

    const timestamp = new Date(res.body.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(isNaN(timestamp.getTime())).toBe(false);
  });
});

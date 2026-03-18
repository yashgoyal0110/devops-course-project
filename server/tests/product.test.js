const request = require('supertest');
const app = require('../src/app');

// Mock Mongoose models so tests don't need a real DB
jest.mock('../src/models/Product', () => {
  const mockProducts = [
    {
      _id: '60d5ec49f1b2c72b7c8e4a01',
      name: 'Test Product 1',
      description: 'A test product',
      price: 999,
      originalPrice: 1499,
      stock: 10,
      rating: 4.5,
      numReviews: 12,
      featured: true,
      category: { _id: '60d5ec49f1b2c72b7c8e4b01', name: 'Electronics' },
      reviews: [],
      createdAt: new Date()
    },
    {
      _id: '60d5ec49f1b2c72b7c8e4a02',
      name: 'Test Product 2',
      description: 'Another test product',
      price: 499,
      stock: 5,
      rating: 3.8,
      numReviews: 4,
      featured: false,
      category: { _id: '60d5ec49f1b2c72b7c8e4b02', name: 'Clothing' },
      reviews: [],
      createdAt: new Date()
    }
  ];

  const chainable = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(mockProducts)
  };

  const Model = jest.fn();
  Model.find = jest.fn().mockReturnValue(chainable);
  Model.findById = jest.fn().mockImplementation((id) => {
    const product = mockProducts.find((p) => p._id === id);
    return {
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(product || null)
      })
    };
  });
  Model.countDocuments = jest.fn().mockResolvedValue(mockProducts.length);

  return Model;
});

jest.mock('../src/models/Category', () => jest.fn());
jest.mock('../src/models/Cart', () => jest.fn());
jest.mock('../src/models/Order', () => jest.fn());
jest.mock('../src/models/User', () => jest.fn());

describe('Products API – Unit Tests', () => {
  describe('GET /api/products', () => {
    it('should return paginated product list', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('products');
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('pages');
      expect(res.body).toHaveProperty('total');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product by id', async () => {
      const res = await request(app).get(
        '/api/products/60d5ec49f1b2c72b7c8e4a01'
      );
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Test Product 1');
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get(
        '/api/products/60d5ec49f1b2c72b7c8e4a99'
      );
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Product not found');
    });
  });
});

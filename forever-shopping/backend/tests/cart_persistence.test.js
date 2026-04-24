
import { jest } from '@jest/globals';
import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

let mongod;
let app;
let request;
let userToken;
let userId;

// Mock Cloudinary as server.js connects to it
jest.unstable_mockModule('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URL = mongod.getUri();
  process.env.JWT_SECRET = 'testsecret';
  process.env.NODE_ENV = 'test';
  
  // Dynamic import to allow mocking
  const mod = await import('../server.js');
  app = mod.default;
  request = supertest(app);
}, 30000);

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }
});

describe('Cart Persistence Flow', () => {
  
  test('1. Should register a new user', async () => {
    const res = await request
      .post('/api/user/register')
      .send({
        name: 'Cart Test User',
        email: 'carttest@example.com',
        password: 'password123'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    userToken = res.body.token;
    // We don't get userId in register response based on some controllers, 
    // but we can decode token or login to get it if needed.
    // Let's verify login gives us userId.
  });

  test('2. Should login and get token/userId', async () => {
    const res = await request
      .post('/api/user/login')
      .send({
        email: 'carttest@example.com',
        password: 'password123'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    userToken = res.body.token; // Update token (though it should be same/valid)
    userId = res.body.userId;
    expect(userId).toBeDefined();
  });

  test('3. Should add item to cart', async () => {
    const res = await request
      .post('/api/cart/add')
      .set('token', userToken)
      .send({
        itemId: 'product_123',
        size: 'M',
        quantity: 2
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Item added to cart successfully");
  });

  test('4. Should retrieve cart and verify item exists', async () => {
    const res = await request
      .post('/api/cart/get')
      .set('token', userToken)
      .send({});
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const cartData = res.body.cartData;
    expect(cartData).toBeDefined();
    expect(cartData['product_123']).toBeDefined();
    expect(cartData['product_123']['M']).toBe(2);
  });

  test('5. Should maintain cart data after "logout" and "login"', async () => {
    // Simulate logout by clearing client-side token (no backend action needed)
    let tempToken = null;

    // Simulate login
    const loginRes = await request
      .post('/api/user/login')
      .send({
        email: 'carttest@example.com',
        password: 'password123'
      });
    
    expect(loginRes.status).toBe(200);
    tempToken = loginRes.body.token;

    // Fetch cart with new token
    const cartRes = await request
      .post('/api/cart/get')
      .set('token', tempToken)
      .send({});
    
    expect(cartRes.status).toBe(200);
    expect(cartRes.body.success).toBe(true);
    const cartData = cartRes.body.cartData;
    
    // Verify persistence
    expect(cartData['product_123']).toBeDefined();
    expect(cartData['product_123']['M']).toBe(2);
  });
});

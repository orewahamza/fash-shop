import { jest } from '@jest/globals';
import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

const onePxPngBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

let mongod;
let app;
let request;
let adminToken;

jest.unstable_mockModule('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url:
          'https://res.cloudinary.com/demo/image/upload/v123/products/test.png',
        public_id: 'products/test',
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
  },
}));

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URL = mongod.getUri();
  process.env.JWT_SECRET = 'testsecret';
  process.env.ADMIN_EMAIL = 'admin@example.com';
  process.env.ADMIN_PASSWORD = 'admin123';
  process.env.CLOUDINARY_NAME = 'demo';
  process.env.CLOUDINARY_API_KEY = 'key';
  process.env.CLOUDINARY_SECRET_KEY = 'secret';
  const mod = await import('../server.js');
  app = mod.default;
  request = supertest(app);
  adminToken = jwt.sign(
    process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD,
    process.env.JWT_SECRET
  );
});

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }
});

describe('Product API', () => {
  let createdId;

  test('GET / should respond', async () => {
    const res = await request.get('/');
    expect(res.status).toBe(200);
  });

  test('POST /api/product/ fails without image', async () => {
    const res = await request
      .post('/api/product/')
      .set('token', adminToken)
      .field('name', 'Test Shirt')
      .field('description', 'Nice shirt')
      .field('price', '20')
      .field('category', 'Men')
      .field('subCategory', 'Topwear')
      .field('bestseller', 'false')
      .field('sizes', JSON.stringify(['M', 'L']));
    expect(res.status).toBe(400);
  });

  test('POST /api/product/ creates product', async () => {
    const buffer = Buffer.from(onePxPngBase64, 'base64');
    const res = await request
      .post('/api/product/')
      .set('token', adminToken)
      .field('name', 'Test Shirt')
      .field('description', 'Nice shirt')
      .field('price', '20')
      .field('category', 'Men')
      .field('subCategory', 'Topwear')
      .field('bestseller', 'false')
      .field('sizes', JSON.stringify(['M', 'L']))
      .attach('image1', buffer, { filename: 'test.png', contentType: 'image/png' });
    
    if (res.status === 500) {
        console.error('Create Product Error:', res.body);
    }
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    createdId = res.body.data.product._id;
    expect(createdId).toBeDefined();
  });

  test('GET /api/product/:id returns product', async () => {
    const res = await request.get(`/api/product/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product._id).toBe(createdId);
  });

  test('PUT /api/product/:id updates product', async () => {
    const res = await request
      .put(`/api/product/${createdId}`)
      .set('token', adminToken)
      .field('name', 'Updated Shirt')
      .field('price', '25');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.product.name).toBe('Updated Shirt');
  });

  test('GET /api/product/ returns list', async () => {
    const res = await request.get('/api/product/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  test('DELETE /api/product/:id deletes product', async () => {
    const res = await request
      .delete(`/api/product/${createdId}`)
      .set('token', adminToken);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});


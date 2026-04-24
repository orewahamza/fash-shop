
import { jest } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Mock cloudinary
jest.unstable_mockModule('../config/cloudinary.js', () => ({
  default: jest.fn(),
}));

// Mock mongodb config to use our memory server URL
jest.unstable_mockModule('../config/mongodb.js', () => ({
  default: async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URL);
    }
  },
}));

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URL = mongod.getUri();
  process.env.JWT_SECRET = 'testsecret';

  // Dynamic import to pick up mocks
  const mod = await import('../server.js');
  app = mod.default;
}, 30000);

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }
  await mongoose.disconnect();
});

describe('Password Change Flow', () => {
  let token;
  const email = 'passwordtest@example.com';
  const oldPassword = 'password123';
  const newPassword = 'newpassword123';

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Test User',
        email,
        password: oldPassword
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    token = res.body.token;
  });

  it('should verify correct current password', async () => {
    const res = await request(app)
      .post('/api/user/verify-password')
      .set('token', token)
      .send({
        password: oldPassword
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Password verified');
  });

  it('should reject incorrect current password verification', async () => {
    const res = await request(app)
      .post('/api/user/verify-password')
      .set('token', token)
      .send({
        password: 'wrongpassword'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Current password is incorrect');
  });

  it('should fail to change password with incorrect old password', async () => {
    const res = await request(app)
      .post('/api/user/change-password')
      .set('token', token)
      .send({
        oldPassword: 'wrongpassword',
        newPassword: newPassword
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Current password is incorrect');
  });

  it('should fail to change password if new password is too short', async () => {
    const res = await request(app)
      .post('/api/user/change-password')
      .set('token', token)
      .send({
        oldPassword: oldPassword,
        newPassword: 'short'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Password must be at least 8 characters');
  });

  it('should successfully change password', async () => {
    const res = await request(app)
      .post('/api/user/change-password')
      .set('token', token)
      .send({
        oldPassword: oldPassword,
        newPassword: newPassword
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Password changed successfully');
  });

  it('should verify with NEW password', async () => {
    const res = await request(app)
      .post('/api/user/verify-password')
      .set('token', token)
      .send({
        password: newPassword
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should fail verification with OLD password', async () => {
    const res = await request(app)
      .post('/api/user/verify-password')
      .set('token', token)
      .send({
        password: oldPassword
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
  });

  it('should login with new password', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email,
        password: newPassword
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
});

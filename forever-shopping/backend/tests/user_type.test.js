import { jest } from '@jest/globals';
import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;
let app;
let request;

// Mock cloudinary to avoid errors
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


beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URL = mongod.getUri();
  process.env.JWT_SECRET = 'testsecret';
  
  // Dynamic import to pick up mocks
  const mod = await import('../server.js');
  app = mod.default;
  request = supertest(app);
}, 60000);

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }
  await mongoose.disconnect();
});

describe('User Type Toggle System', () => {
  let userToken;
  let userId;
  const userPassword = 'password123';
  const userEmail = 'testuser@example.com';

  test('1. Register a new user', async () => {
    const res = await request.post('/api/user/register').send({
      name: 'Test User',
      email: userEmail,
      password: userPassword,
    });
    if (!res.body.success) {
      console.error('Register failed:', res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    // userType might be under 'type' or 'userType' depending on controller
    // Controller says: res.json({ success: true, token, type: user.type, role: user.role });
    expect(res.body.type).toBe('user');
    userToken = res.body.token;
  });

  test('2. Get Profile returns correct type', async () => {
    const res = await request.get('/api/user/profile').set('token', userToken);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.type).toBe('user');
    userId = res.body.user._id;
  });

  test('3. Change type to host (Success)', async () => {
    const res = await request.post('/api/user/change-type').set('token', userToken).send({
      userId: userId, // The controller uses req.body.userId OR from token?
                      // Wait, auth middleware adds req.body.userId usually?
                      // Let's check auth middleware.
                      // Usually auth middleware decodes token and adds userId to req.body.userId.
                      // But the controller also expects password.
      password: userPassword,
      requestedType: 'host'
    });
    
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User type updated successfully');
    expect(res.body.type).toBe('host');
    expect(res.body.token).toBeDefined(); // Should return new token
    
    // Update token
    userToken = res.body.token;
  });

  test('4. Verify type is now host', async () => {
    const res = await request.get('/api/user/profile').set('token', userToken);
    expect(res.body.user.type).toBe('host');
  });

  test('5. Change type back to user (Success)', async () => {
    const res = await request.post('/api/user/change-type').set('token', userToken).send({
      password: userPassword,
      requestedType: 'user'
    });
    
    expect(res.body.success).toBe(true);
    expect(res.body.type).toBe('user');
    userToken = res.body.token;
  });

  test('6. Verify type is now user', async () => {
    const res = await request.get('/api/user/profile').set('token', userToken);
    expect(res.body.user.type).toBe('user');
  });

  test('7. Fail with wrong password', async () => {
    const res = await request.post('/api/user/change-type').set('token', userToken).send({
      password: 'wrongpassword',
      requestedType: 'host'
    });
    
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid password');
  });

  test('8. Fail with invalid type', async () => {
    const res = await request.post('/api/user/change-type').set('token', userToken).send({
      password: userPassword,
      requestedType: 'superadmin'
    });
    
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid type requested');
  });
});

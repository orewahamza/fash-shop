import { jest } from '@jest/globals';
import supertest from 'supertest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;
let app;
let request;

// Mock cloudinary
jest.unstable_mockModule('../config/cloudinary.js', () => ({
  default: jest.fn(),
}));

// Mock mongodb config
jest.unstable_mockModule('../config/mongodb.js', () => ({
  default: async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URL);
    }
  },
}));

beforeAll(async () => {
  // Start MongoMemoryReplSet for transaction support
  mongod = await MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });
  process.env.MONGODB_URL = mongod.getUri();
  process.env.JWT_SECRET = 'testsecret';
  
  console.log('Test MongoDB URI:', process.env.MONGODB_URL);
  
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

describe('Registration to Host Conversion Flow', () => {
  const userPassword = 'password123';
  const userEmail = `flowtest_${Date.now()}@example.com`;
  let userToken;
  let userId;

  test('1. Should register a new user successfully', async () => {
    const res = await request.post('/api/user/register').send({
      name: 'Flow Test User',
      email: userEmail,
      password: userPassword,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.type).toBe('user');
    
    userToken = res.body.token;
    
    // Verify user is in DB
    const user = await mongoose.model('user').findOne({ email: userEmail });
    expect(user).toBeDefined();
    expect(user.type).toBe('user');
    userId = user._id.toString();
  });

  test('2. Should immediately allow changing type to host (Transaction Test)', async () => {
    const res = await request.post('/api/user/change-type')
      .set('token', userToken) // Token in header
      .send({
        userId: userId, // Assuming client sends userId too, or it's extracted from token
        password: userPassword,
        requestedType: 'host'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User type updated successfully');
    expect(res.body.type).toBe('host');
    
    // Verify DB update
    const user = await mongoose.model('user').findById(userId);
    expect(user.type).toBe('host');
    expect(user.type_changed_at).toBeDefined();
  });

  test('3. Should have created an audit log entry', async () => {
    // AuditLog model name is usually 'auditLog' or similar based on file name
    // Let's check model name in auditLogModel.js. 
    // Assuming 'auditLog'.
    // If not, we can import it dynamically or use mongoose.modelNames()
    
    const logs = await mongoose.model('auditLog').find({ userId: userId });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].action).toBe('USER_TYPE_CHANGE');
    expect(logs[0].details.oldType).toBe('user');
    expect(logs[0].details.newType).toBe('host');
  });

  test('4. Should fail with invalid password', async () => {
     const res = await request.post('/api/user/change-type')
      .set('token', userToken)
      .send({
        userId: userId,
        password: 'wrongpassword',
        requestedType: 'user'
      });
      
     expect(res.body.success).toBe(false);
     expect(res.body.message).toBe('Invalid password');
  });

});

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedAdminProducts } from '../controllers/userController'; // Adjust path if necessary
import userModel from '../models/userModel';
import productModel from '../models/productModel';

// Mock the productModel insertMany and countDocuments to avoid actual DB calls if we were not using MongoMemoryServer
// But here we will use MongoMemoryServer for a realistic test

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await userModel.deleteMany({});
  await productModel.deleteMany({});
});

describe('Seeding Logic', () => {
  it('should create exactly 3 draft products for an admin with 0 products', async () => {
    // Create an admin user - this triggers the post-save hook which seeds products
    const admin = await userModel.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });

    // Wait for hook to complete (it's async)
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify products
    const products = await productModel.find({ ownerId: admin._id });
    expect(products.length).toBe(3);
    products.forEach(product => {
        expect(product.isDraft).toBe(true);
        expect(product.isPublished).toBe(false);
        expect(product.ownerId.toString()).toBe(admin._id.toString());
    });
  });

  it('should create 1 product for an admin with 2 products', async () => {
    // Create a regular user first to avoid auto-seeding
    const user = await userModel.create({
      name: 'Admin User 2',
      email: 'admin2@test.com',
      password: 'password123',
      role: 'user'
    });

    // Manually create 2 products
    await productModel.create([
        {
            name: 'Existing Product 1',
            description: 'Desc',
            price: 50,
            image: ['img1'],
            category: 'Cat',
            subCategory: 'Sub',
            sizes: ['S'],
            date: new Date(),
            ownerId: user._id,
            isDraft: true
        },
        {
            name: 'Existing Product 2',
            description: 'Desc',
            price: 50,
            image: ['img2'],
            category: 'Cat',
            subCategory: 'Sub',
            sizes: ['S'],
            date: new Date(),
            ownerId: user._id,
            isDraft: true
        }
    ]);

    // Manually call seedAdminProducts (simulating migration or role upgrade)
    await seedAdminProducts(user._id);

    const products = await productModel.find({ ownerId: user._id });
    expect(products.length).toBe(3);
  });

  it('should not create any products for an admin with 3 or more products', async () => {
    // Create regular user
    const user = await userModel.create({
      name: 'Admin User 3',
      email: 'admin3@test.com',
      password: 'password123',
      role: 'user'
    });

    // Manually create 3 products
    await productModel.create([
        { name: 'P1', description: 'D', price: 1, image: ['i'], category: 'C', subCategory: 'S', sizes: ['S'], date: new Date(), ownerId: user._id, isDraft: true },
        { name: 'P2', description: 'D', price: 1, image: ['i'], category: 'C', subCategory: 'S', sizes: ['S'], date: new Date(), ownerId: user._id, isDraft: true },
        { name: 'P3', description: 'D', price: 1, image: ['i'], category: 'C', subCategory: 'S', sizes: ['S'], date: new Date(), ownerId: user._id, isDraft: true }
    ]);

    await seedAdminProducts(user._id);

    const products = await productModel.find({ ownerId: user._id });
    expect(products.length).toBe(3);
  });
});

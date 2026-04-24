
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  try {
    console.log("Connecting to:", process.env.MONGODB_URL);
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected.");
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Try to find ANY user
    const anyUser = await mongoose.connection.collection('users').findOne({});
    console.log("Any User:", anyUser);

    // Try to find ANY product
    const anyProduct = await mongoose.connection.collection('products').findOne({});
    console.log("Any Product:", anyProduct);

  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
};
run();

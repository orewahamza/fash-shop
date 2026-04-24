
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  const products = await mongoose.connection.collection('products').find({}).toArray();
  console.log(JSON.stringify(products.map(p => ({id: p._id, name: p.name, ownerId: p.ownerId})), null, 2));
  await mongoose.disconnect();
};
run();

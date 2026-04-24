
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  
  const hosts = await mongoose.connection.collection('users').find({ type: 'host' }).toArray();
  console.log('Hosts:', JSON.stringify(hosts.map(u => ({id: u._id, email: u.email, name: u.name})), null, 2));
  
  const products = await mongoose.connection.collection('products').find({ name: { $regex: 'Graphic Tee', $options: 'i' } }).toArray();
  console.log('Products:', JSON.stringify(products.map(p => ({id: p._id, name: p.name, ownerId: p.ownerId})), null, 2));
  
  await mongoose.disconnect();
};
run();

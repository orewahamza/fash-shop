
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  let uri = process.env.MONGODB_URL;
  if (!uri.includes('/e-commerce')) {
      // Very rough check, but matches the config logic
      uri = uri.replace('mongodb.net', 'mongodb.net/e-commerce');
      if (!uri.includes('/e-commerce')) uri += '/e-commerce'; // fallback
  }
  
  // Clean up if double slash or something (simplified from config)
  // Actually, let's just use the exact logic from config/mongodb.js if possible, 
  // or just hardcode the likely result since I saw the .env
  
  // The .env was: mongodb+srv://...@cluster0.tqtl6q6.mongodb.net
  // So we want: mongodb+srv://...@cluster0.tqtl6q6.mongodb.net/e-commerce
  
  if (!uri.includes('e-commerce')) {
      uri = uri.replace('mongodb.net', 'mongodb.net/e-commerce'); 
      // If it already had a slash at end, it might be .net//e-commerce, but driver handles that usually.
      // Let's be safer:
      if (uri.indexOf('mongodb.net/') === -1) {
         uri = uri.replace('mongodb.net', 'mongodb.net/e-commerce');
      }
  }

  console.log("Connecting to:", uri);
  await mongoose.connect(uri);
  console.log("Connected.");

  const hosts = await mongoose.connection.collection('users').find({ type: 'host' }).toArray();
  console.log(`Found ${hosts.length} hosts.`);
  
  if (hosts.length === 0) {
      console.log("No hosts found. Cannot assign.");
      await mongoose.disconnect();
      return;
  }

  const targetHost = hosts[0]; // Assign to the first host found (likely the user)
  console.log(`Targeting host: ${targetHost.name} (${targetHost._id})`);

  const products = await mongoose.connection.collection('products').find({ name: { $regex: 'Graphic Tee', $options: 'i' } }).toArray();
  console.log(`Found ${products.length} matching products.`);

  if (products.length > 0) {
      const p = products[0];
      await mongoose.connection.collection('products').updateOne(
          { _id: p._id },
          { $set: { ownerId: targetHost._id, isPublished: false } }
      );
      console.log(`UPDATED: Assigned '${p.name}' to ${targetHost.name} and set to Draft.`);
  } else {
      console.log("No matching product found.");
  }

  await mongoose.disconnect();
};
run();

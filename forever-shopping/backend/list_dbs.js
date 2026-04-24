
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  try {
    let uri = process.env.MONGODB_URL;
    // Remove db name if present to connect to admin/root
    // But mongodb+srv usually connects to 'test' by default if no path.
    // Let's use the raw URI from env.
    
    console.log("Connecting to:", uri.replace(/:([^:@]+)@/, ':****@'));
    await mongoose.connect(uri);
    console.log("Connected.");
    
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log("Databases:", dbs.databases.map(d => d.name));

    for (const dbInfo of dbs.databases) {
        const dbName = dbInfo.name;
        if (['admin', 'local', 'config'].includes(dbName)) continue;
        
        console.log(`\nChecking DB: ${dbName}`);
        const db = mongoose.connection.client.db(dbName);
        const collections = await db.listCollections().toArray();
        console.log(`Collections in ${dbName}:`, collections.map(c => c.name));
        
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`  - ${col.name}: ${count} docs`);
            if (col.name === 'products' && count > 0) {
                const sample = await db.collection(col.name).findOne({});
                console.log(`    Sample product: ${sample.name}`);
            }
        }
    }

  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
};
run();

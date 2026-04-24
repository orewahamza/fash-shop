import mongoose from 'mongoose';

const testDirectConnection = async () => {
    console.log('Testing DIRECT MongoDB connection (without SRV)...\n');
    
    // Direct connection to all three shards
    const uri = 'mongodb://abdo138esmail_db_user:Wa4kmdCjzz2lz9dx@cluster0-shard-00-00.gnhtnz5.mongodb.net:27017,cluster0-shard-00-01.gnhtnz5.mongodb.net:27017,cluster0-shard-00-02.gnhtnz5.mongodb.net:27017/e-commerce?ssl=true&replicaSet=atlas-gnhtnz5-shard-0&authSource=admin&retryWrites=true&w=majority';
    
    try {
        console.log('Connecting using direct method...');
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 15000,
        });
        console.log('\n✅ SUCCESS! MongoDB Connected!');
        console.log('Database:', mongoose.connection.name);
        process.exit(0);
    } catch (error) {
        console.error('\n❌ FAILED to connect!');
        console.error('Error:', error.message);
        process.exit(1);
    }
};

testDirectConnection();

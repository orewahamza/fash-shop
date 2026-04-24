import mongoose from 'mongoose';

const testConnection = async () => {
    console.log('Testing MongoDB Atlas connection...\n');
    
    // Try with SRV first
    const uri = 'mongodb+srv://abdo138esmail_db_user:Wa4kmdCjzz2lz9dx@cluster0.gnhtnz5.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0';
    
    try {
        console.log('Connecting to:', uri.replace(/:([^:@]+)@/, ':****@'));
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 10000,
        });
        console.log('\n✅ SUCCESS! MongoDB Connected!');
        console.log('Database:', mongoose.connection.name);
        process.exit(0);
    } catch (error) {
        console.error('\n❌ FAILED to connect!');
        console.error('Error:', error.message);
        console.error('\nPossible solutions:');
        console.error('1. Check if your IP is whitelisted in MongoDB Atlas');
        console.error('2. Check your internet connection');
        console.error('3. Try using a different network');
        console.error('4. Check if firewall is blocking MongoDB');
        process.exit(1);
    }
};

testConnection();

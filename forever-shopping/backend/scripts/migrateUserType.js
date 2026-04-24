import mongoose from 'mongoose';
import userModel from '../models/userModel.js';
import 'dotenv/config';

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        const result = await userModel.updateMany(
            { type: { $exists: false } },
            { $set: { type: 'user', type_changed_at: null, type_changed_by: null } }
        );

        console.log(`Updated ${result.modifiedCount} users.`);

        // Create index
        // Mongoose usually handles this on app start if autoIndex is true, but we can force it here
        await userModel.syncIndexes();
        console.log('Indexes synced.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

migrate();

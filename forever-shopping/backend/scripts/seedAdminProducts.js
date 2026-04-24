import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from '../config/mongodb.js';
import userModel from '../models/userModel.js';
import { seedAdminProducts } from '../utils/seeder.js';

const runMigration = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        const admins = await userModel.find({ role: 'admin' });
        console.log(`Found ${admins.length} admins.`);

        for (const admin of admins) {
            await seedAdminProducts(admin._id);
        }

        console.log("Migration completed.");
        process.exit(0);

    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

runMigration();

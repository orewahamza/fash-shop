
import 'dotenv/config';
import mongoose from 'mongoose';
import productModel from './models/productModel.js';

const connectDB = async () => {
    let base = process.env.MONGODB_URL || '';
    if (base.endsWith('/')) {
        base = base.slice(0, -1);
    }
    const hasDb = /mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/i.test(base);
    const uri = hasDb ? base : `${base}/e-commerce`;
    console.log(`Connecting to: ${uri.replace(/:([^:@]+)@/, ':****@')}`);
    
    try {
        await mongoose.connect(uri);
        console.log('MongoDB Connected');
        
        const products = await productModel.find({});
        console.log(`Total products: ${products.length}`);
        
        products.forEach(p => {
            console.log(`- ${p.name} (Date: ${p.date})`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

connectDB();

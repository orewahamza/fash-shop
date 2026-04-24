import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



//  app congig 
const app = express();
const port = process.env.PORT || 4000;
console.log('Starting server...');
console.log('JEST_WORKER_ID:', process.env.JEST_WORKER_ID);
console.log('NODE_ENV:', process.env.NODE_ENV);

connectDB();
connectCloudinary();


// middlewares
app.use(express.json());
app.use(cors());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});



//  api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Serve Admin Panel (Static Files)
app.use('/admin', express.static(path.join(__dirname, '../admin/dist')));

// Serve Frontend (Static Files)
app.use(express.static(path.join(__dirname, '../frontend/dist')));


// Handle Admin Routing (SPA Fallback)
app.get(/^\/admin\/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/dist/index.html'));
});

// Handle Frontend Routing (SPA Fallback) - Must be last
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


if (!process.env.JEST_WORKER_ID && process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log('Server is running on port : ' + port));
}

export default app;

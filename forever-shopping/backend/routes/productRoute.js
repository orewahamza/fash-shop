import express from 'express';
import {
  listProducts,
  addProduct,
  removeProduct,
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getRecommendations,
  auditProducts,
  auditAndFixProducts,
  listUserProducts
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();


// Legacy endpoints (backward compatibility)
productRouter.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.get('/list', listProducts);
productRouter.get('/user-list', listUserProducts); // Protected by logic inside controller checking token

// RESTful endpoints
productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
productRouter.get('/:id/recommendations', getRecommendations);
productRouter.post('/', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), createProduct);
productRouter.put('/:id', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), updateProduct);
productRouter.delete('/:id', adminAuth, deleteProduct);
productRouter.post('/audit', adminAuth, auditProducts);
productRouter.post('/audit/fix', adminAuth, auditAndFixProducts);


export default productRouter;



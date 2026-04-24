import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category:{ type: String, required: true },
    subCategory:{ type: String, required: true},
    sizes:{ type: Array, required: true },
    stockBySize:{ type: Object, default: {} },
    bestseller:{ type: Boolean, default: false },
    date:{ type: Date, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    isDraft: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true }
})

const productModel = mongoose.models.product || mongoose.model('product', productSchema); 

export default productModel;

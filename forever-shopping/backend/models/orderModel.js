import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    orderNumber: { type: String, required: true, unique: true, default: '' },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { 
        type: String, 
        required: true, 
        default: 'Order Placed',
        enum: ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled']
    },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    paymentId: { type: String },
    date: { type: String, required: true },
    cancelledAt: { type: String },
    cancellationReason: { type: String }
}, {
    timestamps: true,
    collection: 'orders'
});

// Generate unique order number before saving
orderSchema.pre('save', function(next) {
    if (!this.orderNumber || this.orderNumber === '') {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderNumber = `ORD${timestamp}${random}`;
    }
    next();
});

// Index for faster queries
orderSchema.index({ userId: 1, status: 1 });

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;

import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from '../services/orderNotifications.js';

// Application currency
const CURRENCY = "bdt";
const DELIVERY_CHARGES = 10;

// Payment gateway initialization
const stripe = process.env.STRIPE_SECRET_KEY 
    ? new Stripe(process.env.STRIPE_SECRET_KEY) 
    : null;

const razorpayInstance = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
    : null;

/**
 * Format date to readable string (e.g., "24-Jul-2025 07:45 PM")
 */
const formatDateTime = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const time = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    
    return `${day}-${month}-${year} ${time}`;
};

/**
 * Validate order data
 */
const validateOrderData = ({ userId, items, amount, address }) => {
    if (!userId || !items || items.length === 0) {
        throw new Error('Invalid order data');
    }
    
    if (!amount || amount <= 0) {
        throw new Error('Invalid order amount');
    }
    
    if (!address || !address.firstName || !address.street || !address.city || !address.phone) {
        throw new Error('Incomplete address information');
    }
};

/**
 * Build order data object
 */
const buildOrderData = ({ userId, items, amount, address, paymentMethod }) => {
    // Generate unique order number
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `ORD${timestamp}${random}`;
    
    return {
        userId,
        items,
        address,
        amount,
        paymentMethod,
        payment: false,
        date: formatDateTime(Date.now()),
        orderNumber
    };
};

/**
 * Clear user cart after successful order
 */
const clearUserCart = async (userId) => {
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
};

// ==================== ORDER PLACEMENT ====================

/**
 * Place order with Cash on Delivery (COD)
 */
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        
        validateOrderData({ userId, items, amount, address });
        
        const orderData = buildOrderData({
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD"
        });
        
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        
        await clearUserCart(userId);
        
        // Send confirmation email
        try {
            const user = await userModel.findById(userId);
            if (user) {
                await sendOrderConfirmationEmail(newOrder, user.email, user.name);
            }
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
        }
        
        res.json({ 
            success: true, 
            message: "Order placed successfully",
            orderId: newOrder._id,
            orderNumber: newOrder.orderNumber
        });
        
    } catch (error) {
        console.error('Error in placeOrder:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Failed to place order" 
        });
    }
};

/**
 * Place order with Stripe payment
 */
const placeOrderStripe = async (req, res) => {
    try {
        if (!stripe) {
            return res.status(503).json({ 
                success: false, 
                message: 'Stripe payment is not configured' 
            });
        }
        
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;
        
        validateOrderData({ userId, items, amount, address });
        
        const orderData = buildOrderData({
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe"
        });
        
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        
        // Prepare Stripe line items
        const lineItems = items.map((item) => ({
            price_data: {
                currency: CURRENCY,
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image[0]] : []
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity
        }));
        
        lineItems.push({
            price_data: {
                currency: CURRENCY,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: DELIVERY_CHARGES * 100,
            },
            quantity: 1
        });
        
        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items: lineItems,
            mode: 'payment',
        });
        
        res.json({ 
            success: true, 
            session_url: session.url,
            orderId: newOrder._id
        });
        
    } catch (error) {
        console.error('Error in placeOrderStripe:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Failed to create payment session" 
        });
    }
};

/**
 * Verify Stripe payment
 */
const verifyStripe = async (req, res) => {
    try {
        const { orderId, success, userId } = req.body;
        
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { 
                payment: true,
                paymentId: `stripe_${orderId}`
            });
            await clearUserCart(userId);
            
            res.json({ 
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            await orderModel.findByIdAndUpdate(orderId, { 
                status: 'Cancelled',
                cancelledAt: formatDateTime(Date.now()),
                cancellationReason: 'Payment failed'
            });
            
            res.json({ 
                success: false,
                message: "Payment was cancelled"
            });
        }
    } catch (error) {
        console.error('Error in verifyStripe:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Payment verification failed" 
        });
    }
};

/**
 * Place order with Razorpay payment
 */
const placeOrderRazorpay = async (req, res) => {
    try {
        if (!razorpayInstance) {
            return res.status(503).json({ 
                success: false, 
                message: 'Razorpay payment is not configured' 
            });
        }
        
        const { userId, items, amount, address } = req.body;
        
        validateOrderData({ userId, items, amount, address });
        
        const orderData = buildOrderData({
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay"
        });
        
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        
        const options = {
            amount: amount * 100,
            currency: CURRENCY.toUpperCase(),
            receipt: newOrder._id.toString(),
        };
        
        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.error('Razorpay order creation error:', error);
                return res.status(400).json({ 
                    success: false, 
                    message: error.message || "Failed to create Razorpay order" 
                });
            }
            
            res.json({ 
                success: true, 
                order,
                orderId: newOrder._id
            });
        });
        
    } catch (error) {
        console.error('Error in placeOrderRazorpay:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Failed to initiate payment" 
        });
    }
};

/**
 * Verify Razorpay payment
 */
const verifyRazorpay = async (req, res) => {
    try {
        if (!razorpayInstance) {
            return res.status(503).json({ 
                success: false, 
                message: 'Razorpay is not configured' 
            });
        }
        
        const { userId, razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { 
                payment: true,
                paymentId: razorpay_order_id
            });
            await clearUserCart(userId);
            
            res.json({ 
                success: true, 
                message: "Payment successful" 
            });
        } else {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { 
                status: 'Cancelled',
                cancelledAt: formatDateTime(Date.now()),
                cancellationReason: 'Payment failed'
            });
            
            res.json({ 
                success: false, 
                message: "Payment failed" 
            });
        }
    } catch (error) {
        console.error('Error in verifyRazorpay:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Payment verification failed" 
        });
    }
};

// ==================== ORDER MANAGEMENT ====================

/**
 * Get all orders (Admin)
 */
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
            .sort({ createdAt: -1 });
            
        res.json({ 
            success: true, 
            orders 
        });
    } catch (error) {
        console.error('Error in allOrders:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to fetch orders" 
        });
    }
};

/**
 * Get user orders
 */
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID is required" 
            });
        }
        
        const orders = await orderModel.find({ userId })
            .sort({ createdAt: -1 });
        
        res.json({ 
            success: true, 
            orders 
        });
    } catch (error) {
        console.error('Error in userOrders:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to fetch user orders" 
        });
    }
};

/**
 * Update order status (Admin)
 */
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        if (!orderId || !status) {
            return res.status(400).json({ 
                success: false, 
                message: "Order ID and status are required" 
            });
        }
        
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }
        
        // Prevent updating cancelled orders
        if (order.status === 'Cancelled') {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot update cancelled order" 
            });
        }
        
        await orderModel.findByIdAndUpdate(orderId, { status });
        
        // Send status update email
        try {
            const user = await userModel.findById(order.userId);
            if (user) {
                await sendOrderStatusUpdateEmail(order, user.email, user.name);
            }
        } catch (emailError) {
            console.error('Failed to send status update email:', emailError);
        }
        
        res.json({ 
            success: true, 
            message: "Order status updated successfully" 
        });
    } catch (error) {
        console.error('Error in updateStatus:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Failed to update order status" 
        });
    }
};

/**
 * Cancel order (User)
 */
const cancelOrder = async (req, res) => {
    try {
        const { orderId, reason } = req.body;
        const userId = req.body.userId;
        
        if (!orderId) {
            return res.status(400).json({ 
                success: false, 
                message: "Order ID is required" 
            });
        }
        
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }
        
        // Verify order belongs to user
        if (order.userId !== userId) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized access" 
            });
        }
        
        // Only allow cancellation if order is not delivered or already cancelled
        if (order.status === 'Delivered') {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot cancel delivered order" 
            });
        }
        
        if (order.status === 'Cancelled') {
            return res.status(400).json({ 
                success: false, 
                message: "Order is already cancelled" 
            });
        }
        
        await orderModel.findByIdAndUpdate(orderId, {
            status: 'Cancelled',
            cancelledAt: formatDateTime(Date.now()),
            cancellationReason: reason || 'Cancelled by user'
        });
        
        res.json({ 
            success: true, 
            message: "Order cancelled successfully" 
        });
    } catch (error) {
        console.error('Error in cancelOrder:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || "Failed to cancel order" 
        });
    }
};

export { 
    verifyStripe, 
    verifyRazorpay, 
    placeOrder, 
    placeOrderStripe, 
    placeOrderRazorpay, 
    allOrders, 
    userOrders, 
    updateStatus, 
    cancelOrder,
    formatDateTime 
};

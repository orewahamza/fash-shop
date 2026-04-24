/**
 * Get order confirmation email HTML
 */
export const getOrderConfirmationHTML = (order, userName) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .order-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .item { padding: 10px 0; border-bottom: 1px solid #eee; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Confirmed! 🎉</h1>
                <p>Thank you for your purchase</p>
            </div>
            
            <div class="content">
                <p>Dear ${userName || 'Valued Customer'},</p>
                <p>Your order has been successfully placed and is being processed.</p>
                
                <div class="order-info">
                    <h2>Order Details</h2>
                    <p><strong>Order Number:</strong> #${order.orderNumber}</p>
                    <p><strong>Order Date:</strong> ${order.date}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                    <p><strong>Total Amount:</strong> ৳${order.amount}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                </div>
                
                <div class="order-info">
                    <h3>Items Ordered</h3>
                    ${order.items.map(item => `
                        <div class="item">
                            <p><strong>${item.name}</strong></p>
                            <p>Size: ${item.size} | Quantity: ${item.quantity} | Price: ৳${item.price}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-info">
                    <h3>Shipping Address</h3>
                    <p>${order.address.firstName} ${order.address.lastName}</p>
                    <p>${order.address.street}</p>
                    <p>${order.address.city}, ${order.address.state} ${order.address.zipcode}</p>
                    <p>${order.address.country}</p>
                    <p>Phone: ${order.address.phone}</p>
                </div>
                
                <p>We'll send you another email when your order ships.</p>
                
                <a href="#" class="button">Track Your Order</a>
            </div>
            
            <div class="footer">
                <p>This is an automated message, please do not reply.</p>
                <p>&copy; 2025 Forever Shopping. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * Get order status update email HTML
 */
export const getOrderStatusUpdateHTML = (order, userName) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .order-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .status-badge { display: inline-block; padding: 8px 16px; background: #667eea; color: white; border-radius: 20px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Status Update</h1>
                <p>Your order is on its way!</p>
            </div>
            
            <div class="content">
                <p>Dear ${userName || 'Valued Customer'},</p>
                <p>Great news! Your order status has been updated.</p>
                
                <div class="order-info">
                    <h2>Order Information</h2>
                    <p><strong>Order Number:</strong> #${order.orderNumber}</p>
                    <p><strong>Current Status:</strong> <span class="status-badge">${order.status}</span></p>
                    <p><strong>Total Amount:</strong> ৳${order.amount}</p>
                </div>
                
                <div class="order-info">
                    <h3>What's Next?</h3>
                    ${order.status === 'Shipped' ? '<p>Your order is on its way! You will receive a delivery notification soon.</p>' : ''}
                    ${order.status === 'Out for delivery' ? '<p>Your order will be delivered today. Please be available to receive it.</p>' : ''}
                    ${order.status === 'Delivered' ? '<p>Your order has been delivered. Thank you for shopping with us!</p>' : ''}
                    ${order.status === 'Packing' ? '<p>We are preparing your order for shipment.</p>' : ''}
                </div>
                
                <a href="#" class="button">View Order Details</a>
            </div>
            
            <div class="footer">
                <p>This is an automated message, please do not reply.</p>
                <p>&copy; 2025 Forever Shopping. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

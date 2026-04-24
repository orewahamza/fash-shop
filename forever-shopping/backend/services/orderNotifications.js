import sendEmail from '../utils/sendEmail.js';
import { getOrderConfirmationHTML, getOrderStatusUpdateHTML } from '../utils/orderEmailTemplates.js';

/**
 * Send order confirmation email to customer
 */
export const sendOrderConfirmationEmail = async (order, userEmail, userName) => {
    try {
        if (!userEmail) {
            console.warn('No email provided for order confirmation');
            return;
        }

        const subject = `Order Confirmation - #${order.orderNumber}`;
        const html = getOrderConfirmationHTML(order, userName);
        
        await sendEmail({
            to: userEmail,
            subject,
            html
        });

        console.log(`Order confirmation email sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        // Don't throw error to prevent order flow interruption
    }
};

/**
 * Send order status update email to customer
 */
export const sendOrderStatusUpdateEmail = async (order, userEmail, userName) => {
    try {
        if (!userEmail) {
            console.warn('No email provided for status update');
            return;
        }

        const subject = `Order Status Update - #${order.orderNumber}`;
        const html = getOrderStatusUpdateHTML(order, userName);
        
        await sendEmail({
            to: userEmail,
            subject,
            html
        });

        console.log(`Order status update email sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending order status update email:', error);
        // Don't throw error to prevent order flow interruption
    }
};

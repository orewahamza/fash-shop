
import sendEmail from './utils/sendEmail.js';
import { getPasswordResetTemplate } from './utils/emailTemplates.js';

const run = async () => {
    const resetUrl = 'http://localhost:5173/reset-password/mock-token';
    const name = 'Test User';
    const isGoogleAuth = false;

    const html = getPasswordResetTemplate(name, resetUrl, isGoogleAuth);
    const messageText = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the following link to reset your password:\n\n${resetUrl}`;

    try {
        console.log('Testing sendEmail...');
        await sendEmail({
            email: 'test@example.com',
            subject: 'Test Password Reset',
            message: messageText,
            html: html
        });
        console.log('Test completed.');
    } catch (error) {
        console.error('Test failed:', error);
    }
};

run();

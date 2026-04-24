import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Check if we are in a development/test environment without valid credentials
    // If SMTP_PASSWORD is not set or looks like a placeholder, we might want to mock it.
    // However, the error EAUTH indicates it IS trying to connect but failing authentication.
    // This usually means the App Password is revoked, incorrect, or 2FA is off (less secure apps disabled).
    // For local development, if real email fails, let's log the email content to console so the user can "click" the link.

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html // Add HTML content
    };

    try {
        console.log(`[Email] Attempting to send to: ${options.email}`);
        
        // Log email content in development for verification
        if (process.env.NODE_ENV !== 'production') {
            console.log('==========================================');
            console.log('       EMAIL CONTENT (DEV MODE)           ');
            console.log('==========================================');
            console.log(`To: ${options.email}`);
            console.log(`Subject: ${options.subject}`);
            console.log(`Message: \n${options.message}`);
            if (options.html) {
                console.log(`HTML: \n${options.html.substring(0, 500)}... (truncated)`);
            }
            console.log('==========================================');
        }

        await transporter.sendMail(mailOptions);
        console.log(`[Email] Email sent successfully to: ${options.email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        
        // Fallback for development: Log the email content if sending fails
        // But rethrow error so UI knows it failed, as user requested NO mock links in UI
        if (process.env.NODE_ENV !== 'production') {
            console.log('==========================================');
            console.log('       EMAIL SENDING FAILED (LOG ONLY)    ');
            console.log('==========================================');
            console.log(`To: ${options.email}`);
            console.log(`Subject: ${options.subject}`);
            console.log(`Message: \n${options.message}`);
            if (options.html) {
                console.log(`HTML: \n${options.html.substring(0, 100)}... (truncated)`);
            }
            console.log('==========================================');
        }

        throw error;
    }
};

export default sendEmail;
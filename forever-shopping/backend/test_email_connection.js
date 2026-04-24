import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
    const email = 'hamza.mirza201277@gmail.com'; // Trying with 77
    const password = process.env.SMTP_PASSWORD;

    console.log(`Testing with Email: ${email}`);
    console.log(`Testing with Password: ${password ? '******' : 'Not Set'}`);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: email,
            pass: password
        }
    });

    try {
        await transporter.verify();
        console.log('✅ Connection verification successful!');
    } catch (error) {
        console.error('❌ Connection verification failed:', error.message);
        
        // Try with the other email (single 7) just in case
        console.log('\nRetrying with original email from .env (hamza.mirza20127@gmail.com)...');
        const transporter2 = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: 'hamza.mirza20127@gmail.com',
                pass: password
            }
        });

        try {
            await transporter2.verify();
            console.log('✅ Connection verification successful with original email!');
        } catch (error2) {
            console.error('❌ Connection verification failed with original email:', error2.message);
        }
    }
};

testEmail();
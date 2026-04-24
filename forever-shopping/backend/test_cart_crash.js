
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Hardcode secret from .env since dotenv might not load correctly in standalone script without correct path
const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
const token = jwt.sign({ id: '507f1f77bcf86cd799439011' }, secret); // Random valid Mongo ID

console.log('Testing getUserCart with non-existent user ID...');

try {
    const response = await fetch('http://localhost:5000/api/cart/get', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'token': token 
        },
        body: JSON.stringify({})
    });
    const data = await response.json();
    console.log('Response:', data);
} catch (error) {
    console.error('Error:', error);
}

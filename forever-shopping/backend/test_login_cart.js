
import axios from 'axios';

const backendUrl = 'http://127.0.0.1:5000';

async function testStandardLogin() {
    console.log('Testing Standard Login...');
    try {
        // 1. Register a new user (to ensure clean state)
        const email = 'testuser_' + Date.now() + '@example.com';
        const password = 'password123';
        
        console.log(`Registering user: ${email}`);
        const regRes = await axios.post(backendUrl + '/api/user/register', {
            name: 'Test User',
            email,
            password
        });
        
        console.log('Register Response:', regRes.status, regRes.data);

        if (!regRes.data.success) {
            console.error('Registration Failed:', regRes.data.message);
            return;
        }
        
        const token = regRes.data.token;
        
        // 2. Login
        console.log('Logging in...');
        const loginRes = await axios.post(backendUrl + '/api/user/login', {
            email,
            password
        });
        
        console.log('Login Response:', loginRes.status, loginRes.data);

        if (!loginRes.data.success) {
             console.error('Login Failed:', loginRes.data.message);
             return;
        }

        // 3. Fetch Cart
        console.log('Fetching Cart...');
        const cartRes = await axios.post(backendUrl + '/api/cart/get', {}, {
            headers: { token }
        });

        console.log('Cart Fetch Response Status:', cartRes.status);
        console.log('Cart Fetch Data:', cartRes.data);

    } catch (error) {
        console.error('FULL ERROR:', error);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
}

testStandardLogin();

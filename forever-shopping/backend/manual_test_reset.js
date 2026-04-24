
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/user';

async function run() {
    try {
        const TEST_EMAIL = `test_reset_${Date.now()}@example.com`;
        const TEST_PASSWORD = 'password123';
        const TEST_NAME = 'Test User';
        
        console.log('1. Registering user...');
        const registerRes = await axios.post(`${BASE_URL}/register`, {
            name: TEST_NAME,
            email: TEST_EMAIL,
            password: TEST_PASSWORD
        });
        
        if (!registerRes.data.success) {
            console.error('Registration failed:', registerRes.data);
            return;
        }
        console.log('User registered:', TEST_EMAIL);

        console.log('2. Requesting password reset...');
        const resetRes = await axios.post(`${BASE_URL}/request-password-reset`, {
            email: TEST_EMAIL
        });

        console.log('Reset request response:', resetRes.data);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

run();

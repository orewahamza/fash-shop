
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user';

async function run() {
    try {
        // 1. Register
        const email = `test_${Date.now()}@example.com`;
        const password = 'password123';
        console.log(`Registering user: ${email}`);
        
        const registerRes = await axios.post(`${API_URL}/register`, {
            name: 'Test User',
            email,
            password
        });

        if (!registerRes.data.success) {
            console.error('Registration failed:', registerRes.data);
            return;
        }

        const token = registerRes.data.token;
        console.log('Registration successful. Token:', token);

        // 2. Try to change type to host
        console.log('Attempting to change type to host...');
        const changeRes = await axios.post(
            `${API_URL}/change-type`, 
            {
                password,
                requestedType: 'host'
            },
            {
                headers: { token }
            }
        );

        console.log('Change type response:', changeRes.data);

        if (changeRes.data.success) {
            console.log('SUCCESS: User type changed.');
        } else {
            console.log('FAILURE: ' + changeRes.data.message);
        }

    } catch (error) {
        console.error('Error object:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

run();

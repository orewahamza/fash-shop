
import axios from 'axios';

const backendUrl = 'http://localhost:5000';

async function testSignup() {
    console.log('Testing Signup...');
    try {
        const response = await axios.post(backendUrl + '/api/user/register', {
            name: 'Test User',
            email: 'testuser' + Date.now() + '@example.com',
            password: 'password123'
        });
        console.log('Signup Response:', response.status, response.data);
    } catch (error) {
        if (error.response) {
            console.error('Signup Error:', error.response.status, error.response.data);
        } else {
            console.error('Signup Error:', error.message);
        }
    }
}

async function testGoogleLogin() {
    console.log('Testing Google Login...');
    try {
        const response = await axios.post(backendUrl + '/api/user/google-login', {
            idToken: 'fake_token'
        });
        console.log('Google Login Response:', response.status, response.data);
    } catch (error) {
        if (error.response) {
            console.error('Google Login Error:', error.response.status, error.response.data);
        } else {
            console.error('Google Login Error:', error.message);
        }
    }
}

testSignup().then(() => testGoogleLogin());

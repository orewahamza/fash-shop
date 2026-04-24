
import http from 'http';

function postRequest(path, data) {
    return new Promise((resolve, reject) => {
        const dataString = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: body });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(dataString);
        req.end();
    });
}

async function runTests() {
    console.log('Testing Signup...');
    try {
        const res = await postRequest('/api/user/register', {
            name: 'Test User',
            email: 'testuser' + Date.now() + '@example.com',
            password: 'password123'
        });
        console.log('Signup Status:', res.status);
        console.log('Signup Body:', res.body);
    } catch (e) {
        console.error('Signup Error:', e);
    }

    console.log('\nTesting Google Login...');
    try {
        const res = await postRequest('/api/user/google-login', {
            idToken: 'fake_token'
        });
        console.log('Google Login Status:', res.status);
        console.log('Google Login Body:', res.body);
    } catch (e) {
        console.error('Google Login Error:', e);
    }
}

runTests();

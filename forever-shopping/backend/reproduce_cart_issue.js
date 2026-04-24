
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testCartPersistence() {
    try {
        // 1. Register/Login User
        const email = `testuser_${Date.now()}@example.com`;
        const password = 'password123';
        const name = 'Test User';

        console.log(`Registering user: ${email}`);
        let registerRes = await axios.post(`${BASE_URL}/api/user/register`, { name, email, password });
        let token = registerRes.data.token;
        let userId = registerRes.data.userId || "unknown"; // Backend might not return userId on register, check logic

        if (!registerRes.data.success) {
             // Try login if user exists
             console.log("User might exist, trying login...");
             const loginRes = await axios.post(`${BASE_URL}/api/user/login`, { email, password });
             token = loginRes.data.token;
             userId = loginRes.data.userId;
        }

        if (!token) {
            console.error("Failed to get token");
            return;
        }
        console.log("Got token:", token ? "YES" : "NO");

        // 2. Add Item to Cart
        const itemId = "test_product_id_" + Date.now(); // Dummy ID
        const size = "M";
        const quantity = 2;

        console.log(`Adding item to cart: ${itemId}, size: ${size}, qty: ${quantity}`);
        const addRes = await axios.post(`${BASE_URL}/api/cart/add`, 
            { itemId, size, quantity },
            { headers: { token } }
        );
        console.log("Add to cart response:", addRes.data);

        // 3. Get Cart (Simulate session active)
        console.log("Fetching cart immediately...");
        const getRes1 = await axios.post(`${BASE_URL}/api/cart/get`, {}, { headers: { token } });
        console.log("Cart data (immediate):", JSON.stringify(getRes1.data.cartData, null, 2));

        // 4. "Logout" and "Login" (Get new token, or just use same token to simulate new session)
        console.log("Simulating logout/login (using same token for simplicity as it is stateless)...");
        
        // 5. Get Cart again
        console.log("Fetching cart after 're-login'...");
        const getRes2 = await axios.post(`${BASE_URL}/api/cart/get`, {}, { headers: { token } });
        console.log("Cart data (after re-login):", JSON.stringify(getRes2.data.cartData, null, 2));

        const cartData = getRes2.data.cartData;
        if (cartData && cartData[itemId] && cartData[itemId][size] === quantity) {
            console.log("SUCCESS: Cart data persisted.");
        } else {
            console.error("FAILURE: Cart data lost or incorrect.");
        }

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

testCartPersistence();

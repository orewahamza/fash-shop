import userModel from "../models/userModel.js";


// add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;
        console.log(`[Cart] Adding item for user ${userId}: Item ${itemId}, Size ${size}, Qty ${quantity}`);

        const userData = await userModel.findById(userId);
        if (!userData) {
            console.log(`[Cart] User not found: ${userId}`);
            return res.json({ success: false, message: "User not found" });
        }

        const qtyToAdd = quantity || 1;

        // Use atomic update to handle concurrent requests
        // If the item exists, increment quantity. If not, create it.
        // Note: We use dot notation for nested updates in the 'cartData' Mixed type field.
        await userModel.findByIdAndUpdate(userId, {
            $inc: { [`cartData.${itemId}.${size}`]: qtyToAdd }
        });

        console.log(`[Cart] Item added successfully for user ${userId}`);
        res.json({ success: true, message: "Item added to cart successfully" });

    } catch (error) {
        console.error(`[Cart] Error adding item:`, error);
        res.json({ success: false, message: error.message });
    }
}

// update user cart
const updateCart = async (req, res) => {
    try {

        const { userId, itemId, size, quantity } = req.body;
        console.log(`[Cart] Updating cart for user ${userId}: Item ${itemId}, Size ${size}, Qty ${quantity}`);

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        
        // Use atomic update
        await userModel.findByIdAndUpdate(userId, {
            $set: { [`cartData.${itemId}.${size}`]: quantity }
        });

        console.log(`[Cart] Cart updated successfully for user ${userId}`);
        res.json({ success: true, message: "Cart updated successfully" });

    } catch (error) {
        console.error(`[Cart] Error updating cart:`, error);
        res.json({ success: false, message: error.message });
    }
}

// get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(`[Cart] Fetching cart for user ${userId}`);

        const userData = await userModel.findById(userId);
        if (!userData) {
            console.log(`[Cart] User not found: ${userId}`);
            return res.json({ success: false, message: "User not found" });
        }
        let cartData = await userData.cartData || {};
        
        console.log(`[Cart] Cart fetched successfully for user ${userId}. Item count: ${Object.keys(cartData).length}`);
        res.json({ success: true, cartData });

    } catch (error) {
        console.error(`[Cart] Error fetching cart:`, error);
        res.json({ success: false, message: error.message });
    }
}



export { addToCart, updateCart, getUserCart };

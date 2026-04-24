import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized Login Again' });
        }

        // 1. Check for legacy hardcoded admin token
        const legacyAdminToken = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded === legacyAdminToken) {
                return next();
            }

            // 2. Check for standard user token with host/admin privileges
            if (decoded.id) {
                const user = await userModel.findById(decoded.id);
                if (user && (user.role === 'admin' || user.type === 'host')) {
                    req.user = user; // Attach user for further logic
                    return next();
                }
            }
        } catch (jwtError) {
            // Handle legacy literal tokens if any, or just fail
        }

        return res.json({ success: false, message: 'Not Authorized Login Again' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default adminAuth;
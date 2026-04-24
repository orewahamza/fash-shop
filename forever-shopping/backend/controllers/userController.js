import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';
import admin from 'firebase-admin';
import auditLogModel from '../models/auditLogModel.js';
import eventBus from '../services/eventBus.js';
import sendEmail from '../utils/sendEmail.js';
import { getPasswordResetTemplate } from '../utils/emailTemplates.js';


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}



// Route for user login
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        console.log(`[Login] Attempt for email: ${email}`);

        const user = await userModel.findOne({ email });

        // Check if user exists or not
        if (!user) {
            console.log(`[Login] User not found: ${email}`);
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);


        // if password is matched
        if (isMatch) {
            const token = createToken(user._id);
            console.log(`[Login] Success for user: ${user._id}`);
            res.json({ success: true, token, role: user.role, type: user.type, userId: user._id });
        }

        // if password is not matched
        else {
            console.log(`[Login] Invalid credentials for user: ${user._id}`);
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.error('[Login] Error:', error);
        res.json({ success: false, message: error.message });
    }

}


// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(`[Register] Attempt for email: ${email}`);

        // Check if user already exists or not

        const exists = await userModel.findOne({ email });
        if (exists) {
            console.log(`[Register] User already exists: ${email}`);
            return res.json({ success: false, message: 'User already exists' });
        }


        // validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'please enter a valid email' });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'Please enter a strong password' });
        }

        // Hashing password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);


        // Creating new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        console.log(`[Register] New user created. ID: ${user._id}, Email: ${user.email}`);

        const token = createToken(user._id);

        res.json({ success: true, token, type: user.type, role: user.role });



    } catch (error) {
        console.error('[Register] Error:', error);
        if (error.code === 11000) {
            return res.json({ success: false, message: 'User already exists (duplicate email)' });
        }
        res.json({ success: false, message: error.message });
    }

}




// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
        return res.json({ success: true, token, role: 'admin', userId: 'admin' });
        } 
        
        const user = await userModel.findOne({ email });
        if (user && user.role === 'admin') {
            const isMatch = await bcryptjs.compare(password, user.password);
            if (isMatch) {
                const token = createToken(user._id);
                return res.json({ success: true, token });
            }
        }
        
        res.json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}



const requestAdmin = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.json({ success: false, message: 'User is already an admin' });
        }
        if (user.roleRequestStatus === 'pending') {
            return res.json({ success: false, message: 'Request already pending' });
        }

        user.roleRequestStatus = 'pending';
        await user.save();
        res.json({ success: true, message: 'Request sent. You will be notified once approved.' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user: { name: user.name, email: user.email, role: user.role, type: user.type, isGoogleAuth: user.isGoogleAuth } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const { userId, name } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        user.name = name;
        await user.save();
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

import { v2 as cloudinary } from 'cloudinary';

// Helper to extract public id from url (same as productController)
const extractPublicIdFromUrl = (url) => {
    try {
        const parts = url.split('/upload/');
        if (parts.length < 2) return null;
        const afterUpload = parts[1];
        const withoutQuery = afterUpload.split('?')[0];
        const segments = withoutQuery.split('/');
        const withoutVersion = segments[0].startsWith('v') ? segments.slice(1) : segments;
        const joined = withoutVersion.join('/');
        const withoutExt = joined.replace(/\.[^/.]+$/, '');
        return withoutExt;
    } catch {
        return null;
    }
};

const changeUserType = async (req, res) => {
    let session;
    try {
        const { userId, password, requestedType } = req.body;
        console.log(`[ChangeType] Processing request for user: ${userId}, type: ${requestedType}`);

        if (!['user', 'host'].includes(requestedType)) {
            return res.json({ success: false, message: 'Invalid type requested' });
        }

        // Attempt to start a transaction
        try {
            session = await mongoose.startSession();
            session.startTransaction();
        } catch (err) {
            console.log('[ChangeType] Warning: Transactions not supported (standalone MongoDB?), running without transaction.');
            session = null;
        }

        const user = await userModel.findById(userId).session(session);
        if (!user) {
            if (session) await session.abortTransaction();
            console.error(`[ChangeType] User not found: ${userId}`);
            return res.json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            if (session) await session.abortTransaction();
            console.error(`[ChangeType] Invalid password for user: ${userId}`);
            return res.json({ success: false, message: 'Invalid password' });
        }

        if (user.type === requestedType) {
             if (session) await session.abortTransaction();
             return res.json({ success: false, message: `You are already a ${requestedType}` });
        }

        let imageUrlsToDelete = [];

        // If downgrading from host to user, delete all owned products
        if (user.type === 'host' && requestedType === 'user') {
            const products = await productModel.find({ ownerId: user._id }).session(session);
            console.log(`[ChangeType] Found ${products.length} products to delete for user ${user._id}`);

            // Collect all image URLs to delete from Cloudinary
            imageUrlsToDelete = products.reduce((acc, product) => {
                if (Array.isArray(product.image)) {
                    return acc.concat(product.image);
                }
                return acc;
            }, []);

            // Delete products from DB
            const deleteResult = await productModel.deleteMany({ ownerId: user._id }).session(session);
            console.log(`[ChangeType] Deleted ${deleteResult.deletedCount} products from DB`);
        }

        const oldType = user.type;
        user.type = requestedType;
        user.type_changed_at = new Date();
        user.type_changed_by = userId;
        await user.save({ session });

        // Audit Log
        const log = new auditLogModel({
            action: 'USER_TYPE_CHANGE',
            userId: user._id,
            details: { oldType, newType: requestedType },
            ip: req.ip
        });
        await log.save({ session });
        
        if (session) {
            await session.commitTransaction();
            session.endSession();
        }

        // Clean up images from Cloudinary after successful commit
        if (imageUrlsToDelete.length > 0) {
            Promise.all(imageUrlsToDelete.map(async (url) => {
                const publicId = extractPublicIdFromUrl(url);
                if (publicId) {
                    try { await cloudinary.uploader.destroy(publicId); } catch {}
                }
            })).catch(err => console.error('[ChangeType] Cloudinary cleanup error:', err));
        }

        // Emit Domain Event
        eventBus.emit('UserTypeChanged', {
            userId: user._id,
            oldType,
            newType: requestedType,
            timestamp: new Date()
        });

        const token = createToken(user._id);
        console.log(`[ChangeType] Successfully changed user type to ${requestedType} for user: ${userId}`);
        res.json({ success: true, message: 'User type updated successfully', token, type: user.type, role: user.role });

    } catch (error) {
        console.error('[ChangeType] Error:', error);
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        res.json({ success: false, message: error.message });
    }
}


const maybeInitFirebase = () => {
    try {
        if (admin.apps.length === 0) {
            const projectId = process.env.FIREBASE_PROJECT_ID;
            const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
            let privateKey = process.env.FIREBASE_PRIVATE_KEY;
            
            console.log(`[Firebase] Init attempt. Project: ${projectId}, Email: ${clientEmail}, Key length: ${privateKey ? privateKey.length : 0}`);

            if (projectId && clientEmail && privateKey) {
                // Handle both literal \n and actual newlines
                privateKey = privateKey.replace(/\\n/g, '\n');
                
                admin.initializeApp({
                    credential: admin.credential.cert({ projectId, clientEmail, privateKey })
                });
                console.log('[Firebase] Initialized successfully');
            } else {
                console.error('[Firebase] Missing config values');
            }
        }
    } catch (e) {
        console.error('[Firebase] Admin init failed:', e);
    }
};

const googleLogin = async (req, res) => {
    try {
        console.log('[GoogleLogin] Request received');
        maybeInitFirebase();
        
        if (admin.apps.length === 0) {
            console.error('[GoogleLogin] Firebase Admin not initialized');
            return res.status(500).json({ success: false, message: 'Firebase Admin not configured on server' });
        }
        
        const { idToken } = req.body;
        if (!idToken) {
            console.error('[GoogleLogin] Missing idToken');
            return res.json({ success: false, message: 'Missing idToken' });
        }
        
        console.log('[GoogleLogin] Verifying token...');
        const decoded = await admin.auth().verifyIdToken(idToken);
        console.log('[GoogleLogin] Token verified. Email:', decoded.email);
        
        const email = decoded.email;
        const name = decoded.name || (decoded.email ? decoded.email.split('@')[0] : 'User');
        if (!email) {
            return res.json({ success: false, message: 'No email in Firebase token' });
        }
        let user = await userModel.findOne({ email });
        if (!user) {
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash('GOOGLE_AUTH_' + decoded.uid, salt);
            user = await userModel.create({ name, email, password: hashedPassword, isGoogleAuth: true });
        } else if (!user.isGoogleAuth) {
            // If user exists but wasn't google auth, mark them as such if they login with google?
            // Or just allow them to login. Let's keep isGoogleAuth flag accurate for password reset purposes.
            // If they have a password, isGoogleAuth might be false or true. 
            // If they login with Google, we can set isGoogleAuth = true?
            // But if they have a password, they don't NEED to set one.
            // Let's only set isGoogleAuth = true on creation or if explicitly linking.
            // For now, simple logic: if created via google, isGoogleAuth=true.
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.json({ success: true, token, role: user.role, userId: user._id, type: user.type });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: error.message });
    }
};

const setGoogleUserPassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (!user.isGoogleAuth) {
            return res.json({ success: false, message: 'Operation only allowed for Google authenticated users' });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);
        
        user.password = hashedPassword;
        user.isGoogleAuth = false; 
        
        await user.save();

        res.json({ success: true, message: 'Password set successfully' });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const verifyPassword = async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (isMatch) {
            return res.json({ success: true, message: 'Password verified' });
        } else {
            return res.json({ success: false, message: 'Current password is incorrect' });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const changePassword = async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Current password is incorrect' });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Allow Google users to reset/set password as well
        // if (user.isGoogleAuth) {
        //      return res.json({ success: false, message: 'Please sign in with Google. You do not have a password set.' });
        // }

        // Generate token
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const resetUrl = `${req.headers.origin}/reset-password/${resetToken}`;
        
        let subject = 'Password Reset Token';
        let messageText = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the following link to reset your password:\n\n${resetUrl}`;

        if (user.isGoogleAuth) {
             subject = 'Create Password for your Account';
             messageText = `You are receiving this email to create a password for your account (originally signed up via Google). Please click the following link to set your password:\n\n${resetUrl}`;
        }
        
        const html = getPasswordResetTemplate(user.name, resetUrl, user.isGoogleAuth);

        try {
            await sendEmail({
                email: user.email,
                subject,
                message: messageText,
                html
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.json({ success: false, message: 'Missing token or password' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return res.json({ success: false, message: 'Invalid or expired token' });
        }

        const user = await userModel.findOne({ 
            _id: decoded.id, 
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() } 
        });

        if (!user) {
            return res.json({ success: false, message: 'Invalid or expired reset token' });
        }

        if (newPassword.length < 8) {
             return res.json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        
        await user.save();

        res.json({ success: true, message: 'Password reset successfully' });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const adminBridge = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.json({ success: false, message: 'Not authorized' });
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        // Issue an admin token for any authenticated user (development convenience).
        // In production, restrict by role or email.
        const adminEmail = process.env.ADMIN_EMAIL || 'dev@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'dev';
        const adminToken = jwt.sign(adminEmail + adminPassword, process.env.JWT_SECRET);
        return res.json({ success: true, token: adminToken, userId: user._id });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, requestAdmin, getUserProfile, updateUserProfile, changeUserType, googleLogin, setGoogleUserPassword, requestPasswordReset, resetPassword, adminBridge, verifyPassword, changePassword };

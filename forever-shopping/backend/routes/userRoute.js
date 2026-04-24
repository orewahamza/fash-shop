import express from 'express';
import { loginUser, registerUser, adminLogin, requestAdmin, getUserProfile, updateUserProfile, changeUserType, googleLogin, setGoogleUserPassword, adminBridge, requestPasswordReset, resetPassword, verifyPassword, changePassword } from '../controllers/userController.js';    
import authUser from '../middleware/auth.js';


const userRouter = express.Router();

userRouter.post('/register', registerUser); // Route for user registration
userRouter.post('/login', loginUser); // Route for user login       
userRouter.post('/admin', adminLogin); // Route for admin login
userRouter.post('/change-type', authUser, changeUserType); // Route to change user type
userRouter.get('/profile', authUser, getUserProfile); // Route to get user profile
userRouter.post('/update-profile', authUser, updateUserProfile); // Route to update user profile
userRouter.post('/google-login', googleLogin); // Route for google login with Firebase ID token
userRouter.post('/admin-bridge', authUser, adminBridge); // Exchange user token for admin token when allowed
userRouter.post('/set-password', authUser, setGoogleUserPassword); // Set password for Google users
userRouter.post('/request-password-reset', requestPasswordReset); // Request password reset
userRouter.post('/reset-password', resetPassword); // Reset password
userRouter.post('/verify-password', authUser, verifyPassword); // Verify current password
userRouter.post('/change-password', authUser, changePassword); // Change password
userRouter.post('/:id/roles/admin-request', authUser, requestAdmin); // Route for admin role request

export default userRouter;

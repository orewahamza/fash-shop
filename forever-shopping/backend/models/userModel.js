import mongoose from 'mongoose';
import { seedAdminProducts } from '../utils/seeder.js';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    roleRequestStatus: { type: String, default: 'none', enum: ['none', 'pending', 'approved', 'rejected'] },
    type: { type: String, default: 'user', enum: ['user', 'host'] },
    isGoogleAuth: { type: Boolean, default: false },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
    type_changed_at: { type: Date, default: null },
    type_changed_by: { type: String, default: null }
},{minimize: false});

userSchema.index({ _id: 1, type: 1 }, { unique: true });

userSchema.post('save', async function(doc) {
    if (doc.role === 'admin') {
        await seedAdminProducts(doc._id);
    }
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
import mongoose from 'mongoose';

/**
 * Admin Schema — Dedicated Schema for Administrators
 * Completely isolated from regular customer users (users collection)
 */
const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Admin name is required"],
        trim: true,
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "Admin email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },
    role: {
        type: String,
        enum: ["superadmin", "admin", "moderator"],
        default: "superadmin"
    },
    avatar: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLoginAt: {
        type: Date,
        default: null
    },
    lastLoginIp: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const AdminModel = mongoose.model('admins', AdminSchema);
export default AdminModel;

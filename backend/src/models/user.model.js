import mongoose from 'mongoose';

/**
 * User Schema — Core Account & Authentication Data
 * Human-Readable & Modular Schema Definition
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"],
        trim: true
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        minlength: [3, "Username must be at least 3 characters"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },
    mobile_Number: {
        type: String,
        match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"]
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ["male", "female", "other"]
    },
    dob: {
        type: Date
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "moderator", "admin"],
        default: "user"
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model('users', UserSchema);
export default UserModel;
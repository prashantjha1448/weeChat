import mongoose from 'mongoose';

/**
 * Profile Schema — Extended User Public Profile Attributes
 * Human-Readable & Modular Schema Definition
 */
const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "User ID reference is required"],
        unique: true,
        index: true
    },
    displayName: {
        type: String,
        trim: true,
        maxlength: [50, "Display name cannot exceed 50 characters"]
    },
    avatar: {
        type: String,
        default: "" // URL to user avatar image
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    heightCm: {
        type: Number,
        default: 165 // Height in centimeters (e.g., 165cm = ~5'5")
    },
    country: {
        type: String,
        default: "India",
        trim: true,
        index: true
    },
    state: {
        type: String,
        default: "",
        trim: true
    },
    city: {
        type: String,
        default: "",
        trim: true,
        index: true
    },
    languages: [{
        type: String,
        trim: true
    }],
    bio: {
        type: String,
        default: "",
        maxlength: [250, "Bio cannot exceed 250 characters"],
        trim: true
    }
}, {
    timestamps: true
});

const ProfileModel = mongoose.model('profiles', ProfileSchema);
export default ProfileModel;

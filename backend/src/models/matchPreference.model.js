import mongoose from 'mongoose';

/**
 * MatchPreference Schema — User Target Matching Preferences & Filters
 * Human-Readable & Modular Schema Definition
 */
const MatchPreferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "User ID reference is required"],
        unique: true,
        index: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "non_binary", "lgbtq", "other", "any"],
        default: "any"
    },
    ageRange: {
        minAge: { type: Number, default: 18 },
        maxAge: { type: Number, default: 60 }
    },
    targetLocationMode: {
        type: String,
        enum: ["anywhere", "city", "state", "pincode", "current_location", "same_city", "same_state"],
        default: "anywhere"
    },
    locationText: {
        type: String,
        trim: true,
        default: ""
    },
    city: {
        type: String,
        trim: true,
        default: ""
    },
    state: {
        type: String,
        trim: true,
        default: ""
    },
    pincode: {
        type: String,
        trim: true,
        default: ""
    },
    lat: {
        type: Number,
        default: null
    },
    lng: {
        type: Number,
        default: null
    },
    countries: [{
        type: String,
        trim: true
    }],
    languages: [{
        type: String,
        trim: true
    }],
    interests: [{
        type: String,
        trim: true
    }],
    minHeightCm: {
        type: Number,
        default: 140
    },
    maxHeightCm: {
        type: Number,
        default: 210
    },
    weights: {
        locationWeight: { type: Number, default: 1.0 },
        interestWeight: { type: Number, default: 1.0 },
        heightWeight: { type: Number, default: 0.5 }
    }
}, {
    timestamps: true
});

const MatchPreferenceModel = mongoose.model('match_preferences', MatchPreferenceSchema);
export default MatchPreferenceModel;

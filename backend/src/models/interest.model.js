import mongoose from 'mongoose';

/**
 * Interest Schema — Master Directory of System Tags, Languages & Countries
 * Human-Readable & Modular Schema Definition
 */
const InterestSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["interest", "language", "country"],
        required: [true, "Type is required (interest, language, or country)"],
        index: true
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    code: {
        type: String,
        required: [true, "Unique code slug is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const InterestModel = mongoose.model('interests', InterestSchema);
export default InterestModel;

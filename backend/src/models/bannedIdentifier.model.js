import mongoose from 'mongoose';

/**
 * BannedIdentifier Schema — Hardware Device & IP Address Ban Registry
 * Human-Readable & Modular Schema Definition
 */
const BannedIdentifierSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["ip", "device_fingerprint"],
        required: [true, "Identifier type is required (ip or device_fingerprint)"],
        index: true
    },
    value: {
        type: String,
        required: [true, "Banned identifier value is required"],
        unique: true,
        trim: true,
        index: true
    },
    reason: {
        type: String,
        default: "Violation of Terms of Service",
        trim: true
    },
    expiresAt: {
        type: Date,
        default: null // Null for permanent ban; timestamp for temporary ban
    }
}, {
    timestamps: true
});

const BannedIdentifierModel = mongoose.model('banned_identifiers', BannedIdentifierSchema);
export default BannedIdentifierModel;

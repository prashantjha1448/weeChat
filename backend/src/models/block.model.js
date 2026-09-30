import mongoose from 'mongoose';

/**
 * Block Schema — User-to-User Block Relationships
 * Human-Readable & Modular Schema Definition
 */
const BlockSchema = new mongoose.Schema({
    blocker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Blocker user ID is required"],
        index: true
    },
    blockedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Blocked user ID is required"],
        index: true
    }
}, {
    timestamps: true
});

// Compound unique index to prevent duplicate block entries
BlockSchema.index({ blocker: 1, blockedUser: 1 }, { unique: true });

const BlockModel = mongoose.model('blocks', BlockSchema);
export default BlockModel;

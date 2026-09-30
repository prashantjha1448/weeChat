import mongoose from 'mongoose';

/**
 * Subscription Schema — User VIP & Premium Membership Plans
 * Human-Readable & Modular Schema Definition
 */
const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "User ID reference is required"],
        unique: true,
        index: true
    },
    planName: {
        type: String,
        required: [true, "Plan name is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Plan price is required"]
    },
    features: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ["active", "canceled", "expired"],
        default: "active",
        index: true
    },
    renewsAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const SubscriptionModel = mongoose.model('subscriptions', SubscriptionSchema);
export default SubscriptionModel;

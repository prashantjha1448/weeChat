import mongoose from 'mongoose';

/**
 * Transaction Schema — Payment Gateway Transaction History & Invoices
 * Human-Readable & Modular Schema Definition
 */
const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "User ID reference is required"],
        index: true
    },
    amount: {
        type: Number,
        required: [true, "Transaction amount is required"]
    },
    currency: {
        type: String,
        default: "INR",
        uppercase: true,
        trim: true
    },
    gateway: {
        type: String,
        enum: ["razorpay", "stripe", "upi"],
        required: [true, "Payment gateway is required"]
    },
    gatewayRef: {
        type: String,
        default: "",
        trim: true,
        index: true // Payment ID / Reference from Gateway
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending",
        index: true
    }
}, {
    timestamps: true
});

const TransactionModel = mongoose.model('transactions', TransactionSchema);
export default TransactionModel;

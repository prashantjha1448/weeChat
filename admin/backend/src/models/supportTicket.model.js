import mongoose from 'mongoose';

/**
 * SupportTicket Schema — Customer Helpdesk & Query Resolution
 */
const SupportTicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "User ID reference is required"],
        index: true
    },
    category: {
        type: String,
        enum: ["account", "billing", "bug", "feedback", "other"],
        default: "account"
    },
    subject: {
        type: String,
        default: "Customer Inquiry",
        trim: true
    },
    message: {
        type: String,
        required: [true, "Support ticket message is required"],
        trim: true,
        maxlength: [2000, "Message cannot exceed 2000 characters"]
    },
    status: {
        type: String,
        enum: ["open", "in_progress", "resolved", "closed"],
        default: "open",
        index: true
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    adminResponse: {
        type: String,
        default: ""
    },
    resolvedAt: {
        type: Date,
        default: null
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: null
    }
}, {
    timestamps: true
});

const SupportTicketModel = mongoose.model('support_tickets', SupportTicketSchema);
export default SupportTicketModel;

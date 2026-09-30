import mongoose from 'mongoose';

/**
 * SupportTicket Schema — Customer Helpdesk & Feedback Support Tickets
 * Human-Readable & Modular Schema Definition
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
        enum: ["account", "billing", "bug", "feedback"],
        required: [true, "Ticket category is required"]
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
    }
}, {
    timestamps: true
});

const SupportTicketModel = mongoose.model('support_tickets', SupportTicketSchema);
export default SupportTicketModel;

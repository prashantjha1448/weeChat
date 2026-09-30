import mongoose from 'mongoose';

/**
 * Report Schema — User Abuse & Moderation Complaints
 * Human-Readable & Modular Schema Definition
 */
const ReportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Reporter user ID is required"],
        index: true
    },
    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Reported user ID is required"],
        index: true
    },
    callSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'call_sessions'
    },
    reason: {
        type: String,
        enum: ["inappropriate_content", "harassment", "spam", "fake_profile", "other"],
        required: [true, "Report reason is required"]
    },
    details: {
        type: String,
        default: "",
        trim: true,
        maxlength: [500, "Details cannot exceed 500 characters"]
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "actioned", "dismissed"],
        default: "pending",
        index: true
    }
}, {
    timestamps: true
});

const ReportModel = mongoose.model('reports', ReportSchema);
export default ReportModel;

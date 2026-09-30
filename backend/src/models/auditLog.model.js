import mongoose from 'mongoose';

/**
 * AuditLog Schema — System Administrator & System Action Audit Logs
 * Human-Readable & Modular Schema Definition
 */
const AuditLogSchema = new mongoose.Schema({
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Actor user ID is required"],
        index: true
    },
    action: {
        type: String,
        required: [true, "Audit action type is required"],
        uppercase: true,
        trim: true,
        index: true
    },
    target: {
        type: String,
        default: "",
        trim: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ip: {
        type: String,
        default: "",
        trim: true
    }
}, {
    timestamps: true
});

const AuditLogModel = mongoose.model('audit_logs', AuditLogSchema);
export default AuditLogModel;

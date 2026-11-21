import mongoose from 'mongoose';

/**
 * AdminLog Schema — Dedicated Audit Trail for Administrative Actions
 * Completely isolated from regular user sessions
 */
const AdminLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admins',
        required: true,
        index: true
    },
    adminEmail: {
        type: String,
        required: true,
        index: true
    },
    adminName: {
        type: String,
        default: 'Admin'
    },
    action: {
        type: String,
        required: true,
        index: true // e.g. LOGIN, RESOLVE_QUERY, BAN_USER, UNBAN_USER, UPDATE_ADS, DELETE_USER
    },
    target: {
        type: String,
        default: null // Target ID or entity
    },
    ip: {
        type: String,
        default: '127.0.0.1'
    },
    device: {
        type: String,
        default: 'Desktop'
    },
    location: {
        type: String,
        default: 'Localhost'
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

const AdminLogModel = mongoose.model('admin_logs', AdminLogSchema);
export default AdminLogModel;

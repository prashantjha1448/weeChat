import mongoose from 'mongoose';

/**
 * DailyStats Schema — Platform Daily Active Metrics & Performance Analytics
 * Human-Readable & Modular Schema Definition
 */
const DailyStatsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, "Stats date is required"],
        unique: true,
        index: true
    },
    DAU: {
        type: Number,
        default: 0 // Daily Active Users count
    },
    totalCalls: {
        type: Number,
        default: 0 // Total completed video call sessions
    },
    avgDuration: {
        type: Number,
        default: 0 // Average call duration in seconds
    },
    reports: {
        type: Number,
        default: 0 // Total reports filed on this date
    }
}, {
    timestamps: true
});

const DailyStatsModel = mongoose.model('daily_stats', DailyStatsSchema);
export default DailyStatsModel;

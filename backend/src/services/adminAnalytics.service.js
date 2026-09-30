import DailyStatsModel from '../models/dailyStats.model.js';
import UserModel from '../models/user.model.js';
import CallSessionModel from '../models/callSession.model.js';
import ReportModel from '../models/report.model.js';

/**
 * Admin Analytics Service — DailyStats & Platform Metrics
 */

export const getPlatformStatsService = async () => {
    const totalUsers = await UserModel.countDocuments({ deletedAt: null });
    const activeBannedUsers = await UserModel.countDocuments({ isBanned: true });
    const totalCallsCompleted = await CallSessionModel.countDocuments();
    const pendingReports = await ReportModel.countDocuments({ status: "pending" });

    const recentDailyStats = await DailyStatsModel.find()
        .sort({ date: -1 })
        .limit(30);

    return {
        totalUsers,
        activeBannedUsers,
        totalCallsCompleted,
        pendingReports,
        recentDailyStats
    };
};

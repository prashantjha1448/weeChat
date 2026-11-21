import UserModel from '../models/user.model.js';
import AdminModel from '../models/admin.model.js';
import AdminLogModel from '../models/adminLog.model.js';
import CallSessionModel from '../models/callSession.model.js';
import CustomRoomModel from '../models/customRoom.model.js';
import ChatMessageModel from '../models/chatMessage.model.js';
import ReportModel from '../models/report.model.js';
import TransactionModel from '../models/transaction.model.js';
import AuthSessionModel from '../models/authSession.model.js';
import SupportTicketModel from '../models/supportTicket.model.js';

export const getPlatformStats = async (req, res) => {
    try {
        const now = new Date();
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

        // Client User Filter: Strictly exclude admin accounts
        const userFilter = { deletedAt: null, role: { $nin: ['admin', 'superadmin'] } };

        const [
            totalUsers,
            activeBannedUsers,
            totalAdminsCount,
            totalCallsCompleted,
            callDurationAgg,
            totalRooms,
            activeRooms,
            totalMessages,
            pendingReports,
            openQueries,
            maleCount,
            femaleCount,
            otherGenderCount,
            activeSessionsCount,
            usersWithDob,
            txSummary,
            recentAdminLogs
        ] = await Promise.all([
            UserModel.countDocuments(userFilter),
            UserModel.countDocuments({ ...userFilter, isBanned: true }),
            AdminModel.countDocuments({ isActive: true }),
            CallSessionModel.countDocuments(),
            CallSessionModel.aggregate([
                { $group: { _id: null, totalSeconds: { $sum: '$duration' } } }
            ]),
            CustomRoomModel.countDocuments(),
            CustomRoomModel.countDocuments({ isActive: true }),
            ChatMessageModel.countDocuments(),
            ReportModel.countDocuments({ status: "pending" }),
            SupportTicketModel.countDocuments({ status: { $in: ["open", "in_progress"] } }),
            UserModel.countDocuments({ ...userFilter, gender: 'male' }),
            UserModel.countDocuments({ ...userFilter, gender: 'female' }),
            UserModel.countDocuments({ ...userFilter, gender: 'other' }),
            AuthSessionModel.countDocuments({
                revokedAt: null,
                updatedAt: { $gte: fifteenMinsAgo }
            }),
            UserModel.find(userFilter).select('dob gender createdAt'),
            TransactionModel.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$amount' }
                    }
                }
            ]),
            AdminLogModel.find().sort({ createdAt: -1 }).limit(10)
        ]);

        const activeUsersNow = activeSessionsCount || 0;
        const validTotalUsers = Math.max(1, totalUsers);
        const malePercent = totalUsers > 0 ? Math.round((maleCount / validTotalUsers) * 100) : 0;
        const femalePercent = totalUsers > 0 ? Math.round((femaleCount / validTotalUsers) * 100) : 0;
        const otherPercent = totalUsers > 0 ? Math.max(0, 100 - (malePercent + femalePercent)) : 0;

        // Age Demographics dynamically calculated from genuine client dob
        const ageGroups = { '18-24': 0, '25-34': 0, '35-44': 0, '45+': 0, 'unspecified': 0 };

        usersWithDob.forEach((u) => {
            if (!u.dob) {
                ageGroups['unspecified']++;
                return;
            }
            const birthDate = new Date(u.dob);
            const age = Math.floor((now.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

            if (age < 18 || isNaN(age)) {
                ageGroups['unspecified']++;
            } else if (age <= 24) {
                ageGroups['18-24']++;
            } else if (age <= 34) {
                ageGroups['25-34']++;
            } else if (age <= 44) {
                ageGroups['35-44']++;
            } else {
                ageGroups['45+']++;
            }
        });

        const ageBreakdown = [
            { group: '18-24 yrs', count: ageGroups['18-24'], percent: totalUsers > 0 ? Math.round((ageGroups['18-24'] / validTotalUsers) * 100) : 0 },
            { group: '25-34 yrs', count: ageGroups['25-34'], percent: totalUsers > 0 ? Math.round((ageGroups['25-34'] / validTotalUsers) * 100) : 0 },
            { group: '35-44 yrs', count: ageGroups['35-44'], percent: totalUsers > 0 ? Math.round((ageGroups['35-44'] / validTotalUsers) * 100) : 0 },
            { group: '45+ yrs', count: ageGroups['45+'], percent: totalUsers > 0 ? Math.round((ageGroups['45+'] / validTotalUsers) * 100) : 0 },
            { group: 'Unspecified', count: ageGroups['unspecified'], percent: totalUsers > 0 ? Math.round((ageGroups['unspecified'] / validTotalUsers) * 100) : 0 }
        ];

        const totalCallDurationSecs = callDurationAgg[0]?.totalSeconds || 0;
        const totalCallMinutes = Math.round(totalCallDurationSecs / 60);

        const callScore = totalCallsCompleted * 3;
        const roomScore = totalRooms * 4;
        const msgScore = totalMessages * 1;
        const totalFeatureScore = Math.max(1, callScore + roomScore + msgScore);

        const featureUsage = [
            {
                key: 'one_on_one',
                name: '1-on-1 Video Chat',
                totalEvents: totalCallsCompleted,
                metricLabel: `${totalCallMinutes} Call Minutes`,
                sharePercent: Math.round((callScore / totalFeatureScore) * 100)
            },
            {
                key: 'group_rooms',
                name: 'Group Room Lounges',
                totalEvents: totalRooms,
                metricLabel: `${activeRooms} Active Lounges`,
                sharePercent: Math.round((roomScore / totalFeatureScore) * 100)
            },
            {
                key: 'in_call_chat',
                name: 'In-Call Text Chat',
                totalEvents: totalMessages,
                metricLabel: `${totalMessages} Sent Messages`,
                sharePercent: Math.round((msgScore / totalFeatureScore) * 100)
            }
        ];

        let mostUsedFeature = featureUsage[0];
        featureUsage.forEach(f => {
            if (f.sharePercent > mostUsedFeature.sharePercent) {
                mostUsedFeature = f;
            }
        });

        let totalRevenue = 0;
        let successfulTx = 0;
        let pendingTx = 0;
        let failedTx = 0;

        txSummary.forEach(item => {
            if (item._id === 'success') {
                totalRevenue = item.totalAmount || 0;
                successfulTx = item.count || 0;
            } else if (item._id === 'pending') {
                pendingTx = item.count || 0;
            } else if (item._id === 'failed') {
                failedTx = item.count || 0;
            }
        });

        return res.status(200).json({
            success: true,
            statusCode: 200,
            data: {
                totalUsers,
                totalAdmins: totalAdminsCount,
                activeUsersNow,
                activeBannedUsers,
                pendingReports,
                openQueries,
                genderDistribution: {
                    male: { count: maleCount, percent: malePercent },
                    female: { count: femaleCount, percent: femalePercent },
                    other: { count: otherGenderCount, percent: otherPercent }
                },
                ageDemographics: ageBreakdown,
                featureUsage: {
                    features: featureUsage,
                    mostUsedFeature,
                    totalCalls: totalCallsCompleted,
                    totalCallMinutes,
                    totalRooms,
                    activeRooms,
                    totalMessages
                },
                paymentsSummary: {
                    totalRevenue,
                    totalTransactions: successfulTx + pendingTx + failedTx,
                    successfulCount: successfulTx,
                    pendingCount: pendingTx,
                    failedCount: failedTx
                },
                recentAdminLogs
            },
            message: "Platform analytics fetched successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: err.message
        });
    }
};

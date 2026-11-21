import UserModel from '../models/user.model.js';
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

        const [
            totalUsers,
            activeBannedUsers,
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
            txSummary
        ] = await Promise.all([
            UserModel.countDocuments({ deletedAt: null }),
            UserModel.countDocuments({ isBanned: true }),
            CallSessionModel.countDocuments(),
            CallSessionModel.aggregate([
                { $group: { _id: null, totalSeconds: { $sum: '$duration' } } }
            ]),
            CustomRoomModel.countDocuments(),
            CustomRoomModel.countDocuments({ isActive: true }),
            ChatMessageModel.countDocuments(),
            ReportModel.countDocuments({ status: "pending" }),
            SupportTicketModel.countDocuments({ status: { $in: ["open", "in_progress"] } }),
            UserModel.countDocuments({ gender: 'male', deletedAt: null }),
            UserModel.countDocuments({ gender: 'female', deletedAt: null }),
            UserModel.countDocuments({ gender: 'other', deletedAt: null }),
            AuthSessionModel.countDocuments({
                revokedAt: null,
                updatedAt: { $gte: fifteenMinsAgo }
            }),
            UserModel.find({ deletedAt: null }).select('dob gender createdAt'),
            TransactionModel.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$amount' }
                    }
                }
            ])
        ]);

        const activeUsersNow = Math.max(1, activeSessionsCount || 1);

        const validTotalUsers = Math.max(1, totalUsers);
        const malePercent = Math.round((maleCount / validTotalUsers) * 100);
        const femalePercent = Math.round((femaleCount / validTotalUsers) * 100);
        const otherPercent = Math.max(0, 100 - (malePercent + femalePercent));

        // Age Demographics from user dob
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
            { group: '18-24 yrs', count: ageGroups['18-24'], percent: Math.round((ageGroups['18-24'] / validTotalUsers) * 100) },
            { group: '25-34 yrs', count: ageGroups['25-34'], percent: Math.round((ageGroups['25-34'] / validTotalUsers) * 100) },
            { group: '35-44 yrs', count: ageGroups['35-44'], percent: Math.round((ageGroups['35-44'] / validTotalUsers) * 100) },
            { group: '45+ yrs', count: ageGroups['45+'], percent: Math.round((ageGroups['45+'] / validTotalUsers) * 100) },
            { group: 'Unspecified', count: ageGroups['unspecified'], percent: Math.round((ageGroups['unspecified'] / validTotalUsers) * 100) }
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

        const sortedFeatures = [...featureUsage].sort((a, b) => b.sharePercent - a.sharePercent);
        const mostUsedFeature = sortedFeatures[0]?.name || '1-on-1 Video Chat';

        let totalRevenue = 0;
        let successfulTx = 0;
        let pendingTx = 0;
        let failedTx = 0;

        txSummary.forEach((t) => {
            if (t._id === 'success') {
                totalRevenue = t.totalAmount;
                successfulTx = t.count;
            } else if (t._id === 'pending') {
                pendingTx = t.count;
            } else if (t._id === 'failed') {
                failedTx = t.count;
            }
        });

        return res.status(200).json({
            success: true,
            statusCode: 200,
            data: {
                totalUsers,
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
                }
            },
            message: "Platform analytics fetched"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: err.message
        });
    }
};

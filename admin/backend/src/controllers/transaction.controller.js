import TransactionModel from '../models/transaction.model.js';
import UserModel from '../models/user.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

/**
 * GET /api/admin/transactions
 * List all transactions with gateway IDs, user details, and metrics
 */
export const getAdminTransactions = async (req, res) => {
    const {
        query,
        status, // 'all', 'success', 'pending', 'failed'
        gateway, // 'all', 'razorpay', 'stripe', 'upi'
        page = 1,
        limit = 20
    } = req.query;

    const filter = {};

    if (status && status !== 'all' && ['success', 'pending', 'failed'].includes(status)) {
        filter.status = status;
    }

    if (gateway && gateway !== 'all' && ['razorpay', 'stripe', 'upi'].includes(gateway)) {
        filter.gateway = gateway;
    }

    if (query && typeof query === 'string' && query.trim()) {
        const safeQuery = query.trim().slice(0, 50).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Find matching users first
        const matchingUsers = await UserModel.find({
            $or: [
                { name: { $regex: safeQuery, $options: 'i' } },
                { email: { $regex: safeQuery, $options: 'i' } },
                { username: { $regex: safeQuery, $options: 'i' } }
            ]
        }).select('_id');

        const userIds = matchingUsers.map((u) => u._id);

        filter.$or = [
            { gatewayRef: { $regex: safeQuery, $options: 'i' } },
            { userId: { $in: userIds } }
        ];
    }

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (currentPage - 1) * perPage;

    const [transactions, total, summaryAgg] = await Promise.all([
        TransactionModel.find(filter)
            .populate('userId', 'name username email avatar role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(perPage),
        TransactionModel.countDocuments(filter),
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

    let totalVolume = 0;
    let successCount = 0;
    let pendingCount = 0;
    let failedCount = 0;

    summaryAgg.forEach((s) => {
        if (s._id === 'success') {
            totalVolume += s.totalAmount;
            successCount += s.count;
        } else if (s._id === 'pending') {
            pendingCount += s.count;
        } else if (s._id === 'failed') {
            failedCount += s.count;
        }
    });

    const totalPages = Math.ceil(total / perPage);

    return res.status(200).json(
        new ApiResponse(200, {
            transactions,
            summary: {
                totalVolume,
                totalTransactions: total,
                successCount,
                pendingCount,
                failedCount
            },
            pagination: {
                total,
                page: currentPage,
                limit: perPage,
                totalPages
            }
        }, "Transactions fetched successfully")
    );
};

/**
 * POST /api/admin/transactions
 * Create a Payment / Transaction record manually
 */
export const createAdminTransaction = async (req, res) => {
    const { userId, userEmail, amount, currency = 'INR', gateway, gatewayRef, status = 'success' } = req.body;

    if (!amount || !gateway || !gatewayRef) {
        throw new ApiError(400, "Amount, gateway, and gatewayRef (Payment ID) are required");
    }

    let targetUserId = userId;
    if (!targetUserId && userEmail) {
        const u = await UserModel.findOne({ email: userEmail.toLowerCase().trim() });
        if (u) targetUserId = u._id;
    }

    if (!targetUserId) {
        // Fallback to admin user
        targetUserId = req.user?._id;
    }

    const tx = await TransactionModel.create({
        userId: targetUserId,
        amount: Number(amount),
        currency: currency.toUpperCase(),
        gateway,
        gatewayRef: gatewayRef.trim(),
        status
    });

    const populatedTx = await TransactionModel.findById(tx._id).populate('userId', 'name username email avatar');

    return res.status(201).json(new ApiResponse(201, populatedTx, "Transaction recorded successfully"));
};

/**
 * PATCH /api/admin/transactions/:txId/status
 * Update Transaction Status
 */
export const updateAdminTransactionStatus = async (req, res) => {
    const { txId } = req.params;
    const { status } = req.body;

    if (!['pending', 'success', 'failed'].includes(status)) {
        throw new ApiError(400, "Invalid status specified");
    }

    const tx = await TransactionModel.findByIdAndUpdate(
        txId,
        { status },
        { new: true }
    ).populate('userId', 'name username email avatar');

    if (!tx) {
        throw new ApiError(404, "Transaction not found");
    }

    return res.status(200).json(new ApiResponse(200, tx, "Transaction status updated"));
};

import ApiResponse from '../utils/ApiResponse.js';
import { getPlatformStatsService } from '../services/adminAnalytics.service.js';

// GET /api/admin/stats (Admin protected)
export const getPlatformStats = async (req, res) => {
    const stats = await getPlatformStatsService();
    return res.status(200).json(new ApiResponse(200, stats, "Platform analytics fetched successfully"));
};

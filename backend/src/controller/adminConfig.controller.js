import ApiResponse from '../utils/ApiResponse.js';
import { getAppConfigsService, setAppConfigService } from '../services/adminConfig.service.js';

// GET /api/admin/config
export const getAppConfigs = async (req, res) => {
    const configs = await getAppConfigsService();
    return res.status(200).json(new ApiResponse(200, configs, "App configurations fetched successfully"));
};

// POST /api/admin/config (Admin protected)
export const setAppConfig = async (req, res) => {
    const { key, value, isEnabled } = req.body;
    const config = await setAppConfigService(req.user._id, key, value, isEnabled);
    return res.status(200).json(new ApiResponse(200, config, "App configuration updated successfully"));
};

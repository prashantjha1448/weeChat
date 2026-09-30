import AppConfigModel from '../models/appConfig.model.js';

/**
 * Admin Config Service — System Dynamic Feature Flags
 */

export const getAppConfigsService = async () => {
    const configs = await AppConfigModel.find();
    return configs;
};

export const setAppConfigService = async (adminId, key, value, isEnabled = true) => {
    const config = await AppConfigModel.findOneAndUpdate(
        { key: key.toUpperCase() },
        {
            key: key.toUpperCase(),
            value,
            isEnabled,
            updatedBy: adminId
        },
        { upsert: true, new: true }
    );

    return config;
};

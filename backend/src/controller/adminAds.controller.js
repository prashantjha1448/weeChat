import AppConfigModel from '../models/appConfig.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

// Default Placements Template
const DEFAULT_ADS_CONFIG = [
    {
        id: 'TOP_BANNER',
        name: 'Top Header Banner',
        placement: 'header_top',
        description: 'Displays horizontally below the navigation bar across the landing and rooms page',
        isEnabled: false,
        provider: 'custom_image',
        title: 'Join the weeChat Creators Lounge',
        caption: 'Host rooms with up to 100 members with ultra-low latency WebRTC',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        targetUrl: 'https://wee-chat-virid.vercel.app/rooms',
        scriptCode: '',
        impressions: 1420,
        clicks: 86
    },
    {
        id: 'CALL_OVERLAY',
        name: 'In-Call Floating Banner',
        placement: 'call_overlay',
        description: 'Subtle translucent glass card pinned to the corner of the 1-on-1 video call stage',
        isEnabled: false,
        provider: 'custom_image',
        title: 'Upgrade to weeChat Pro',
        caption: 'HD 1080p, unlimited filters, and priority matching queue',
        imageUrl: '',
        targetUrl: 'https://wee-chat-virid.vercel.app/home',
        scriptCode: '',
        impressions: 320,
        clicks: 14
    },
    {
        id: 'MATCH_SCREEN',
        name: 'Matchmaking Queue Card',
        placement: 'match_screen',
        description: 'Shown directly below the searching card while waiting for stranger pairing',
        isEnabled: false,
        provider: 'affiliate',
        title: 'Sponsored Partner',
        caption: 'Get 50% off WebRTC developer tools today',
        imageUrl: '',
        targetUrl: 'https://wee-chat-virid.vercel.app/',
        scriptCode: '',
        impressions: 890,
        clicks: 42
    },
    {
        id: 'ROOM_SIDEBAR',
        name: 'Group Room Lounge Sidebar',
        placement: 'room_sidebar',
        description: 'Embedded inside the custom group room chat and participants sidebar',
        isEnabled: false,
        provider: 'custom_image',
        title: 'Partner Lounge',
        caption: 'Discover trending community rooms',
        imageUrl: '',
        targetUrl: 'https://wee-chat-virid.vercel.app/rooms',
        scriptCode: '',
        impressions: 430,
        clicks: 19
    },
    {
        id: 'BOTTOM_DOCK',
        name: 'Bottom Floating Dock Banner',
        placement: 'bottom_dock',
        description: 'Displays above the bottom tab bar on mobile and control bar on desktop',
        isEnabled: false,
        provider: 'script',
        title: 'Google AdSense Dock',
        caption: '320x50 or 728x90 responsive responsive ad unit',
        imageUrl: '',
        targetUrl: '',
        scriptCode: '<!-- Google AdSense Unit weeChat-Bottom -->\n<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-0000000000000000" data-ad-slot="0000000000"></ins>',
        impressions: 2100,
        clicks: 110
    }
];

/**
 * GET /api/admin/ads
 * Fetch All Ad Placements Configuration (Admin)
 */
export const getAdsConfigAdmin = async (req, res) => {
    let config = await AppConfigModel.findOne({ key: 'ADS_CONFIG' });

    if (!config || !Array.isArray(config.value) || config.value.length === 0) {
        // Initialize with default template
        config = await AppConfigModel.findOneAndUpdate(
            { key: 'ADS_CONFIG' },
            {
                key: 'ADS_CONFIG',
                value: DEFAULT_ADS_CONFIG,
                isEnabled: true
            },
            { upsert: true, new: true }
        );
    }

    return res.status(200).json(new ApiResponse(200, config.value, "Ads configuration fetched successfully"));
};

/**
 * PUT /api/admin/ads
 * Update All Ad Placements Configuration (Admin)
 */
export const updateAdsConfigAdmin = async (req, res) => {
    const { placements } = req.body;

    if (!Array.isArray(placements)) {
        throw new ApiError(400, "Placements array is required");
    }

    const updatedConfig = await AppConfigModel.findOneAndUpdate(
        { key: 'ADS_CONFIG' },
        {
            key: 'ADS_CONFIG',
            value: placements,
            isEnabled: true,
            updatedBy: req.user?._id
        },
        { upsert: true, new: true }
    );

    return res.status(200).json(new ApiResponse(200, updatedConfig.value, "Ads configuration saved successfully"));
};

/**
 * PATCH /api/admin/ads/:placementId/toggle
 * Toggle Active State of an Ad Placement
 */
export const toggleAdPlacementAdmin = async (req, res) => {
    const { placementId } = req.params;
    const { isEnabled } = req.body;

    const config = await AppConfigModel.findOne({ key: 'ADS_CONFIG' });
    let placements = config?.value || DEFAULT_ADS_CONFIG;

    const targetIdx = placements.findIndex((p) => p.id === placementId);
    if (targetIdx === -1) {
        throw new ApiError(404, "Ad placement not found");
    }

    placements[targetIdx].isEnabled = Boolean(isEnabled);

    await AppConfigModel.findOneAndUpdate(
        { key: 'ADS_CONFIG' },
        {
            value: placements,
            updatedBy: req.user?._id
        },
        { upsert: true }
    );

    return res.status(200).json(
        new ApiResponse(200, placements[targetIdx], `Ad placement ${isEnabled ? 'enabled' : 'disabled'} successfully`)
    );
};

/**
 * GET /api/ads/active or /api/public/ads
 * Public Endpoint: Returns only enabled ads for client rendering
 */
export const getActivePublicAds = async (req, res) => {
    const config = await AppConfigModel.findOne({ key: 'ADS_CONFIG' });
    const placements = Array.isArray(config?.value) ? config.value : DEFAULT_ADS_CONFIG;

    // Filter to enabled only and strip sensitive admin fields
    const activeAds = placements
        .filter((p) => p.isEnabled)
        .map((p) => ({
            id: p.id,
            placement: p.placement,
            provider: p.provider,
            title: p.title,
            caption: p.caption,
            imageUrl: p.imageUrl,
            targetUrl: p.targetUrl,
            scriptCode: p.scriptCode
        }));

    return res.status(200).json(new ApiResponse(200, activeAds, "Active ads retrieved"));
};

/**
 * POST /api/public/ads/:placementId/click
 * Track Ad Click or Impression
 */
export const trackAdEvent = async (req, res) => {
    const { placementId } = req.params;
    const { eventType = 'click' } = req.body; // 'click' | 'impression'

    const config = await AppConfigModel.findOne({ key: 'ADS_CONFIG' });
    if (!config || !Array.isArray(config.value)) {
        return res.status(200).json(new ApiResponse(200, null, "No ads configured"));
    }

    const placements = [...config.value];
    const targetIdx = placements.findIndex((p) => p.id === placementId);

    if (targetIdx !== -1) {
        if (eventType === 'click') {
            placements[targetIdx].clicks = (placements[targetIdx].clicks || 0) + 1;
        } else {
            placements[targetIdx].impressions = (placements[targetIdx].impressions || 0) + 1;
        }

        await AppConfigModel.findOneAndUpdate(
            { key: 'ADS_CONFIG' },
            { value: placements }
        );
    }

    return res.status(200).json(new ApiResponse(200, null, "Event recorded"));
};

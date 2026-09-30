import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { uploadToCloudinary } from '../services/cloudinary.service.js';

/**
 * POST /api/upload/media
 * Upload image or video file to Cloudinary
 */
export const uploadMedia = async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, 'No media file provided in request.');
    }

    const isVideo = req.file.mimetype.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';
    const folder = isVideo ? 'nexus_app/videos' : 'nexus_app/images';

    const uploadResult = await uploadToCloudinary(req.file.buffer, {
        folder,
        resource_type: resourceType
    });

    return res.status(200).json(
        new ApiResponse(200, uploadResult, 'Media uploaded successfully to Cloudinary')
    );
};

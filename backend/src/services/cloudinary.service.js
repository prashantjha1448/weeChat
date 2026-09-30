import cloudinary from '../config/cloudinary.config.js';
import ApiError from '../utils/ApiError.js';

/**
 * Upload file buffer directly to Cloudinary using upload stream
 * @param {Buffer} fileBuffer - File buffer from multer memory storage
 * @param {Object} options - Upload options (folder, resource_type: 'image' | 'video' | 'auto')
 * @returns {Promise<Object>} Cloudinary upload result object
 */
export const uploadToCloudinary = (fileBuffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadFolder = options.folder || 'nexus_app';
        const resourceType = options.resource_type || 'auto';

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: uploadFolder,
                resource_type: resourceType,
                ...options
            },
            (error, result) => {
                if (error) {
                    console.error('[CLOUDINARY ERROR]', error);
                    return reject(new ApiError(500, `Cloudinary Upload Failed: ${error.message}`));
                }
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                    resource_type: result.resource_type,
                    format: result.format,
                    bytes: result.bytes,
                    width: result.width,
                    height: result.height,
                    duration: result.duration || 0
                });
            }
        );

        uploadStream.end(fileBuffer);
    });
};

/**
 * Delete asset from Cloudinary by publicId
 * @param {string} publicId - Cloudinary asset public ID
 * @param {string} resourceType - 'image' or 'video'
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        return result;
    } catch (error) {
        console.error('[CLOUDINARY DELETE ERROR]', error);
        throw new ApiError(500, `Cloudinary Delete Failed: ${error.message}`);
    }
};

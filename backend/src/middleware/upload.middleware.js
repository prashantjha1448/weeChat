import multer from 'multer';
import ApiError from '../utils/ApiError.js';

// Store files in memory buffer for stream upload to Cloudinary
const storage = multer.memoryStorage();

// Mimetype filter for images and videos
const mediaFileFilter = (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');

    if (isImage || isVideo) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'Unsupported file format. Only images and videos are allowed.'), false);
    }
};

export const uploadMediaMiddleware = multer({
    storage,
    fileFilter: mediaFileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB max limit for video uploads
    }
});

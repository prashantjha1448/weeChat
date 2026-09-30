import api from '../api/axios.js';

/**
 * Upload single image or video file to Cloudinary via backend API
 * @param {File} file - File object (image/* or video/*)
 * @returns {Promise<Object>} Upload response object containing Cloudinary URL and media details
 */
export const uploadMediaService = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('upload/media', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
};

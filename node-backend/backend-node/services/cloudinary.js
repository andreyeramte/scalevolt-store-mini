const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ds6mvmvba', 
    api_key: process.env.CLOUDINARY_API_KEY || '692525747653515', 
    api_secret: process.env.CLOUDINARY_API_SECRET || '<**********>'
});

class CloudinaryService {
    /**
     * Upload an image to Cloudinary
     * @param {string} imagePath - Local file path or URL
     * @param {string} publicId - Public ID for the image
     * @param {Object} options - Additional upload options
     * @returns {Promise<Object>} Upload result
     */
    async uploadImage(imagePath, publicId, options = {}) {
        try {
            const uploadResult = await cloudinary.uploader.upload(imagePath, {
                public_id: publicId,
                ...options
            });
            
            console.log('✅ Image uploaded successfully:', uploadResult.public_id);
            return uploadResult;
        } catch (error) {
            console.error('❌ Image upload failed:', error);
            throw error;
        }
    }

    /**
     * Get optimized URL for an image
     * @param {string} publicId - Public ID of the image
     * @param {Object} options - Transformation options
     * @returns {string} Optimized URL
     */
    getOptimizedUrl(publicId, options = {}) {
        const defaultOptions = {
            fetch_format: 'auto',
            quality: 'auto',
            ...options
        };
        
        return cloudinary.url(publicId, defaultOptions);
    }

    /**
     * Get transformed URL for an image
     * @param {string} publicId - Public ID of the image
     * @param {Object} options - Transformation options
     * @returns {string} Transformed URL
     */
    getTransformedUrl(publicId, options = {}) {
        const defaultOptions = {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500,
            ...options
        };
        
        return cloudinary.url(publicId, defaultOptions);
    }

    /**
     * Delete an image from Cloudinary
     * @param {string} publicId - Public ID of the image
     * @returns {Promise<Object>} Deletion result
     */
    async deleteImage(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            console.log('✅ Image deleted successfully:', publicId);
            return result;
        } catch (error) {
            console.error('❌ Image deletion failed:', error);
            throw error;
        }
    }

    /**
     * Get image information
     * @param {string} publicId - Public ID of the image
     * @returns {Promise<Object>} Image information
     */
    async getImageInfo(publicId) {
        try {
            const result = await cloudinary.api.resource(publicId);
            return result;
        } catch (error) {
            console.error('❌ Failed to get image info:', error);
            throw error;
        }
    }
}

// Export singleton instance
const cloudinaryService = new CloudinaryService();
module.exports = cloudinaryService;

// Example usage (for testing)
if (require.main === module) {
    (async function() {
        try {
            console.log('🧪 Testing Cloudinary Service...');
            
            // Test upload
            const uploadResult = await cloudinaryService.uploadImage(
                'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
                'test-shoes'
            );
            
            console.log('📤 Upload Result:', uploadResult);
            
            // Test optimized URL
            const optimizeUrl = cloudinaryService.getOptimizedUrl('test-shoes');
            console.log('🔗 Optimized URL:', optimizeUrl);
            
            // Test transformed URL
            const autoCropUrl = cloudinaryService.getTransformedUrl('test-shoes');
            console.log('✂️ Transformed URL:', autoCropUrl);
            
        } catch (error) {
            console.error('❌ Test failed:', error);
        }
    })();
}

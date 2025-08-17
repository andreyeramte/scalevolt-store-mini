const cloudinaryService = require('./services/cloudinary');

console.log('🧪 Testing Cloudinary Integration...');
console.log('=' .repeat(40));

(async function() {
    try {
        console.log('1. 🔌 Testing Cloudinary Configuration...');
        
        // Test basic configuration
        if (cloudinaryService) {
            console.log('   ✅ Cloudinary service loaded successfully');
        } else {
            console.log('   ❌ Failed to load Cloudinary service');
            return;
        }

        console.log('\n2. 📤 Testing Image Upload...');
        
        // Test upload with demo image
        const uploadResult = await cloudinaryService.uploadImage(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
            'test-shoes-' + Date.now() // Unique name to avoid conflicts
        );
        
        console.log('   ✅ Upload successful!');
        console.log('   📊 Public ID:', uploadResult.public_id);
        console.log('   🔗 URL:', uploadResult.secure_url);
        console.log('   📏 Size:', uploadResult.bytes, 'bytes');

        console.log('\n3. 🔗 Testing URL Generation...');
        
        // Test optimized URL
        const optimizeUrl = cloudinaryService.getOptimizedUrl(uploadResult.public_id);
        console.log('   ✅ Optimized URL:', optimizeUrl);
        
        // Test transformed URL
        const autoCropUrl = cloudinaryService.getTransformedUrl(uploadResult.public_id);
        console.log('   ✅ Transformed URL:', autoCropUrl);

        console.log('\n4. 📋 Testing Image Info...');
        
        // Test getting image information
        const imageInfo = await cloudinaryService.getImageInfo(uploadResult.public_id);
        console.log('   ✅ Image info retrieved');
        console.log('   📊 Format:', imageInfo.format);
        console.log('   📏 Dimensions:', imageInfo.width, 'x', imageInfo.height);

        console.log('\n5. 🗑️ Testing Image Deletion...');
        
        // Test image deletion
        const deleteResult = await cloudinaryService.deleteImage(uploadResult.public_id);
        console.log('   ✅ Image deleted successfully');

        console.log('\n🎉 All Cloudinary tests passed successfully!');
        console.log('✨ Your Cloudinary integration is working perfectly!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        
        if (error.message.includes('Invalid api_key')) {
            console.log('\n💡 Solution: Check your CLOUDINARY_API_SECRET in .env file');
            console.log('   Make sure you have the correct API secret from Cloudinary dashboard');
        } else if (error.message.includes('Invalid cloud_name')) {
            console.log('\n💡 Solution: Check your CLOUDINARY_CLOUD_NAME in .env file');
        } else if (error.message.includes('Invalid api_secret')) {
            console.log('\n💡 Solution: Check your CLOUDINARY_API_SECRET in .env file');
        }
        
        console.log('\n📝 To fix this:');
        console.log('   1. Go to https://cloudinary.com/console');
        console.log('   2. Copy your API Secret');
        console.log('   3. Add it to your .env file as CLOUDINARY_API_SECRET');
    }
})();

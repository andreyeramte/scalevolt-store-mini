const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  inputDir: path.join(__dirname, '..', 'local-images'),
  outputDir: path.join(__dirname, '..', 'out-images'),
  formats: ['webp', 'jpg'], // Output formats
  sizes: [
    { name: 'thumbnail', width: 300, height: 300, quality: 80 },
    { name: 'small', width: 600, height: 600, quality: 85 },
    { name: 'medium', width: 1200, height: 1200, quality: 90 },
    { name: 'large', width: 1920, height: 1920, quality: 95 }
  ],
  supportedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff']
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
  console.log(`✅ Created output directory: ${config.outputDir}`);
}

// Get all image files from input directory
function getImageFiles(inputDir) {
  if (!fs.existsSync(inputDir)) {
    console.log(`❌ Input directory not found: ${inputDir}`);
    return [];
  }

  const files = fs.readdirSync(inputDir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return config.supportedFormats.includes(ext);
  });
}

// Process a single image
async function processImage(inputPath, outputDir, filename) {
  try {
    const nameWithoutExt = path.parse(filename).name;
    const inputBuffer = fs.readFileSync(inputPath);
    
    console.log(`🔄 Processing: ${filename}`);
    
    // Process each size
    for (const size of config.sizes) {
      // Process each format
      for (const format of config.formats) {
        const outputFilename = `${nameWithoutExt}-${size.name}.${format}`;
        const outputPath = path.join(outputDir, outputFilename);
        
        let processedImage = sharp(inputBuffer)
          .resize(size.width, size.height, {
            fit: 'inside',
            withoutEnlargement: true
          });
        
        // Apply format-specific processing
        if (format === 'webp') {
          processedImage = processedImage.webp({ quality: size.quality });
        } else if (format === 'jpg') {
          processedImage = processedImage.jpeg({ quality: size.quality });
        }
        
        // Save the processed image
        await processedImage.toFile(outputPath);
        console.log(`  ✅ Created: ${outputFilename} (${size.width}x${size.height})`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

// Main processing function
async function processAllImages() {
  console.log('🚀 Starting image processing...');
  console.log(`📁 Input directory: ${config.inputDir}`);
  console.log(`📁 Output directory: ${config.outputDir}`);
  console.log('');
  
  const imageFiles = getImageFiles(config.inputDir);
  
  if (imageFiles.length === 0) {
    console.log('❌ No image files found in input directory');
    console.log(`Supported formats: ${config.supportedFormats.join(', ')}`);
    return;
  }
  
  console.log(`📸 Found ${imageFiles.length} image(s) to process:`);
  imageFiles.forEach(file => console.log(`  - ${file}`));
  console.log('');
  
  let successCount = 0;
  let errorCount = 0;
  
  // Process each image
  for (const filename of imageFiles) {
    const inputPath = path.join(config.inputDir, filename);
    const success = await processImage(inputPath, config.outputDir, filename);
    
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
    
    console.log(''); // Add spacing between images
  }
  
  // Summary
  console.log('='.repeat(50));
  console.log('📊 PROCESSING SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Successfully processed: ${successCount} image(s)`);
  console.log(`❌ Failed to process: ${errorCount} image(s)`);
  console.log(`📁 Output location: ${config.outputDir}`);
  console.log('');
  console.log('Generated sizes for each image:');
  config.sizes.forEach(size => {
    console.log(`  - ${size.name}: ${size.width}x${size.height}px`);
  });
  console.log('');
  console.log('Generated formats:');
  config.formats.forEach(format => {
    console.log(`  - ${format.toUpperCase()}`);
  });
  console.log('');
  console.log('🎉 Image processing complete!');
}

// Run the script
if (require.main === module) {
  processAllImages().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  processImage,
  processAllImages,
  config
};

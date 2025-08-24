const axios = require('axios');

// Test region detection API
async function testRegionDetection() {
  console.log('🧪 Testing Region Detection API...\n');
  
  try {
    // Test 1: Basic region detection
    console.log('1️⃣ Testing basic region detection...');
    const response1 = await axios.get('http://localhost:4242/api/region-detect');
    console.log('✅ Response:', response1.data);
    
    // Test 2: Test with different IP headers
    console.log('\n2️⃣ Testing with custom IP headers...');
    const response2 = await axios.get('http://localhost:4242/api/region-detect', {
      headers: {
        'X-Forwarded-For': '185.1.1.1', // Polish IP
        'X-Real-IP': '185.1.1.1'
      }
    });
    console.log('✅ Response with Polish IP:', response2.data);
    
    // Test 3: Test region setting
    console.log('\n3️⃣ Testing region setting...');
    const response3 = await axios.post('http://localhost:4242/api/region-set', {
      region: 'UA',
      lang: 'ua'
    });
    console.log('✅ Response setting UA region:', response3.data);
    
    // Test 4: Test products with region filtering
    console.log('\n4️⃣ Testing products with region filtering...');
    const response4 = await axios.get('http://localhost:4242/api/products?region=UA');
    console.log(`✅ Found ${response4.data.length} products for UA region`);
    
    // Test 5: Test search with region filtering
    console.log('\n5️⃣ Testing search with region filtering...');
    const response5 = await axios.get('http://localhost:4242/api/products/search?q=solar&region=UA');
    console.log(`✅ Found ${response5.data.length} search results for UA region`);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Test available regions API
async function testAvailableRegions() {
  console.log('\n🌍 Testing Available Regions API...\n');
  
  try {
    const response = await axios.get('http://localhost:4242/api/regions');
    console.log('✅ Available regions:', response.data);
  } catch (error) {
    console.error('❌ Failed to get regions:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Region Detection Tests\n');
  console.log('Make sure your backend server is running on port 4242\n');
  
  await testRegionDetection();
  await testAvailableRegions();
  
  console.log('\n✨ Test suite completed!');
}

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testRegionDetection, testAvailableRegions };

const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';
const API_V1_URL = `${API_BASE_URL}/api/v1`;

console.log('🧪 Testing Backend API Endpoints...\n');
console.log(`Base URL: ${API_BASE_URL}\n`);

const tests = [];

async function testEndpoint(name, method, url, data = null, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${url}`,
      validateStatus: () => true, // Don't throw on any status
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    const success = response.status === expectedStatus;
    
    tests.push({
      name,
      success,
      status: response.status,
      expectedStatus,
      url
    });
    
    return { success, response };
  } catch (error) {
    tests.push({
      name,
      success: false,
      error: error.message,
      url
    });
    
    return { success: false, error };
  }
}

async function runTests() {
  console.log('Running tests...\n');
  
  // Test 1: Root endpoint
  await testEndpoint('Root Endpoint', 'GET', '/');
  
  // Test 2: API v1 base (should 404 but server is running)
  await testEndpoint('API v1 Base', 'GET', '/api/v1', null, 404);
  
  // Test 3: Get all products (public)
  await testEndpoint('Get All Products', 'GET', '/api/v1/products');
  
  // Test 4: Get all categories (public)
  await testEndpoint('Get All Categories', 'GET', '/api/v1/categories');
  
  // Test 5: Login endpoint exists (should fail without credentials)
  await testEndpoint('Login Endpoint', 'POST', '/api/v1/auth/login', {}, 400);
  
  // Test 6: Register endpoint exists (should fail without data)
  await testEndpoint('Register Endpoint', 'POST', '/api/v1/auth/register', {}, 400);
  
  // Print results
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                      TEST RESULTS                         ');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach((test, index) => {
    const icon = test.success ? '✅' : '❌';
    const status = test.status ? `[${test.status}]` : '[ERROR]';
    
    console.log(`${icon} ${index + 1}. ${test.name}`);
    console.log(`   URL: ${test.url}`);
    
    if (test.success) {
      console.log(`   Status: ${status} (Expected: ${test.expectedStatus})`);
      passed++;
    } else {
      console.log(`   Status: ${status}`);
      if (test.expectedStatus) {
        console.log(`   Expected: ${test.expectedStatus}`);
      }
      if (test.error) {
        console.log(`   Error: ${test.error}`);
      }
      failed++;
    }
    console.log('');
  });
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total Tests: ${tests.length}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  if (failed > 0) {
    console.log('💡 Troubleshooting:');
    
    const hasConnectionError = tests.some(t => t.error && t.error.includes('ECONNREFUSED'));
    if (hasConnectionError) {
      console.log('  ⚠️  Backend server is not running!');
      console.log('  → Start backend: cd apps/backend && npm run dev\n');
    }
    
    const hasUnexpectedStatus = tests.some(t => !t.success && !t.error);
    if (hasUnexpectedStatus) {
      console.log('  ⚠️  Some endpoints returned unexpected status codes');
      console.log('  → Check backend logs for errors\n');
    }
  } else {
    console.log('🎉 All tests passed! Backend is working correctly.\n');
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

// Check if backend is reachable first
axios.get(API_BASE_URL, { timeout: 5000 })
  .then(() => {
    runTests();
  })
  .catch((error) => {
    console.log('❌ Cannot connect to backend server!\n');
    console.log(`URL: ${API_BASE_URL}`);
    console.log(`Error: ${error.message}\n`);
    console.log('💡 Make sure backend is running:');
    console.log('   cd apps/backend');
    console.log('   npm run dev\n');
    process.exit(1);
  });

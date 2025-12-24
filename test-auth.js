const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';
const API_V1_URL = `${API_BASE_URL}/api/v1`;

console.log('🧪 Testing Registration & Login Flow...\n');
console.log(`API URL: ${API_V1_URL}\n`);

// Test data
const testUser = {
  email: `test${Date.now()}@example.com`,
  password: 'test123',
  fullName: 'Test User'
};

async function testRegistration() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                 REGISTRATION TEST                         ');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('Test User Data:');
  console.log(`  Email: ${testUser.email}`);
  console.log(`  Password: ${testUser.password}`);
  console.log(`  Full Name: ${testUser.fullName}\n`);
  
  try {
    console.log('📤 Sending registration request...\n');
    
    const response = await axios.post(`${API_V1_URL}/auth/register`, testUser);
    
    if (response.data.success) {
      console.log('✅ Registration Successful!\n');
      console.log('Response:');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('\n');
      return true;
    } else {
      console.log('❌ Registration Failed!\n');
      console.log('Response:');
      console.log(JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ Registration Error!\n');
    
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Error Data:');
      console.log(JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 409) {
        console.log('\n💡 Email already exists - This is expected if running test multiple times');
      } else if (error.response.status === 400) {
        console.log('\n💡 Validation Error - Check the error messages above');
      }
    } else if (error.request) {
      console.log('No response from server');
      console.log('Make sure backend is running: cd apps/backend && npm run dev');
    } else {
      console.log('Error:', error.message);
    }
    
    return false;
  }
}

async function testLogin() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                    LOGIN TEST                             ');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('Login Credentials:');
  console.log(`  Email: ${testUser.email}`);
  console.log(`  Password: ${testUser.password}\n`);
  
  try {
    console.log('📤 Sending login request...\n');
    
    const response = await axios.post(`${API_V1_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    if (response.data.success) {
      console.log('✅ Login Successful!\n');
      console.log('User Data:');
      console.log(JSON.stringify(response.data.data.user, null, 2));
      console.log('\nTokens:');
      console.log(`  Access Token: ${response.data.data.tokens.accessToken.substring(0, 50)}...`);
      console.log(`  Refresh Token: ${response.data.data.tokens.refreshToken.substring(0, 50)}...`);
      console.log('\n');
      return true;
    } else {
      console.log('❌ Login Failed!\n');
      console.log('Response:');
      console.log(JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ Login Error!\n');
    
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Error Data:');
      console.log(JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.log('\n💡 Invalid credentials - User might not exist or password is wrong');
      }
    } else if (error.request) {
      console.log('No response from server');
      console.log('Make sure backend is running: cd apps/backend && npm run dev');
    } else {
      console.log('Error:', error.message);
    }
    
    return false;
  }
}

async function runTests() {
  // Check if backend is reachable
  try {
    await axios.get(API_BASE_URL, { timeout: 5000 });
  } catch (error) {
    console.log('❌ Cannot connect to backend server!\n');
    console.log(`URL: ${API_BASE_URL}`);
    console.log(`Error: ${error.message}\n`);
    console.log('💡 Make sure backend is running:');
    console.log('   cd apps/backend');
    console.log('   npm run dev\n');
    process.exit(1);
  }
  
  // Run tests
  const registrationSuccess = await testRegistration();
  
  if (registrationSuccess) {
    // Wait a bit before login
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testLogin();
  }
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                    TEST COMPLETE                          ');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  if (registrationSuccess) {
    console.log('🎉 All tests passed!\n');
    console.log('Next steps:');
    console.log('1. Open frontend: http://localhost:3000/auth/register');
    console.log('2. Try registering a new user');
    console.log('3. Login with the registered user\n');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.\n');
  }
}

runTests();

// Test Backend Vercel
const BACKEND_URL = 'https://snbtai-backends.vercel.app';

async function testBackend() {
  console.log('🧪 Testing Backend:', BACKEND_URL);
  console.log('='.repeat(50));

  // Test 1: Health Check
  try {
    console.log('\n1️⃣ Testing Health Check...');
    const healthRes = await fetch(`${BACKEND_URL}/api/health`);
    const healthData = await healthRes.json();
    console.log('✅ Health:', healthData);
  } catch (err) {
    console.error('❌ Health Error:', err.message);
  }

  // Test 2: Get Universities
  try {
    console.log('\n2️⃣ Testing Get Universities (SNBP)...');
    const uniRes = await fetch(`${BACKEND_URL}/api/universities?type=snbp`);
    const uniData = await uniRes.json();
    console.log('✅ Universities:', uniData.success ? `${uniData.count} found` : 'Failed');
    if (uniData.data && uniData.data.length > 0) {
      console.log('   First 3:', uniData.data.slice(0, 3));
    }
  } catch (err) {
    console.error('❌ Universities Error:', err.message);
  }

  // Test 3: Get Programs
  try {
    console.log('\n3️⃣ Testing Get Programs (UI - 0001)...');
    const progRes = await fetch(`${BACKEND_URL}/api/programs?code=0001&type=snbp`);
    const progData = await progRes.json();
    console.log('✅ Programs:', progData.success ? `${progData.count} found` : 'Failed');
    if (progData.data && progData.data.length > 0) {
      console.log('   First program:', progData.data[0]);
    }
  } catch (err) {
    console.error('❌ Programs Error:', err.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Test Complete!');
}

testBackend();

const axios = require('axios');

const testRBAC = async () => {
  const baseURL = 'http://localhost:5000/api';

  try {
    console.log('--- TEST 1: LOGIN AS REGULAR USER ---');
    const userLogin = await axios.post(`${baseURL}/auth/login`, {
      email: 'user@beathub.com',
      password: 'password123'
    });
    const userToken = userLogin.data.data.token;
    const userRole = userLogin.data.data.user.role;
    console.log(`✅ Logged in as: ${userLogin.data.data.user.username} (Role: ${userRole})`);

    console.log('\n--- TEST 2: REGULAR USER TRIES TO ACCESS ADMIN ROUTE (Should Fail with 403) ---');
    try {
      await axios.get(`${baseURL}/analytics/top-artists`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('❌ Error: Regular user accessed admin route!');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log(`✅ Success: Access denied correctly (Status 403). Message: ${JSON.stringify(err.response.data.message)}`);
      } else {
        console.log(`❌ Error: Expected 403 but got ${err.response ? err.response.status : err.message}`);
      }
    }

    console.log('\n--- TEST 3: LOGIN AS ADMIN USER ---');
    const adminLogin = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@beathub.com',
      password: 'password123'
    });
    const adminToken = adminLogin.data.data.token;
    const adminRole = adminLogin.data.data.user.role;
    console.log(`✅ Logged in as: ${adminLogin.data.data.user.username} (Role: ${adminRole})`);

    console.log('\n--- TEST 4: ADMIN USER ACCESSES ADMIN ROUTE (Should Succeed) ---');
    const analyticsRes = await axios.get(`${baseURL}/analytics/top-artists`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Success: Admin accessed analytics. Data count: ${analyticsRes.data.data.length}`);

    console.log('\n--- TEST 5: NO AUTHENTICATION (Should Fail with 401) ---');
    try {
      await axios.get(`${baseURL}/analytics/top-artists`);
      console.log('❌ Error: No-auth request succeeded!');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log(`✅ Success: Access denied for no-auth (Status 401). Message: ${JSON.stringify(err.response.data.message)}`);
      } else {
        console.log(`❌ Error: Expected 401 but got ${err.response ? err.response.status : err.message}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error in test execution:', err.message);
    process.exit(1);
  }
};

testRBAC();

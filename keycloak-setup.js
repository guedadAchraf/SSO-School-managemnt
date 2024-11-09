const axios = require('axios');
const fs = require('fs');
const path = require('path');

const KEYCLOAK_URL = 'http://localhost:8080/auth';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';
const MAX_RETRIES = 10;
const RETRY_DELAY = 10000;
const INITIAL_DELAY = 20000;

async function checkKeycloakHealth() {
  try {
    const response = await axios.get(`${KEYCLOAK_URL}/health`, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

async function waitForKeycloak() {
  console.log('Waiting for Keycloak to start...');
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      console.log(`Attempting to connect to Keycloak (attempt ${i + 1}/${MAX_RETRIES})...`);
      
      // Try health endpoint first
      const isHealthy = await checkKeycloakHealth();
      if (isHealthy) {
        console.log('Keycloak health check passed!');
      }
      
      // Try main endpoint
      const response = await axios.get(`${KEYCLOAK_URL}`, { timeout: 5000 });
      if (response.status === 200) {
        console.log('Keycloak is ready!');
        // Add extra delay to ensure full initialization
        await new Promise(resolve => setTimeout(resolve, 5000));
        return true;
      }
    } catch (error) {
      const retryIn = RETRY_DELAY / 1000;
      console.log(`Keycloak not ready yet (${error.message}), waiting ${retryIn} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  throw new Error('Failed to connect to Keycloak after multiple attempts');
}

async function getAdminToken() {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const tokenResponse = await axios.post(
        `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
        new URLSearchParams({
          username: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
          grant_type: 'password',
          client_id: 'admin-cli'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 10000
        }
      );
      return tokenResponse.data.access_token;
    } catch (error) {
      if (i === MAX_RETRIES - 1) throw error;
      console.log(`Failed to get admin token (${error.message}), retrying in ${RETRY_DELAY/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  throw new Error('Failed to get admin token after multiple attempts');
}

async function setupKeycloak() {
  try {
    await waitForKeycloak();
    
    console.log('Getting admin token...');
    const adminToken = await getAdminToken();
    console.log('Admin token obtained successfully');

    const headers = {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    };

    const realmConfig = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'realm-config.json'), 'utf8')
    );

    // Delete existing realm if it exists
    try {
      console.log('Attempting to delete existing realm...');
      await axios.delete(
        `${KEYCLOAK_URL}/admin/realms/${realmConfig.realm}`,
        { headers, timeout: 10000 }
      );
      console.log('Existing realm deleted');
      // Wait longer after deletion
      await new Promise(resolve => setTimeout(resolve, 10000));
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No existing realm found');
      } else {
        console.log('Error deleting realm:', error.message);
      }
    }

    // Create new realm
    console.log('Creating new realm...');
    try {
      await axios.post(
        `${KEYCLOAK_URL}/admin/realms`,
        realmConfig,
        { 
          headers,
          timeout: 30000 // Increased timeout
        }
      );
      console.log('Realm created successfully');

      // Wait for realm to be fully created
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Verify realm creation
      const verifyResponse = await axios.get(
        `${KEYCLOAK_URL}/admin/realms/${realmConfig.realm}`,
        { headers }
      );
      
      if (verifyResponse.status === 200) {
        console.log('Realm verified successfully');
      }

    } catch (error) {
      console.error('Error creating realm:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }

    console.log('Keycloak realm setup completed successfully!');
  } catch (error) {
    console.error('Error setting up Keycloak:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Add a longer initial delay before starting
console.log(`Waiting ${INITIAL_DELAY/1000} seconds before starting setup...`);
setTimeout(() => {
  setupKeycloak().catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}, INITIAL_DELAY);
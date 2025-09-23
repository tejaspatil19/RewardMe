


import logger from '../utils/logger';

const BASE_URL = 'http://localhost:3001';

// Helper for GET requests
const get = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    logger.apiCall('get', endpoint, response);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    logger.error(`Error fetching ${endpoint}`, error);
    throw error;
  }
};


/**
 * Fetch all transactions from the API
 * @returns {Promise<Array>} - Promise resolving to transactions array
 */
export const fetchTransactions = () => get('/transactions');


/**
 * Fetch all customers from the API
 * @returns {Promise<Array>} - Promise resolving to customers array
 */
export const fetchCustomers = () => get('/customers');


/**
 * Fetch transactions for a specific customer
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>} - Promise resolving to transactions array
 */
export const fetchTransactionsByCustomer = (customerId) => get(`/transactions?customerId=${customerId}`);


/**
 * Health check for the API server
 * @returns {Promise<boolean>} - Promise resolving to server status
 */
export const checkServerHealth = async () => {
  try {
    await get('/transactions?_limit=1');
    return true;
  } catch (error) {
    logger.error('Server health check failed', error);
    return false;
  }
};

